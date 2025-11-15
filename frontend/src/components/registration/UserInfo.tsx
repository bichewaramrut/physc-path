import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

interface UserInfoProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onPrevious: () => void;
  loading: boolean;
  error: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({
  formData,
  onInputChange,
  onNext,
  onPrevious,
  loading,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            First name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={onInputChange}
              className={`block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
                formErrors.firstName ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
              placeholder="First name"
            />
          </div>
          {formErrors.firstName && (
            <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Last name
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={onInputChange}
              className={`block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
                formErrors.lastName ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
              } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
              placeholder="Last name"
            />
          </div>
          {formErrors.lastName && (
            <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email address
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            className={`block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
              formErrors.email ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
            placeholder="you@example.com"
          />
        </div>
        {formErrors.email && (
          <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={onInputChange}
            className={`block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
              formErrors.password ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
            placeholder="••••••••"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {formErrors.password && (
          <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Confirm password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={onInputChange}
            className={`block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ${
              formErrors.confirmPassword ? 'ring-red-500' : 'ring-gray-300 dark:ring-gray-600'
            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6`}
            placeholder="••••••••"
          />
        </div>
        {formErrors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{formErrors.confirmPassword}</p>
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

export default UserInfo;
