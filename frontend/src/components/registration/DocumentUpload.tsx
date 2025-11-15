import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, File, X } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import MultiDocumentUpload from './MultiDocumentUpload';

interface DocumentUploadProps {
  identityDocs: File[] | null;
  identityDocUrls: string[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  loading: boolean;
  error: string | null;
  role: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  identityDocs,
  identityDocUrls,
  onFileChange,
  onNext,
  onPrevious,
  loading,
  error,
  role,
}) => {
  // Only show document upload for providers
  const isProvider = role === 'ROLE_DOCTOR';
  
  // Skip document upload for patients
  if (!isProvider) {
    onNext();
    return null;
  }
  
  // Document types for verification
  const documentTypes = [
    {
      id: 'aadhar',
      name: 'Aadhar Card',
      description: 'Upload your Aadhar card for verification',
      required: true,
      maxSize: 5 * 1024 * 1024, // 5MB
      accept: '.pdf,.jpg,.jpeg,.png',
    },
    {
      id: 'pan',
      name: 'PAN Card',
      description: 'Upload your PAN card for verification',
      required: true,
      maxSize: 5 * 1024 * 1024, // 5MB
      accept: '.pdf,.jpg,.jpeg,.png',
    },
    {
      id: 'medical',
      name: 'Medical Registration Certificate',
      description: 'Upload your medical registration certificate',
      required: true,
      maxSize: 10 * 1024 * 1024, // 10MB
      accept: '.pdf,.jpg,.jpeg,.png',
    },
    {
      id: 'other',
      name: 'Other Supporting Document',
      description: 'Upload any other supporting document',
      required: false,
      maxSize: 10 * 1024 * 1024, // 10MB
      accept: '.pdf,.jpg,.jpeg,.png',
    },
  ];
  
  // Map identityDocs to the format expected by MultiDocumentUpload
  const uploadedFiles: Record<string, { file: File; url: string }> = {};
  
  if (identityDocs && identityDocs.length > 0) {
    documentTypes.forEach((doc, index) => {
      if (identityDocs[index]) {
        uploadedFiles[doc.id] = {
          file: identityDocs[index],
          url: identityDocUrls[index] || '',
        };
      }
    });
  }
  
  // Handle file change for a specific document type
  const handleDocumentFileChange = async (documentId: string, file: File | null) => {
    // Find the index of the document in our document types
    const docIndex = documentTypes.findIndex(doc => doc.id === documentId);
    if (docIndex === -1) return;
    
    // Create new arrays for files and URLs
    let newIdentityDocs = identityDocs ? [...identityDocs] : [];
    let newIdentityDocUrls = [...identityDocUrls];
    
    if (file) {
      // Add or replace file at the right position
      while (newIdentityDocs.length <= docIndex) {
        newIdentityDocs.push(null as unknown as File);
      }
      newIdentityDocs[docIndex] = file;
      
      // Add URL if needed
      while (newIdentityDocUrls.length <= docIndex) {
        newIdentityDocUrls.push('');
      }
      newIdentityDocUrls[docIndex] = URL.createObjectURL(file);
    } else {
      // Remove file if null
      if (newIdentityDocs.length > docIndex) {
        newIdentityDocs[docIndex] = null as unknown as File;
        newIdentityDocs = newIdentityDocs.filter(Boolean); // Remove null entries
        
        if (newIdentityDocUrls.length > docIndex) {
          newIdentityDocUrls.splice(docIndex, 1);
        }
      }
    }
    
    // Create a synthetic event to update the files
    const event = {
      target: {
        files: newIdentityDocs.length ? newIdentityDocs : null,
        name: 'identityDocs',
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onFileChange(event, 'identityDocs');
  };

  // Use the new MultiDocumentUpload component
  return (
    <MultiDocumentUpload
      documents={documentTypes}
      onFileChange={handleDocumentFileChange}
      onContinue={onNext}
      onBack={onPrevious}
      uploadedFiles={uploadedFiles}
      loading={loading}
      error={error}
    />
  );
};

export default DocumentUpload;
