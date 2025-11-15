import React, { useState } from 'react';
import axios, { AxiosProgressEvent } from 'axios';

// Types for the hook
interface FileUploadResponse {
  fileId: string;
  url: string;
  success: boolean;
  contentType: string;
  originalName: string;
  fileSize: number;
}

type UploadCallback = (data: FileUploadResponse | FileUploadResponse[]) => void;

/**
 * Custom hook for file uploads to S3 via the backend API
 */
export const useFileUpload = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  
  /**
   * Upload a single file
   * @param file - The file to upload
   * @param fileType - The type of file ('profile', 'document', etc)
   * @param onSuccess - Callback function when upload is successful
   * @returns {Promise<FileUploadResponse>}
   */
  const uploadFile = async (
    file: File, 
    fileType: string, 
    onSuccess?: (data: FileUploadResponse) => void
  ): Promise<FileUploadResponse> => {
    setUploading(true);
    setError(null);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`/api/files/upload/${fileType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
        }
      });
      
      setUploading(false);
      
      if (response.data && response.data.success) {
        if (onSuccess) {
          onSuccess(response.data);
        }
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to upload file');
      }
    } catch (err: unknown) {
      setUploading(false);
      setError(err instanceof Error ? err.message : 'Error uploading file');
      throw err;
    }
  };
  
  /**
   * Upload multiple files
   * @param files - Array of files to upload
   * @param fileType - The type of files ('documents', 'images', etc)
   * @param onSuccess - Callback function when upload is successful
   * @returns {Promise<FileUploadResponse[]>}
   */
  const uploadMultipleFiles = async (
    files: File[], 
    fileType: string, 
    onSuccess?: (data: FileUploadResponse[]) => void
  ): Promise<FileUploadResponse[]> => {
    setUploading(true);
    setError(null);
    setProgress(0);
    
    try {
      const formData = new FormData();
      
      // Append all files to formData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      const response = await axios.post(`/api/files/upload-multiple/${fileType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
        }
      });
      
      setUploading(false);
      
      if (response.data && response.data.length > 0) {
        if (onSuccess) {
          onSuccess(response.data);
        }
        return response.data;
      } else {
        throw new Error('Failed to upload files');
      }
    } catch (err: unknown) {
      setUploading(false);
      setError(err instanceof Error ? err.message : 'Error uploading files');
      throw err;
    }
  };
  
  return { 
    uploadFile, 
    uploadMultipleFiles, 
    uploading, 
    error, 
    progress 
  };
};
