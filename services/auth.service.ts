import { supabase } from '../utils/supabase';

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
export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
      },
    },
  });

  return { data: authData, error };
};

/**
 * Sign in a user with email and password
 */
export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return { data: authData, error };
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<AuthResponse> => {
  const { error } = await supabase.auth.signOut();
  return { data: null, error };
};

/**
 * Get the current user session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

/**
 * Get the current user
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return { data: null, error: error || new Error('No session found') };
  }
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  return { data: user, error: userError };
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

/**
 * Update user profile
 */
export const updateProfile = async (profileData: ProfileUpdateData): Promise<AuthResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { data: null, error: userError || new Error('User not found') };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userData.user.id,
        full_name: profileData.full_name,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Also update the auth metadata if full_name is provided
    if (profileData.full_name) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: profileData.full_name }
      });
      
      if (updateError) {
        console.error('Error updating auth metadata:', updateError);
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in updateProfile:', error);
    return { data: null, error };
  }
}; 