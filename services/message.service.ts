import { supabase } from '../utils/supabase';
import type { Message } from '../utils/supabase';

/**
 * Send a new message
 */
export const sendMessage = async (
  conversationId: string, 
  messageText: string, 
  messageType: 'text' | 'image' | 'video' | 'audio' | 'document' = 'text'
) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: userData.user.id,
      message_text: messageText,
      message_type: messageType,
    })
    .select()
    .single();
  
  return { data, error };
};

/**
 * Get messages for a conversation with pagination
 */
export const getMessages = async (conversationId: string, page = 1, limit = 20) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  const { data, error, count } = await supabase
    .from('messages')
    .select('*, sender:sender_id(*)', { count: 'exact' })
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .range(from, to);
  
  return { data, error, count };
};

/**
 * Mark a message as read
 */
export const markMessageAsRead = async (messageId: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  // First check if read receipt already exists
  const { data: existingData } = await supabase
    .from('message_read_status')
    .select()
    .eq('message_id', messageId)
    .eq('user_id', userData.user.id)
    .maybeSingle();
  
  // If already marked as read, return existing data
  if (existingData) {
    return { data: existingData, error: null };
  }
  
  // Otherwise create new read receipt
  const { data, error } = await supabase
    .from('message_read_status')
    .insert({
      message_id: messageId,
      user_id: userData.user.id,
    })
    .select()
    .single();
  
  return { data, error };
};

/**
 * Add a reaction to a message
 */
export const addReaction = async (messageId: string, reaction: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  // Check if reaction already exists
  const { data: existingData } = await supabase
    .from('message_reactions')
    .select()
    .eq('message_id', messageId)
    .eq('user_id', userData.user.id)
    .maybeSingle();
  
  if (existingData) {
    // Update existing reaction
    const { data, error } = await supabase
      .from('message_reactions')
      .update({ reaction })
      .eq('id', existingData.id)
      .select()
      .single();
    
    return { data, error };
  } else {
    // Create new reaction
    const { data, error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: userData.user.id,
        reaction,
      })
      .select()
      .single();
    
    return { data, error };
  }
};

/**
 * Delete a message (soft delete)
 */
export const deleteMessage = async (messageId: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  const { data, error } = await supabase
    .from('messages')
    .update({ is_deleted: true })
    .eq('id', messageId)
    .eq('sender_id', userData.user.id) // Ensure user can only delete their own messages
    .select()
    .single();
  
  return { data, error };
};

/**
 * Subscribe to new messages in a conversation
 */
export const subscribeToMessages = (conversationId: string, callback: (message: Message) => void) => {
  const subscription = supabase
    .channel(`messages:conversation_id=eq.${conversationId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, 
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(subscription);
  };
}; 