# Voxa Supabase Backend Setup

This document provides instructions on how to set up and use the Supabase backend for the Voxa messaging application.

## Supabase Project Details

- **Project URL**: https://iyibitoljdhxpyqgpskw.supabase.co
- **Public Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aWJpdG9samRoeHB5cWdwc2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3OTk3NDAsImV4cCI6MjA1NzM3NTc0MH0.dGr3f3QRk84Trl0fQGS1G-yFlZcwc1rCcz9Jujk2Cmc

## Database Tables

The Supabase backend includes the following tables:

1. **users** - User profiles
2. **contacts** - User relationships (contacts)
3. **conversations** - Chat conversations (direct and group)
4. **conversation_participants** - Members of conversations
5. **messages** - Chat messages
6. **message_read_status** - Read receipts for messages
7. **message_reactions** - Reactions to messages
8. **media_files** - Uploaded media files
9. **user_status_history** - History of user status changes
10. **notifications** - User notifications
11. **user_devices** - Device tokens for push notifications

## Storage Buckets

- **voxa-media** - Storage bucket for media files (images, videos, documents, etc.)

## Frontend Integration

The frontend integration is set up in the following files:

- **utils/supabase.ts** - Supabase client configuration and type definitions
- **services/auth.service.ts** - Authentication services
- **services/conversation.service.ts** - Conversation management
- **services/message.service.ts** - Message handling
- **services/contact.service.ts** - Contact management
- **services/storage.service.ts** - File uploads and storage

## Authentication

The Supabase backend supports the following authentication methods:

1. Email/Password
2. Magic Link
3. OAuth providers (can be enabled in the Supabase dashboard)

Example usage:

```typescript
import { signUp, signIn, signOut } from '../services/auth.service';

// Sign up a new user
const signUpUser = async () => {
  const { data, error } = await signUp('user@example.com', 'password123', 'John Doe');
  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User signed up successfully:', data);
  }
};

// Sign in a user
const signInUser = async () => {
  const { data, error } = await signIn('user@example.com', 'password123');
  if (error) {
    console.error('Error signing in:', error.message);
  } else {
    console.log('User signed in successfully:', data);
  }
};

// Sign out a user
const signOutUser = async () => {
  const { error } = await signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    console.log('User signed out successfully');
  }
};
```

## Real-time Messaging

The Supabase backend supports real-time messaging using Supabase's Realtime feature:

```typescript
import { sendMessage, subscribeToMessages } from '../services/message.service';

// Send a message
const sendNewMessage = async () => {
  const { data, error } = await sendMessage('conversation-id', 'Hello, world!');
  if (error) {
    console.error('Error sending message:', error.message);
  } else {
    console.log('Message sent successfully:', data);
  }
};

// Subscribe to new messages
const unsubscribe = subscribeToMessages('conversation-id', (message) => {
  console.log('New message received:', message);
});

// Later, when you want to unsubscribe
unsubscribe();
```

## File Uploads

The Supabase backend supports file uploads using Supabase Storage:

```typescript
import { uploadFile, getFileUrl } from '../services/storage.service';

// Upload a file
const uploadImage = async (file: File) => {
  const { data, error } = await uploadFile(file, 'image', 'conversation-id');
  if (error) {
    console.error('Error uploading file:', error.message);
  } else {
    console.log('File uploaded successfully:', data);
  }
};

// Get a file URL
const fileUrl = getFileUrl('path/to/file.jpg');
```

## Row-Level Security (RLS)

All tables in the Supabase backend are protected by Row-Level Security (RLS) policies. These policies ensure that users can only access data they are authorized to see.

For example:
- Users can only view their own contacts
- Users can only view messages in conversations they are part of
- Users can only update their own profile information

## Next Steps

1. **Set up OAuth providers** - Configure Google, Facebook, or other OAuth providers in the Supabase dashboard
2. **Configure email templates** - Customize the email templates for password reset, magic links, etc.
3. **Set up push notifications** - Integrate with Firebase Cloud Messaging or other push notification services
4. **Monitor usage** - Keep an eye on your Supabase usage to avoid exceeding limits

## Troubleshooting

If you encounter issues with the Supabase backend:

1. Check the Supabase dashboard for error logs
2. Verify that your RLS policies are correctly configured
3. Ensure that your frontend is using the correct Supabase URL and API key
4. Check that your database schema matches the expected structure

For more information, refer to the [Supabase documentation](https://supabase.com/docs). 