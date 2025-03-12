import React, { useEffect, useRef, useState } from 'react';
import { getMessages, subscribeToMessages, markMessageAsRead } from '../../services/message.service';
import { Message } from '../../utils/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

interface MessageListProps {
  conversationId: string;
}

const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Fetch messages when conversation changes
  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    
    const fetchMessages = async () => {
      try {
        const { data, error, count } = await getMessages(conversationId, 1, 20);
        
        if (error) {
          throw error;
        }
        
        const messageData = data || [];
        setMessages(messageData);
        setHasMore(count ? messageData.length < count : false);
        
        // Mark messages as read
        messageData.forEach(message => {
          if (message.sender_id !== user?.id) {
            markMessageAsRead(message.id);
          }
        });
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        setError(err.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Subscribe to new messages
    const unsubscribe = subscribeToMessages(conversationId, (newMessage) => {
      setMessages(prevMessages => {
        // Check if message already exists
        if (prevMessages.some(m => m.id === newMessage.id)) {
          return prevMessages;
        }
        
        // Mark message as read if it's not from the current user
        if (newMessage.sender_id !== user?.id) {
          markMessageAsRead(newMessage.id);
        }
        
        return [...prevMessages, newMessage];
      });
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadMoreMessages = async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      const nextPage = page + 1;
      const { data, error, count } = await getMessages(conversationId, nextPage, 20);
      
      if (error) {
        throw error;
      }
      
      const messageData = data || [];
      setMessages(prevMessages => [...messageData, ...prevMessages]);
      setPage(nextPage);
      setHasMore(count ? messages.length + messageData.length < count : false);
    } catch (err: any) {
      console.error('Error loading more messages:', err);
      setError(err.message || 'Failed to load more messages');
    } finally {
      setLoading(false);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && messages.length === 0) {
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
    <div className="flex flex-col h-full overflow-y-auto p-4">
      {hasMore && (
        <div className="flex justify-center mb-4">
          <button
            onClick={loadMoreMessages}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm ${
              loading ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
      
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message, index) => {
          const isCurrentUser = message.sender_id === user?.id;
          const showDate = index === 0 || 
            new Date(message.created_at).toDateString() !== 
            new Date(messages[index - 1].created_at).toDateString();
          
          return (
            <React.Fragment key={message.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <div className="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600">
                    {format(new Date(message.created_at), 'MMMM d, yyyy')}
                  </div>
                </div>
              )}
              
              <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                    isCurrentUser 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.message_text}
                  <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}`}>
                    {format(new Date(message.created_at), 'h:mm a')}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 