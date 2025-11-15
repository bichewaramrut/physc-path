import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, File } from 'lucide-react';

interface VerificationProps {
  profilePhotoUrl: string;
  identityDocs: File[] | null;
  identityDocUrls: string[];
  onSubmit: () => Promise<boolean>;
  onPrevious: () => void;
  loading: boolean;
  error: string | null;
  role: string;
}

const Verification: React.FC<VerificationProps> = ({
  profilePhotoUrl,
  identityDocs,
  identityDocUrls,
  onSubmit,
  onPrevious,
  loading,
  error,
  role,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const isProvider = role === 'ROLE_DOCTOR';
  
  const handleSubmit = async () => {
    if (!termsAccepted) return;
    
    setSubmitting(true);
    await onSubmit();
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please verify your uploaded documents before submitting
        </p>
      </div>

      <div className="space-y-4">
        {/* Profile Photo Verification */}
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Profile Photo</h3>
          <div className="flex justify-center">
            {profilePhotoUrl ? (
              <img 
                src={profilePhotoUrl}
                alt="Profile Preview"
                className="w-24 h-24 object-cover rounded"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-400">No photo</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Documents Verification (only for providers) */}
        {isProvider && identityDocs && identityDocs.length > 0 && (
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Uploaded Documents</h3>
            <div className="space-y-2">
              {identityDocs.map((doc, index) => (
                <div key={index} className="flex items-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <File size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Terms and Conditions */}
        <div className="mt-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="h-4 w-4 rounded border-gray-300 text-[#F26E5C] focus:ring-[#F26E5C]"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                I confirm that all information and documents provided are correct and authentic. I understand that providing false information may result in rejection of my profile.
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col space-y-3">
        <Button
          type="button"
          className="w-full bg-[#F26E5C] hover:bg-[#e05a47] text-white py-2 px-4"
          onClick={handleSubmit}
          disabled={loading || submitting || !termsAccepted}
        >
          {submitting ? 'Submitting...' : 'Submit Profile'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onPrevious}
          disabled={loading || submitting}
        >
          Back
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          {isProvider 
            ? "Thank you for applying to join our provider network. We'll review your information and get back to you within 2-3 business days."
            : "Thank you for joining The Physc. You'll be redirected to your dashboard after submission."}
        </p>
      </div>
    </div>
  );
};

export default Verification;
