'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { searchUsers } from '../../services/user.service';
import Spinner from '../../components/shared/Spinner';

interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  status: string;
}

const UsersPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await searchUsers(searchQuery);
      
      if (error) {
        throw error;
      }
      
      setSearchResults(data || []);
      setHasSearched(true);
    } catch (err: any) {
      console.error('Error searching users:', err);
      setError(err.message || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const viewProfile = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="text-gray-600 mb-6">Please sign in to search for users.</p>
        <a 
          href="/login" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Find Users</h1>
        
        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email"
              className="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                loading || !searchQuery.trim() ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Search results */}
        {hasSearched && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            
            {searchResults.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-md">
                <p className="text-gray-600">No users found matching "{searchQuery}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((user) => (
                  <div 
                    key={user.id} 
                    className="border rounded-md p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => viewProfile(user.id)}
                  >
                    <div className="flex items-center">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.full_name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {/* User info */}
                      <div className="flex-1">
                        <h3 className="font-medium">{user.full_name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        
                        {/* Status */}
                        <div className="flex items-center mt-1">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></span>
                          <span className="text-xs text-gray-500">
                            {user.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage; 