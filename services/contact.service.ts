import { supabase } from '../utils/supabase';
import type { User, Contact } from '../utils/supabase';
import { searchUsers as searchUsersService } from './user.service';

interface ContactResponse {
  data: any;
  error: any;
  count?: number;
}

/**
 * Search for users by name or email
 */
export const searchUsers = async (query: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  // Search for users by name or email, excluding the current user
  const { data, error } = await supabase
    .from('users')
    .select()
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .neq('id', userData.user.id)
    .limit(20);
  
  return { data, error };
};

/**
 * Get contacts for the current user
 * @param status Filter contacts by status ('pending', 'accepted', 'blocked')
 */
export const getContacts = async (status: 'pending' | 'accepted' | 'blocked' = 'accepted'): Promise<ContactResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { data: null, error: userError || new Error('User not authenticated') };
    }
    
    const { data, error, count } = await supabase
      .from('contacts')
      .select(`
        *,
        contact:profiles!contacts_contact_id_fkey(*)
      `, { count: 'exact' })
      .eq('user_id', userData.user.id)
      .eq('status', status);
    
    if (error) {
      throw error;
    }
    
    return { data, error: null, count };
  } catch (error: any) {
    console.error('Error getting contacts:', error);
    return { data: null, error };
  }
};

/**
 * Get pending contact requests for the current user
 */
export const getPendingContactRequests = async (): Promise<ContactResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { data: null, error: userError || new Error('User not authenticated') };
    }
    
    const { data, error, count } = await supabase
      .from('contacts')
      .select(`
        *,
        user:profiles!contacts_user_id_fkey(*)
      `, { count: 'exact' })
      .eq('contact_id', userData.user.id)
      .eq('status', 'pending');
    
    if (error) {
      throw error;
    }
    
    return { data, error: null, count };
  } catch (error: any) {
    console.error('Error getting pending contact requests:', error);
    return { data: null, error };
  }
};

/**
 * Send a contact request to another user
 */
export const sendContactRequest = async (contactId: string): Promise<ContactResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { data: null, error: userError || new Error('User not authenticated') };
    }
    
    // Check if contact request already exists
    const { data: existingContact, error: existingError } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('contact_id', contactId)
      .single();
    
    if (existingContact) {
      return { data: null, error: new Error('Contact request already exists') };
    }
    
    // Create new contact request
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: userData.user.id,
        contact_id: contactId,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error sending contact request:', error);
    return { data: null, error };
  }
};

/**
 * Accept a contact request
 */
export const acceptContactRequest = async (requestId: string): Promise<ContactResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { data: null, error: userError || new Error('User not authenticated') };
    }
    
    // Update the contact request status
    const { data: contactRequest, error: requestError } = await supabase
      .from('contacts')
      .update({ status: 'accepted' })
      .eq('id', requestId)
      .eq('contact_id', userData.user.id) // Ensure the request is for this user
      .select()
      .single();
    
    if (requestError) {
      throw requestError;
    }
    
    // Create a reciprocal contact entry
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: userData.user.id,
        contact_id: contactRequest.user_id,
        status: 'accepted'
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error accepting contact request:', error);
    return { data: null, error };
  }
};

/**
 * Reject a contact request
 */
export const rejectContactRequest = async (requestId: string): Promise<ContactResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { data: null, error: userError || new Error('User not authenticated') };
    }
    
    // Delete the contact request
    const { data, error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', requestId)
      .eq('contact_id', userData.user.id) // Ensure the request is for this user
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error rejecting contact request:', error);
    return { data: null, error };
  }
};

/**
 * Block a contact
 */
export const blockContact = async (contactId: string): Promise<ContactResponse> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { data: null, error: userError || new Error('User not authenticated') };
    }
    
    // Update or create a contact entry with blocked status
    const { data, error } = await supabase
      .from('contacts')
      .upsert({
        user_id: userData.user.id,
        contact_id: contactId,
        status: 'blocked'
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error blocking contact:', error);
    return { data: null, error };
  }
};

/**
 * Subscribe to contact status changes
 */
export const subscribeToContacts = (callback: (contact: Contact) => void) => {
  const userPromise = supabase.auth.getUser();
  
  userPromise.then(({ data: userData }) => {
    if (!userData || !userData.user) {
      return; // Don't subscribe if not authenticated
    }
    
    const subscription = supabase
      .channel('contacts_updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'contacts',
          filter: `user_id=eq.${userData.user.id}`
        }, 
        (payload) => {
          callback(payload.new as Contact);
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'contacts',
          filter: `contact_id=eq.${userData.user.id}`
        }, 
        (payload) => {
          callback(payload.new as Contact);
        }
      )
      .subscribe();
  });
  
  // Return unsubscribe function
  return () => {
    // Unsubscribe from all channels (not ideal but works as a fallback)
    supabase.removeAllChannels();
  };
}; 