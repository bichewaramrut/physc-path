import React from 'react';
import { Button } from '@/components/ui/button';
import { User, UserCog } from 'lucide-react';

interface RoleSelectionProps {
  role: string;
  onRoleChange: (role: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  loading: boolean;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  role,
  onRoleChange,
  onNext,
  onPrevious,
  loading,
}) => {
  const handleRoleSelect = (selectedRole: string) => {
    onRoleChange(selectedRole);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-6 rounded-lg border-2 cursor-pointer text-center ${
            role === 'ROLE_PATIENT'
              ? 'border-[#F26E5C] bg-[#F26E5C]/5'
              : 'border-gray-200 dark:border-gray-700 hover:border-[#F26E5C]/50'
          }`}
          onClick={() => handleRoleSelect('ROLE_PATIENT')}
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#F26E5C]/10 rounded-full">
              <User 
                size={32} 
                className={role === 'ROLE_PATIENT' ? 'text-[#F26E5C]' : 'text-gray-400'} 
              />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Patient</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            I'm seeking mental health consultation and support
          </p>
        </div>

        <div
          className={`p-6 rounded-lg border-2 cursor-pointer text-center ${
            role === 'ROLE_DOCTOR'
              ? 'border-[#F26E5C] bg-[#F26E5C]/5'
              : 'border-gray-200 dark:border-gray-700 hover:border-[#F26E5C]/50'
          }`}
          onClick={() => handleRoleSelect('ROLE_DOCTOR')}
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#F26E5C]/10 rounded-full">
              <UserCog 
                size={32} 
                className={role === 'ROLE_DOCTOR' ? 'text-[#F26E5C]' : 'text-gray-400'} 
              />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Provider</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            I'm a mental health professional looking to provide services
          </p>
        </div>
      </div>

      <div className="pt-4 flex flex-col space-y-3">
        <Button
          type="button"
          className="w-full bg-[#F26E5C] hover:bg-[#e05a47] text-white py-2 px-4"
          onClick={onNext}
          disabled={!role || loading}
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
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          {role === 'ROLE_DOCTOR' 
            ? "As a provider, you'll need to complete verification steps to ensure the highest quality of care for our patients."
            : "As a patient, your privacy and security are our highest priorities."}
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
