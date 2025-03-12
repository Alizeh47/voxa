import React, { useEffect, useState } from 'react';
import { getConversations, subscribeToConversations } from '../../services/conversation.service';
import { Conversation } from '../../utils/supabase';
import { useRouter } from 'next/router';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  selectedId?: string;
  onSelect: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ selectedId, onSelect }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const { data, error } = await getConversations();
        
        if (error) {
          throw error;
        }
        
        setConversations(data || []);
      } catch (err: any) {
        console.error('Error fetching conversations:', err);
        setError(err.message || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to conversation updates
    const unsubscribe = subscribeToConversations((updatedConversation) => {
      setConversations(prevConversations => {
        const index = prevConversations.findIndex(c => c.id === updatedConversation.id);
        
        if (index >= 0) {
          // Update existing conversation
          const newConversations = [...prevConversations];
          newConversations[index] = updatedConversation;
          return newConversations;
        } else {
          // Add new conversation
          return [...prevConversations, updatedConversation];
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCreateNewChat = () => {
    router.push('/contacts');
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Conversations</h2>
          <button 
            onClick={handleCreateNewChat}
            className="p-2 bg-blue-600 text-white rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="p-3 border-b border-gray-200 animate-pulse">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="ml-3 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Conversations</h2>
        <button 
          onClick={handleCreateNewChat}
          className="p-2 bg-blue-600 text-white rounded-full"
          aria-label="New conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No conversations yet</p>
            <button 
              onClick={handleCreateNewChat}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Start a new conversation
            </button>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div 
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer ${
                selectedId === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                  {conversation.name ? conversation.name[0].toUpperCase() : 'C'}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{conversation.name || 'Direct Message'}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.last_message?.[0]?.message_text || 'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList; 