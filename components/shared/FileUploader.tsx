import React, { useState, useRef } from 'react';
import { uploadFile } from '../../services/storage.service';

interface FileUploaderProps {
  onUploadComplete?: (fileUrl: string, fileType: string) => void;
  onUploadError?: (error: Error) => void;
  conversationId?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  onUploadError,
  conversationId,
  maxSizeMB = 100, // Default max size is 100MB
  allowedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'],
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const errorMessage = `File size exceeds the maximum allowed size of ${maxSizeMB}MB`;
      setError(errorMessage);
      if (onUploadError) onUploadError(new Error(errorMessage));
      return;
    }
    
    // Determine file type
    let fileType: 'image' | 'video' | 'audio' | 'document' = 'document';
    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type.startsWith('video/')) {
      fileType = 'video';
    } else if (file.type.startsWith('audio/')) {
      fileType = 'audio';
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
      
      const { data, error } = await uploadFile(file, fileType, conversationId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (error) {
        throw error;
      }
      
      // Call the onUploadComplete callback with the file URL
      if (onUploadComplete && data) {
        onUploadComplete(data.publicUrl, fileType);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Failed to upload file');
      if (onUploadError) onUploadError(err);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      
      {isUploading && (
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-1">Uploading file... {uploadProgress}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={allowedTypes.join(',')}
        disabled={isUploading}
      />
      
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        className={`flex items-center px-4 py-2 rounded-md ${
          isUploading 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
};

export default FileUploader; 