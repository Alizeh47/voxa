import React, { useEffect, useState } from 'react';
import { getContacts, getPendingContactRequests } from '../../services/contact.service';
import { createDirectConversation } from '../../services/conversation.service';
import { useRouter } from 'next/router';

interface Contact {
  id: string;
  contact: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    status?: string;
  };
  status: 'pending' | 'accepted' | 'blocked';
}

interface PendingRequest {
  id: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        
        // Fetch accepted contacts
        const { data: contactsData, error: contactsError } = await getContacts('accepted');
        
        if (contactsError) {
          throw contactsError;
        }
        
        setContacts(contactsData || []);
        
        // Fetch pending contact requests
        const { data: requestsData, error: requestsError } = await getPendingContactRequests();
        
        if (requestsError) {
          throw requestsError;
        }
        
        setPendingRequests(requestsData || []);
      } catch (err: any) {
        console.error('Error fetching contacts:', err);
        setError(err.message || 'Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleStartConversation = async (contactId: string) => {
    try {
      const { data, error } = await createDirectConversation(contactId);
      
      if (error) {
        throw error;
      }
      
      // Navigate to the conversation
      router.push(`/chat?conversation=${data.id}`);
    } catch (err: any) {
      console.error('Error creating conversation:', err);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const handleAcceptRequest = async (contactId: string) => {
    try {
      // Implementation will be added later
      alert('Accept request functionality will be implemented soon');
    } catch (err: any) {
      console.error('Error accepting request:', err);
      alert('Failed to accept request. Please try again.');
    }
  };

  const handleRejectRequest = async (contactId: string) => {
    try {
      // Implementation will be added later
      alert('Reject request functionality will be implemented soon');
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      alert('Failed to reject request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending requests section */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Pending Requests</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-4 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                      {request.user.avatar_url ? (
                        <img 
                          src={request.user.avatar_url} 
                          alt={request.user.full_name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        request.user.full_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{request.user.full_name}</p>
                      <p className="text-sm text-gray-500">{request.user.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request.user.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.user.id)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Contacts section */}
      <div>
        <h3 className="text-lg font-medium mb-3">Contacts</h3>
        {contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            <p>You don't have any contacts yet.</p>
            <button 
              onClick={() => router.push('/contacts/add')}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Add new contacts
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-4 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                      {contact.contact.avatar_url ? (
                        <img 
                          src={contact.contact.avatar_url} 
                          alt={contact.contact.full_name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        contact.contact.full_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{contact.contact.full_name}</p>
                      <p className="text-sm text-gray-500">{contact.contact.email}</p>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleStartConversation(contact.contact.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList; 