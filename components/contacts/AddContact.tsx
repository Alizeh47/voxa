import React, { useState } from 'react';
import { searchUsers, sendContactRequest } from '../../services/contact.service';

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  status?: string;
}

const AddContact: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const { data, error } = await searchUsers(searchQuery);
      
      if (error) {
        throw error;
      }
      
      setSearchResults(data || []);
      
      if (data?.length === 0) {
        setSuccessMessage('No users found matching your search.');
      }
    } catch (err: any) {
      console.error('Error searching users:', err);
      setError(err.message || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      // Add to pending set to disable button
      setPendingRequests(prev => new Set(prev).add(userId));
      
      const { data, error } = await sendContactRequest(userId);
      
      if (error) {
        throw error;
      }
      
      setSuccessMessage('Contact request sent successfully!');
      
      // Remove user from search results
      setSearchResults(prev => prev.filter(user => user.id !== userId));
    } catch (err: any) {
      console.error('Error sending contact request:', err);
      setError(err.message || 'Failed to send contact request');
      
      // Remove from pending set on error
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Contacts</h2>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email"
            className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className={`px-4 py-2 rounded-r-md ${
              loading || !searchQuery.trim()
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h3 className="text-lg font-medium p-4 border-b">Search Results</h3>
          {searchResults.map((user) => (
            <div key={user.id} className="p-4 border-b last:border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.full_name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      user.full_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleSendRequest(user.id)}
                    disabled={pendingRequests.has(user.id)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pendingRequests.has(user.id)
                        ? 'bg-gray-300 text-gray-500'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {pendingRequests.has(user.id) ? 'Sending...' : 'Add Contact'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {searchResults.length === 0 && searchQuery && !loading && !successMessage && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          <p>No users found matching "{searchQuery}".</p>
          <p className="mt-2">Try a different search term or invite them to join Voxa.</p>
        </div>
      )}
    </div>
  );
};

export default AddContact; 