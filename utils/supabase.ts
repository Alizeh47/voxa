import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://iyibitoljdhxpyqgpskw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aWJpdG9samRoeHB5cWdwc2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3OTk3NDAsImV4cCI6MjA1NzM3NTc0MH0.dGr3f3QRk84Trl0fQGS1G-yFlZcwc1rCcz9Jujk2Cmc';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions
export interface User {
  id: string;
  full_name: string;
  avatar_url?: string;
  email: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  last_seen?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message?: Message[];
  conversation_participants?: ConversationParticipant[];
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  is_admin: boolean;
  joined_at: string;
  users?: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  message_text: string;
  attachments?: string[];
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  message_reactions?: MessageReaction[];
  message_read_status?: MessageReadStatus[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface MessageReadStatus {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface MediaFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  conversation_id?: string;
  message_id?: string;
  created_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  contact_id: string;
  contact_name?: string;
  created_at: string;
  updated_at: string;
  contact_user?: User;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'message' | 'reaction' | 'mention' | 'system';
  content: string;
  is_read: boolean;
  related_id?: string;
  created_at: string;
}

// Helper functions
export const getFileUrl = (path: string) => {
  const { data } = supabase.storage.from('voxa-media').getPublicUrl(path);
  return data.publicUrl;
}; 