import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { File, Plus, ArrowRight } from 'lucide-react';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  maxSize: number; // in bytes
  accept: string;
}

interface MultiDocumentUploadProps {
  documents: DocumentType[];
  onFileChange: (documentId: string, file: File | null) => Promise<void>;
  onContinue: () => void;
  onBack: () => void;
  uploadedFiles: Record<string, { file: File; url: string }>;
  loading: boolean;
  error: string | null;
}

const MultiDocumentUpload: React.FC<MultiDocumentUploadProps> = ({
  documents,
  onFileChange,
  onContinue,
  onBack,
  uploadedFiles,
  loading,
  error
}) => {
  const [documentErrors, setDocumentErrors] = useState<Record<string, string>>({});
  
  const handleFileChange = async (documentId: string, file: File | null) => {
    try {
      await onFileChange(documentId, file);
      
      // Clear error for this document if it exists
      if (documentErrors[documentId]) {
        setDocumentErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[documentId];
          return newErrors;
        });
      }
    } catch (error: any) {
      setDocumentErrors(prev => ({
        ...prev,
        [documentId]: error.message || 'Failed to upload document'
      }));
    }
  };
  
  const canContinue = () => {
    // Check if all required documents are uploaded
    const requiredDocuments = documents.filter(doc => doc.required);
    const allRequiredUploaded = requiredDocuments.every(doc => 
      uploadedFiles[doc.id] && uploadedFiles[doc.id].file
    );
    
    return allRequiredUploaded && Object.keys(documentErrors).length === 0;
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Document Verification</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Please upload the following documents for verification
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <FileUpload
            key={doc.id}
            label={doc.name + (doc.required ? ' *' : '')}
            description={doc.description}
            accept={doc.accept}
            maxFileSize={doc.maxSize}
            onFileChange={(file) => handleFileChange(doc.id, file)}
            fileUrl={uploadedFiles[doc.id]?.url}
            fileName={uploadedFiles[doc.id]?.file.name}
            error={documentErrors[doc.id]}
          />
        ))}
        
        {/* Add more documents button */}
        <Button
          type="button"
          variant="outline"
          className="w-full mt-4 border-dashed"
          onClick={() => {
            // You can implement this to allow uploading additional optional documents
            alert('This feature will allow users to upload additional supporting documents');
          }}
        >
          <Plus size={16} className="mr-2" />
          Add Additional Document
        </Button>
      </div>

      <div className="pt-4 flex flex-col space-y-3">
        <Button
          type="button"
          className="w-full bg-[#F26E5C] hover:bg-[#e05a47] text-white py-2 px-4"
          onClick={onContinue}
          disabled={loading || !canContinue()}
        >
          Continue <ArrowRight size={16} className="ml-2" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          <File size={14} className="inline mr-1" />
          Your documents are securely stored and handled in accordance with our privacy policy.
          They will only be used for verification purposes.
        </p>
      </div>
    </div>
  );
};

export default MultiDocumentUpload;
