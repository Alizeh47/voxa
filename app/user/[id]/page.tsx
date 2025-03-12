'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProfileView from '../../../components/profile/ProfileView';
import Spinner from '../../../components/shared/Spinner';

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ params }) => {
  const { user, loading } = useAuth();
  const userId = params.id;

  if (loading) {
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
        <p className="text-gray-600 mb-6">Please sign in to view user profiles.</p>
        <a 
          href="/login" 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </a>
      </div>
    );
  }

  // If viewing own profile, redirect to profile edit page
  if (userId === user.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p>You are viewing your own profile. Would you like to edit it instead?</p>
            <a 
              href="/profile" 
              className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit My Profile
            </a>
          </div>
          
          <ProfileView userId={userId} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <ProfileView userId={userId} />
      </div>
    </div>
  );
};

export default UserProfilePage; 