import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Stethoscope, Briefcase, DollarSign } from 'lucide-react';

interface ProviderInfoProps {
  formData: {
    specialty: string;
    license: string;
    yearsOfExperience: number | null;
    bio: string;
    consultationFee: number | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onPrevious: () => void;
  loading: boolean;
  error: string | null;
  role: string;
}

const ProviderInfo: React.FC<ProviderInfoProps> = ({
  formData,
  onInputChange,
  onNext,
  onPrevious,
  loading,
  error,
  role,
}) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Skip this step if user is not a provider
  if (role !== 'ROLE_DOCTOR') {
    onNext();
    return null;
  }
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.specialty.trim()) {
      errors.specialty = 'Specialty is required';
    }
    
    if (!formData.license.trim()) {
      errors.license = 'License number is required';
    }
    
    if (formData.yearsOfExperience === null || formData.yearsOfExperience < 0) {
      errors.yearsOfExperience = 'Valid years of experience is required';
    }
    
    if (!formData.bio.trim()) {
      errors.bio = 'Professional bio is required';
    }
    
    if (formData.consultationFee === null || formData.consultationFee <= 0) {
      errors.consultationFee = 'Valid consultation fee is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  // List of medical specialties
  const specialties = [
    'Psychiatry',
    'Psychology',
    'Clinical Psychology',
    'Child Psychology',
    'Neuropsychology',
    'Addiction Psychiatry',
    'Geriatric Psychiatry',
    'Counseling Psychology',
    'Marriage and Family Therapy',
    'School Psychology',
    'Other'
  ];

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

      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Specialty
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Stethoscope className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <select
            id="specialty"
            name="specialty"
            value={formData.specialty}
            onChange={onInputChange}
            className={`block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
              formErrors.specialty ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
          >
            <option value="">Select your specialty</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>
        {formErrors.specialty && (
          <p className="mt-1 text-xs text-red-600">{formErrors.specialty}</p>
        )}
      </div>

      <div>
        <label htmlFor="license" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          License Number
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Briefcase className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="license"
            name="license"
            type="text"
            value={formData.license}
            onChange={onInputChange}
            className={`block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
              formErrors.license ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
            placeholder="e.g., MCI-12345"
          />
        </div>
        {formErrors.license && (
          <p className="mt-1 text-xs text-red-600">{formErrors.license}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Years of Experience
          </label>
          <div className="mt-1">
            <input
              id="yearsOfExperience"
              name="yearsOfExperience"
              type="number"
              min="0"
              value={formData.yearsOfExperience === null ? '' : formData.yearsOfExperience}
              onChange={onInputChange}
              className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
                formErrors.yearsOfExperience ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
            />
          </div>
          {formErrors.yearsOfExperience && (
            <p className="mt-1 text-xs text-red-600">{formErrors.yearsOfExperience}</p>
          )}
        </div>

        <div>
          <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Consultation Fee (₹)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="consultationFee"
              name="consultationFee"
              type="number"
              min="0"
              value={formData.consultationFee === null ? '' : formData.consultationFee}
              onChange={onInputChange}
              className={`block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
                formErrors.consultationFee ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
              placeholder="e.g., 1000"
            />
          </div>
          {formErrors.consultationFee && (
            <p className="mt-1 text-xs text-red-600">{formErrors.consultationFee}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Professional Bio
        </label>
        <div className="mt-1">
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={onInputChange}
            className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
              formErrors.bio ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
            placeholder="Tell patients about your professional background, approach, and areas of expertise"
          />
        </div>
        {formErrors.bio && (
          <p className="mt-1 text-xs text-red-600">{formErrors.bio}</p>
        )}
      </div>

      <div className="pt-4 flex flex-col space-y-3">
        <Button
          type="button"
          className="w-full bg-[#F26E5C] hover:bg-[#e05a47] text-white py-2 px-4"
          onClick={handleSubmit}
          disabled={loading}
        >
          Continue
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onPrevious}
          disabled={loading}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default ProviderInfo;
