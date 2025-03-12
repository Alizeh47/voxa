import { supabase } from '../utils/supabase';

interface UserResponse {
  data: any;
  error: any;
}

/**
 * Search for users by name or email
 * @param query The search query
 * @returns Promise with search results
 */
export const searchUsers = async (query: string): Promise<UserResponse> => {
  try {
    // Get current user to exclude from results
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: [], error: new Error('Not authenticated') };
    }
    
    // Search for users by name or email
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, status')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .neq('id', user.id) // Exclude current user
      .limit(10);
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error searching users:', error);
    return { data: null, error };
  }
};

/**
 * Get a user's profile by ID
 * @param userId The user ID
 * @returns Promise with the user profile
 */
export const getUserProfile = async (userId: string): Promise<UserResponse> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    return { data: null, error };
  }
};

/**
 * Get multiple user profiles by IDs
 * @param userIds Array of user IDs
 * @returns Promise with the user profiles
 */
export const getUserProfiles = async (userIds: string[]): Promise<UserResponse> => {
  try {
    if (userIds.length === 0) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, status')
      .in('id', userIds);
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting user profiles:', error);
    return { data: null, error };
  }
}; 