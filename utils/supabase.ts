import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyibitoljdhxpyqgpskw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aWJpdG9samRoeHB5cWdwc2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3OTk3NDAsImV4cCI6MjA1NzM3NTc0MH0.dGr3f3QRk84Trl0fQGS1G-yFlZcwc1rCcz9Jujk2Cmc';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase tables
export type User = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_text?: string;
  message_type: 'text' | 'image' | 'video' | 'audio' | 'document';
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
};

export type Contact = {
  id: string;
  user_id: string;
  contact_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  updated_at: string;
};

export type MediaFile = {
  id: string;
  message_id: string;
  sender_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size: number;
  content_type: string;
  created_at: string;
}; 