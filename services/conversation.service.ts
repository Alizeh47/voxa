import { supabase } from '../utils/supabase';
import { Conversation, Message } from '../utils/supabase';

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
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_participants!inner(user_id),
        last_message:messages(
          id,
          message_text,
          created_at,
          user_id
        )
      `)
      .eq('conversation_participants.user_id', user.user.id)
      .order('updated_at', { ascending: false })
      .limit(1, { foreignTable: 'last_message' });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting conversations:', error);
    return { data: null, error };
  }
};

/**
 * Get a single conversation by ID
 */
export const getConversationById = async (conversationId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_participants(
          user_id,
          users(id, full_name, avatar_url)
        )
      `)
      .eq('id', conversationId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error getting conversation:', error);
    return { data: null, error };
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (
  name: string | null,
  participantIds: string[],
  isGroup: boolean = false
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User not authenticated');
    }
    
    // Make sure the current user is included in participants
    if (!participantIds.includes(user.user.id)) {
      participantIds.push(user.user.id);
    }
    
    // Start a transaction
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        name,
        is_group: isGroup,
        created_by: user.user.id
      })
      .select()
      .single();
    
    if (conversationError) {
      throw conversationError;
    }
    
    // Add participants
    const participants = participantIds.map(userId => ({
      conversation_id: conversation.id,
      user_id: userId
    }));
    
    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert(participants);
    
    if (participantsError) {
      throw participantsError;
    }
    
    return { data: conversation, error: null };
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    return { data: null, error };
  }
};

/**
 * Subscribe to conversation updates
 */
export const subscribeToConversations = (callback: (conversation: Conversation) => void) => {
  const userResponse = supabase.auth.getUser();
  
  // We need to handle the Promise properly
  userResponse.then(({ data: userData }) => {
    if (!userData || !userData.user) {
      console.error('User not authenticated');
      return;
    }
    
    const subscription = supabase
      .channel('public:conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${userData.user.id}`
        },
        (payload) => {
          callback(payload.new as Conversation);
        }
      )
      .subscribe();
  });
  
  return () => {
    // Since we can't access the subscription outside the Promise,
    // we'll remove all channels as a fallback
    supabase.removeAllChannels();
  };
};

/**
 * Update a conversation
 */
export const updateConversation = async (
  conversationId: string,
  updates: Partial<Conversation>
) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error updating conversation:', error);
    return { data: null, error };
  }
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (conversationId: string) => {
  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Error deleting conversation:', error);
    return { error };
  }
};

/**
 * Add a participant to a conversation
 */
export const addParticipant = async (conversationId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('conversation_participants')
      .insert({
        conversation_id: conversationId,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error adding participant:', error);
    return { data: null, error };
  }
};

/**
 * Remove a participant from a conversation
 */
export const removeParticipant = async (conversationId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Error removing participant:', error);
    return { error };
  }
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