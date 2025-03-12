import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signOut } from '../services/auth.service';
import { User, supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  logout: async () => {},
  refreshUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: userError } = await getCurrentUser();
      
      if (userError) {
        throw userError;
      }
      
      if (data) {
        // Fetch additional user data from the users table
        const { data: userData } = await fetch(`/api/users/${data.id}`).then(res => res.json());
        setUser(userData || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
      setError(err as Error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err as Error);
    }
  };

  useEffect(() => {
    refreshUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          refreshUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    error,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider; 