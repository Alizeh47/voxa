'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileForm from '../../components/profile/ProfileForm';
import Spinner from '../../components/shared/Spinner';

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();

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
        <p className="text-gray-600 mb-6">Please sign in to view and edit your profile.</p>
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <ProfileForm />
      </div>
    </div>
  );
};

export default ProfilePage; 