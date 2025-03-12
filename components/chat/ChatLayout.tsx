import React, { useState } from 'react';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useAuth } from '../../contexts/AuthContext';

const ChatLayout: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="mb-4">You need to be signed in to access the chat.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with conversations */}
      <div className="w-1/4 bg-white border-r">
        <ConversationList 
          selectedId={selectedConversation || undefined}
          onSelect={setSelectedConversation}
        />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-hidden">
              <MessageList conversationId={selectedConversation} />
            </div>
            <MessageInput conversationId={selectedConversation} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-medium mb-2">Your Messages</h3>
              <p className="mb-4">Select a conversation or start a new one</p>
              <a href="/contacts" className="text-blue-600 hover:text-blue-800">
                Find contacts
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout; 