import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

interface PhoneVerificationProps {
  phone: string;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendOtp: () => Promise<boolean>;
  onNext: () => void;
  loading: boolean;
  error: string | null;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  phone,
  onPhoneChange,
  onSendOtp,
  onNext,
  loading,
  error,
}) => {
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) return;
    
    setSendingOtp(true);
    const success = await onSendOtp();
    setSendingOtp(false);
    
    if (success) {
      setOtpSent(true);
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

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Phone Number
        </label>
        <div className="mt-2 relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={onPhoneChange}
            placeholder="Enter your phone number"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] sm:text-sm sm:leading-6"
            disabled={loading || sendingOtp || otpSent}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          We'll send a verification code to this number
        </p>
      </div>

      <div>
        <Button
          type="button"
          className="w-full bg-[#F26E5C] hover:bg-[#e05a47] text-white py-2 px-4"
          onClick={handleSendOtp}
          disabled={!phone || phone.length < 10 || loading || sendingOtp || otpSent}
        >
          {sendingOtp ? 'Sending...' : otpSent ? 'Code Sent' : 'Send Verification Code'}
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Make sure your phone number is correct and can receive SMS messages. Standard message and data rates may apply.
        </p>
      </div>
    </div>
  );
};

export default PhoneVerification;
