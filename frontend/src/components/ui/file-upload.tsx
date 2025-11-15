import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Eye, File as FileIcon } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxFileSize?: number; // in bytes
  label: string;
  description?: string;
  onFileChange: (file: File | null) => Promise<void>;
  fileUrl?: string;
  fileName?: string;
  error?: string;
  allowPreview?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = '*/*',
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  label,
  description,
  onFileChange,
  fileUrl,
  fileName,
  error,
  allowPreview = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>(fileUrl || '');
  const [currentFileName, setCurrentFileName] = useState<string>(fileName || '');
  const [errorMessage, setErrorMessage] = useState<string>(error || '');
  const [showPreview, setShowPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Format bytes to human-readable size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setPreviewUrl('');
      setCurrentFileName('');
      onFileChange(null);
      return;
    }
    
    const file = files[0];
    
    // Check file size
    if (file.size > maxFileSize) {
      setErrorMessage(`File size exceeds the maximum allowed size (${formatFileSize(maxFileSize)})`);
      return;
    }
    
    setErrorMessage('');
    setCurrentFileName(file.name);
    
    // Create preview URL for supported file types
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else if (file.type === 'application/pdf') {
      setPreviewUrl('/images/pdf-icon.png'); // Placeholder PDF icon
    } else {
      setPreviewUrl('');
    }
    
    // Simulate upload progress
    setUploading(true);
    setProgress(0);
    
    const simulateProgress = () => {
      return new Promise<void>((resolve) => {
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += Math.random() * 10;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            setTimeout(() => {
              setUploading(false);
              resolve();
            }, 500);
          }
          setProgress(currentProgress);
        }, 100);
      });
    };
    
    // Wait for the simulated progress before calling onFileChange
    await simulateProgress();
    onFileChange(file);
  };
  
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setPreviewUrl('');
    setCurrentFileName('');
    setUploading(false);
    setProgress(0);
    onFileChange(null);
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle showing preview in a modal
  const handleShowPreview = () => {
    if (previewUrl && allowPreview) {
      setShowPreview(true);
    }
  };
  
  const closePreview = () => {
    setShowPreview(false);
  };
  
  // Determine if the file is previewable
  const isPreviewable = previewUrl && (previewUrl.startsWith('blob:') || previewUrl.startsWith('http'));
  const isImage = previewUrl && !previewUrl.includes('pdf-icon');

  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* File upload area */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            <Upload size={16} className="mr-1" /> Upload
          </Button>
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <div className="mb-2 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}
        
        {/* Upload progress */}
        {uploading && (
          <div className="my-2">
            <Progress value={progress} className="h-1" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Uploading... {Math.round(progress)}%
            </p>
          </div>
        )}
        
        {/* File preview or info */}
        {previewUrl && (
          <div className="mt-2">
            {isImage && (
              <div className="relative w-full h-24 bg-gray-50 dark:bg-gray-800 rounded overflow-hidden mb-2">
                <img
                  src={previewUrl}
                  alt="File preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="flex items-center overflow-hidden">
                <FileIcon size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{currentFileName}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {isPreviewable && allowPreview && (
                  <button
                    type="button"
                    onClick={handleShowPreview}
                    className="p-1 text-blue-500 hover:text-blue-700"
                    title="Preview file"
                  >
                    <Eye size={16} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Preview modal */}
      {showPreview && isPreviewable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-2 max-w-3xl max-h-3xl">
            <button
              type="button"
              onClick={closePreview}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10 bg-white dark:bg-gray-800 rounded-full p-1"
            >
              <X size={20} />
            </button>
            {isImage ? (
              <img src={previewUrl} alt="Preview" className="max-h-[80vh] max-w-full object-contain" />
            ) : (
              <iframe src={previewUrl} title="Document Preview" className="w-full h-[80vh]" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
