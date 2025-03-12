import React, { useState, useEffect } from 'react';
import { updateProfile } from '../../services/auth.service';
import { uploadFile } from '../../services/storage.service';
import { useAuth } from '../../contexts/AuthContext';

const ProfileForm: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setBio(user.bio || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      const { data, error } = await uploadFile(file, 'image');
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setAvatarUrl(data.publicUrl);
      }
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const { data, error } = await updateProfile({
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
      });
      
      if (error) {
        throw error;
      }
      
      setSuccessMessage('Profile updated successfully!');
      
      // Refresh user data in context
      refreshUser();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Avatar upload */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
          <div className="flex items-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden mr-4">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
                disabled={isUploading}
              />
              
              <label
                htmlFor="avatar"
                className={`inline-block px-4 py-2 rounded-md cursor-pointer ${
                  isUploading 
                    ? 'bg-gray-300 text-gray-500' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Change Picture'}
              </label>
              
              {isUploading && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-1">Uploading... {uploadProgress}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Bio */}
        <div className="mb-6">
          <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Tell us about yourself"
          />
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || isUploading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading || isUploading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm; 