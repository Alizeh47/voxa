import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '../shared/Spinner';
import { getUserProfile } from '../../services/user.service';
import { startConversation } from '../../services/conversation.service';
import { sendContactRequest } from '../../services/contact.service';

interface ProfileViewProps {
  userId: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  status: string;
  created_at: string;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userId }) => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await getUserProfile(userId);
        
        if (error) {
          throw error;
        }
        
        setProfile(data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleMessage = async () => {
    if (!profile) return;
    
    try {
      setActionLoading(true);
      
      const { data, error } = await startConversation(profile.id);
      
      if (error) {
        throw error;
      }
      
      // Navigate to the conversation
      router.push(`/chat/${data.id}`);
    } catch (err: any) {
      console.error('Error starting conversation:', err);
      setError(err.message || 'Failed to start conversation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!profile) return;
    
    try {
      setActionLoading(true);
      
      const { error } = await sendContactRequest(profile.id);
      
      if (error) {
        throw error;
      }
      
      // Show success message or update UI
      alert('Contact request sent!');
    } catch (err: any) {
      console.error('Error sending contact request:', err);
      setError(err.message || 'Failed to send contact request');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover photo area */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      {/* Profile info */}
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4 sm:mb-0 sm:mr-6">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl">
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Status indicator */}
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
              profile.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
          
          {/* User info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            <p className="text-gray-600 mb-2">{profile.email}</p>
            
            {/* Status text */}
            <p className="text-sm text-gray-500 mb-4">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                profile.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              {profile.status === 'online' ? 'Online' : 'Offline'}
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleMessage}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                Message
              </button>
              
              <button
                onClick={handleAddContact}
                disabled={actionLoading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
        
        {/* Bio */}
        {profile.bio && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Bio</h2>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}
        
        {/* Member since */}
        <div className="mt-6 text-sm text-gray-500">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

 