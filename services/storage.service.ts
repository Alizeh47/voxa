import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

interface UploadResponse {
  data: {
    path?: string;
    publicUrl?: string;
  } | null;
  error: Error | null;
}

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param fileType The type of file ('image', 'document', etc.)
 * @returns Promise with the upload result
 */
export const uploadFile = async (file: File, fileType: string = 'general'): Promise<UploadResponse> => {
  try {
    // Generate a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileType}/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);
    
    return {
      data: {
        path: data?.path,
        publicUrl
      },
      error: null
    };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return {
      data: null,
      error: error
    };
  }
};

/**
 * Delete a file from Supabase Storage
 * @param filePath The path of the file to delete
 * @returns Promise with the deletion result
 */
export const deleteFile = async (filePath: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.storage
      .from('user-uploads')
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return { error };
  }
};

/**
 * Get a list of files for a user
 */
export const listUserFiles = async (fileType?: 'image' | 'video' | 'audio' | 'document') => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    return { error: userError || new Error('User not authenticated') };
  }
  
  const userId = userData.user.id;
  const path = fileType ? `${userId}/${fileType}s` : userId;
  
  const { data, error } = await supabase
    .storage
    .from('voxa-media')
    .list(path, {
      sortBy: { column: 'created_at', order: 'desc' }
    });
  
  if (error) {
    return { error };
  }
  
  // Get public URLs for all files
  const filesWithUrls = data.map(file => {
    const { data: { publicUrl } } = supabase
      .storage
      .from('voxa-media')
      .getPublicUrl(`${path}/${file.name}`);
    
    return {
      ...file,
      publicUrl
    };
  });
  
  return { data: filesWithUrls, error: null };
};

/**
 * Get a file's public URL
 */
export const getFileUrl = (filePath: string) => {
  const { data: { publicUrl } } = supabase
    .storage
    .from('voxa-media')
    .getPublicUrl(filePath);
  
  return publicUrl;
}; 