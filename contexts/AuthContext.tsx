'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signOut, signIn, signUp } from '../services/auth.service';
import { User, supabase } from '../utils/supabase';
import { useRouter } from 'next/navigation';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: Error }>;
  signOut: () => Promise<{ success: boolean; error?: Error }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize Supabase auth state
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          // Fetch user profile if session exists
          const { data, error } = await getCurrentUser();
          
          if (error) {
            throw error;
          }
          
          if (data?.profile) {
            setUser(data.profile);
          }
        }
      } catch (err: any) {
        console.error('Error initializing auth:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch user profile
        const { data } = await getCurrentUser();
        if (data?.profile) {
          setUser(data.profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      // Fetch user profile
      const { data: userData } = await getCurrentUser();
      if (userData?.profile) {
        setUser(userData.profile);
        router.push('/');
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await signUp(email, password, fullName);
      
      if (error) {
        throw error;
      }
      
      if (data?.profile) {
        setUser(data.profile);
        router.push('/');
      }
      
      return { success: true };
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      router.push('/login');
      return { success: true };
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
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