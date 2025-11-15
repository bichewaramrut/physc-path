import React, { useRef, useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface DocumentUploadProps {
  onUploadSuccess?: (fileUrls: string[]) => void;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[];
  multiple?: boolean;
}

export default function DocumentUpload({
  onUploadSuccess,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  multiple = false,
}: DocumentUploadProps) {
  const { uploadFile, uploadMultipleFiles, uploading, error, progress } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string, url: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const fileList: File[] = [];
    let hasInvalidFiles = false;
    
    // Validate files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum allowed size of ${maxFileSize / (1024 * 1024)}MB`);
        hasInvalidFiles = true;
        continue;
      }
      
      // Check file type
      if (allowedFileTypes.length > 0 && !allowedFileTypes.includes(file.type)) {
        alert(`File ${file.name} has an unsupported format. Allowed formats: ${allowedFileTypes.join(', ')}`);
        hasInvalidFiles = true;
        continue;
      }
      
      fileList.push(file);
    }
    
    if (hasInvalidFiles) {
      // Reset input if there were invalid files
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setSelectedFiles(fileList);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      if (multiple) {
        const response = await uploadMultipleFiles(selectedFiles, 'document', (data) => {
          const uploadedDocs = data.map(item => ({
            name: item.originalName,
            url: item.url
          }));
          setUploadedFiles(prev => [...prev, ...uploadedDocs]);
          
          if (onUploadSuccess) {
            onUploadSuccess(data.map(item => item.url));
          }
        });
      } else {
        const response = await uploadFile(selectedFiles[0], 'document', (data) => {
          const uploadedDoc = {
            name: data.originalName,
            url: data.url
          };
          setUploadedFiles(prev => [...prev, uploadedDoc]);
          
          if (onUploadSuccess) {
            onUploadSuccess([data.url]);
          }
        });
      }
      
      // Reset selection
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Documents
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-lg cursor-pointer">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-1 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, PNG (Max {maxFileSize / (1024 * 1024)}MB)
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple={multiple}
              accept={allowedFileTypes.join(',')} 
            />
          </label>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm truncate max-w-xs">{file.name}</span>
                <button 
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className={`mt-3 px-4 py-2 bg-blue-600 text-white rounded-md ${
              uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {uploading ? `Uploading... ${progress}%` : 'Upload Files'}
          </button>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                <span className="text-sm truncate max-w-xs">{file.name}</span>
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
