import { supabase } from '../utils/supabase';
import type { Conversation } from '../utils/supabase';

interface ConversationResponse {
  data: any;
  error: any;
  count?: number;
}

/**
 * Create a new direct message conversation between two users
 */
export const createDirectConversation = async (otherUserId: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  // Check if conversation already exists between these users
  const { data: existingConversations } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userData.user.id)
    .filter('conversation_id', 'in', (qb: any) => {
      qb.select('conversation_id')
        .from('conversation_participants')
        .eq('user_id', otherUserId);
    });
  
  if (existingConversations && existingConversations.length > 0) {
    // Get the first direct conversation
    const { data: conversations } = await supabase
      .from('conversations')
      .select()
      .eq('id', existingConversations[0].conversation_id)
      .eq('is_group', false)
      .limit(1);
    
    if (conversations && conversations.length > 0) {
      return { data: conversations[0], error: null };
    }
  }
  
  // Create new conversation
  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .insert({
      is_group: false,
      created_by: userData.user.id,
    })
    .select()
    .single();
  
  if (conversationError) {
    return { error: conversationError };
  }
  
  // Add participants
  const participants = [
    { conversation_id: conversation.id, user_id: userData.user.id, is_admin: true },
    { conversation_id: conversation.id, user_id: otherUserId, is_admin: false }
  ];
  
  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert(participants);
  
  if (participantsError) {
    return { error: participantsError };
  }
  
  return { data: conversation, error: null };
};

/**
 * Create a new group conversation
 */
export const createGroupConversation = async (name: string, participantIds: string[]) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  // Create new conversation
  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .insert({
      name,
      is_group: true,
      created_by: userData.user.id,
    })
    .select()
    .single();
  
  if (conversationError) {
    return { error: conversationError };
  }
  
  // Add participants including the creator
  const allParticipantIds = [...new Set([...participantIds, userData.user.id])];
  const participants = allParticipantIds.map(id => ({
    conversation_id: conversation.id,
    user_id: id,
    is_admin: id === userData.user.id // Creator is admin
  }));
  
  const { error: participantsError } = await supabase
    .from('conversation_participants')
    .insert(participants);
  
  if (participantsError) {
    return { error: participantsError };
  }
  
  return { data: conversation, error: null };
};

/**
 * Get all conversations for the current user
 */
export const getConversations = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants:conversation_participants(user_id, is_admin),
      last_message:messages(*)
    `)
    .eq('conversation_participants.user_id', userData.user.id)
    .order('updated_at', { ascending: false });
  
  return { data, error };
};

/**
 * Get a single conversation by ID
 */
export const getConversation = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants:conversation_participants(
        user_id, 
        is_admin,
        users:user_id(id, full_name, avatar_url, status)
      )
    `)
    .eq('id', conversationId)
    .single();
  
  return { data, error };
};

/**
 * Add a user to a group conversation
 */
export const addUserToGroup = async (conversationId: string, userId: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  // Check if current user is admin
  const { data: adminCheck } = await supabase
    .from('conversation_participants')
    .select()
    .eq('conversation_id', conversationId)
    .eq('user_id', userData.user.id)
    .eq('is_admin', true)
    .maybeSingle();
  
  if (!adminCheck) {
    return { error: new Error('Only admins can add users to groups') };
  }
  
  // Add the new participant
  const { data, error } = await supabase
    .from('conversation_participants')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      is_admin: false
    })
    .select()
    .single();
  
  return { data, error };
};

/**
 * Remove a user from a group conversation
 */
export const removeUserFromGroup = async (conversationId: string, userId: string) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  // Check if current user is admin or removing themselves
  const { data: adminCheck } = await supabase
    .from('conversation_participants')
    .select()
    .eq('conversation_id', conversationId)
    .eq('user_id', userData.user.id)
    .eq('is_admin', true)
    .maybeSingle();
  
  if (!adminCheck && userData.user.id !== userId) {
    return { error: new Error('Only admins can remove other users from groups') };
  }
  
  // Remove the participant
  const { data, error } = await supabase
    .from('conversation_participants')
    .delete()
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .select()
    .single();
  
  return { data, error };
};

/**
 * Subscribe to conversation updates
 */
export const subscribeToConversations = (callback: (conversation: Conversation) => void) => {
  const userPromise = supabase.auth.getUser();
  
  // We'll check authentication before subscribing
  userPromise.then(({ data: userData }) => {
    if (!userData || !userData.user) {
      return; // Don't subscribe if not authenticated
    }
    
    const subscription = supabase
      .channel('conversations_updates')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'conversations'
        }, 
        (payload) => {
          callback(payload.new as Conversation);
        }
      )
      .subscribe();
      
    // We can't return the unsubscribe function here since we're in a Promise
    // The caller will need to handle unsubscribing separately
  });
  
  // Return unsubscribe function
  return () => {
    // Unsubscribe from all channels (not ideal but works as a fallback)
    supabase.removeAllChannels();
  };
}; 