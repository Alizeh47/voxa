import { supabase } from '../utils/supabase';
import { User } from '../utils/supabase';

export interface AuthResponse {
  data: any;
  error: any;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

/**
 * Sign up a new user
 */
export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    if (authError) {
      throw authError;
    }
    
    if (!authData.user) {
      throw new Error('User creation failed');
    }
    
    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        email,
        status: 'offline',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (profileError) {
      throw profileError;
    }
    
    return { data: { auth: authData, profile: profileData }, error: null };
  } catch (error: any) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
};

/**
 * Sign in a user
 */
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    // Update user status to online
    if (data.user) {
      await supabase
        .from('users')
        .update({
          status: 'online',
          last_seen: new Date().toISOString()
        })
        .eq('id', data.user.id);
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

/**
 * Sign out a user
 */
export const signOut = async () => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    
    // Update user status to offline
    if (userData.user) {
      await supabase
        .from('users')
        .update({
          status: 'offline',
          last_seen: new Date().toISOString()
        })
        .eq('id', userData.user.id);
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { error };
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    if (!data.user) {
      return { data: null, error: null };
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      throw profileError;
    }
    
    return { data: { auth: data.user, profile }, error: null };
  } catch (error: any) {
    console.error('Error getting current user:', error);
    return { data: null, error };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (updates: Partial<User>) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error('User not authenticated');
    }
    
    // Update auth metadata if full_name is provided
    if (updates.full_name) {
      await supabase.auth.updateUser({
        data: { full_name: updates.full_name }
      });
    }
    
    // Update profile
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.user.id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { data: null, error };
  }
};

/**
 * Get the current user session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  return { data, error };
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  return { data, error };
}; 