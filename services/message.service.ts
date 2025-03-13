import { supabase } from '../utils/supabase';
import { Message } from '../utils/supabase';

/**
 * Get messages for a conversation
 */
export const getMessages = async (conversationId: string, limit = 50, offset = 0) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // First check if user is a participant in this conversation
    const { data: participant, error: participantError } = await supabase
      .from('conversation_participants')
      .select()
      .eq('conversation_id', conversationId)
      .eq('user_id', user.user.id)
      .single();
    
    if (participantError || !participant) {
      throw new Error('You are not a participant in this conversation');
    }
    
    // Get messages
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        user:user_id(id, full_name, avatar_url),
        message_reactions(
          id,
          reaction_type,
          user_id
        ),
        message_read_status(
          id,
          user_id,
          read_at
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw error;
    }
    
    // Mark messages as read
    await markMessagesAsRead(conversationId, user.user.id);
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting messages:', error);
    return { data: null, error };
  }
};

/**
 * Send a message
 */
export const sendMessage = async (
  conversationId: string,
  messageText: string,
  attachments: string[] = []
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // Check if user is a participant
    const { data: participant, error: participantError } = await supabase
      .from('conversation_participants')
      .select()
      .eq('conversation_id', conversationId)
      .eq('user_id', user.user.id)
      .single();
    
    if (participantError || !participant) {
      throw new Error('You are not a participant in this conversation');
    }
    
    // Create message
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.user.id,
        message_text: messageText,
        attachments
      })
      .select(`
        *,
        user:user_id(id, full_name, avatar_url)
      `)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Update conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error sending message:', error);
    return { data: null, error };
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (conversationId: string, userId: string) => {
  try {
    // Get unread messages
    const { data: unreadMessages, error: messagesError } = await supabase
      .from('messages')
      .select('id')
      .eq('conversation_id', conversationId)
      .neq('user_id', userId)
      .not('message_read_status', 'cs', `{"user_id":"${userId}"}`);
    
    if (messagesError || !unreadMessages || unreadMessages.length === 0) {
      return { error: null };
    }
    
    // Mark messages as read
    const readStatuses = unreadMessages.map(message => ({
      message_id: message.id,
      user_id: userId,
      read_at: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('message_read_status')
      .insert(readStatuses);
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    return { error };
  }
};

/**
 * Subscribe to new messages in a conversation
 */
export const subscribeToMessages = (conversationId: string, callback: (message: Message) => void) => {
  const userResponse = supabase.auth.getUser();
  
  userResponse.then(({ data: userData }) => {
    if (!userData || !userData.user) {
      console.error('User not authenticated');
      return;
    }
    
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new as Message);
          
          // If the message is from someone else, mark it as read
          if (payload.new.user_id !== userData.user.id) {
            markMessagesAsRead(conversationId, userData.user.id);
          }
        }
      )
      .subscribe();
  });
  
  return () => {
    supabase.removeAllChannels();
  };
};

/**
 * Add a reaction to a message
 */
export const addReaction = async (messageId: string, reactionType: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: user.user.id,
        reaction_type: reactionType
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error adding reaction:', error);
    return { data: null, error };
  }
};

/**
 * Remove a reaction from a message
 */
export const removeReaction = async (messageId: string, reactionType: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', user.user.id)
      .eq('reaction_type', reactionType);
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Error removing reaction:', error);
    return { error };
  }
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