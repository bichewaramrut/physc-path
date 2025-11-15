import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface OtpVerificationProps {
  phone: string;
  otp: string;
  onOtpChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVerifyOtp: () => Promise<boolean>;
  onResendOtp: () => Promise<boolean>;
  onPrevious: () => void;
  onNext: () => void;
  loading: boolean;
  error: string | null;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  phone,
  otp,
  onOtpChange,
  onVerifyOtp,
  onResendOtp,
  onPrevious,
  onNext,
  loading,
  error,
}) => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, canResend]);
  
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) return;
    
    setVerifying(true);
    const success = await onVerifyOtp();
    setVerifying(false);
    
    if (success) {
      onNext();
    }
  };
  
  const handleResendOtp = async () => {
    if (!canResend) return;
    
    const success = await onResendOtp();
    
    if (success) {
      setCountdown(60);
      setCanResend(false);
    }
  };

  // Format phone number for display
  const formatPhone = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
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

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We've sent a verification code to <span className="font-medium">{formatPhone(phone)}</span>
        </p>
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Verification Code
        </label>
        <div className="mt-2">
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            value={otp}
            onChange={onOtpChange}
            placeholder="Enter 6-digit code"
            className="block w-full rounded-md border-0 py-1.5 px-4 text-center text-gray-900 dark:text-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#F26E5C] text-xl tracking-widest sm:leading-6"
            disabled={loading || verifying}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          className="w-full bg-[#F26E5C] hover:bg-[#e05a47] text-white py-2 px-4"
          onClick={handleVerifyOtp}
          disabled={!otp || otp.length < 4 || loading || verifying}
        >
          {verifying ? 'Verifying...' : 'Verify Code'}
        </Button>
        
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-sm font-medium text-[#F26E5C] hover:text-[#e05a47]"
            onClick={onPrevious}
            disabled={loading || verifying}
          >
            Change Phone Number
          </button>
          
          <button
            type="button"
            className={`text-sm font-medium ${
              canResend ? 'text-[#F26E5C] hover:text-[#e05a47]' : 'text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleResendOtp}
            disabled={!canResend || loading || verifying}
          >
            {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
          </button>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Didn't receive the code? Check your phone number and make sure your device can receive SMS messages.
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
