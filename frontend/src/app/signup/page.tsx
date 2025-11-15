"use client";

import React from 'react';
import Link from 'next/link';
import { useRegistration } from '@/hooks/useRegistration';

// Import registration step components
import RegistrationLayout from '@/components/registration/RegistrationLayout';
import PhoneVerification from '@/components/registration/PhoneVerification';
import OtpVerification from '@/components/registration/OtpVerification';
import RoleSelection from '@/components/registration/RoleSelection';
import UserInfo from '@/components/registration/UserInfo';
import ProviderInfo from '@/components/registration/ProviderInfo';
import ProfilePhoto from '@/components/registration/ProfilePhoto';
import DocumentUpload from '@/components/registration/DocumentUpload';
import Verification from '@/components/registration/Verification';

export default function SignupPage() {
  const {
    state,
    handleInputChange,
    handleFileChange,
    nextStep,
    prevStep,
    goToStep,
    sendOtp,
    verifyOtp,
    uploadProfilePhoto,
    uploadIdentityDocs,
    completeRegistration,
  } = useRegistration();
  
  // Define step titles and descriptions
  const steps = [
    {
      title: "Welcome to The Physc",
      subtitle: "Enter your phone number to continue",
      component: PhoneVerification,
    },
    {
      title: "Enter OTP",
      subtitle: "We've sent a verification code to your phone",
      component: OtpVerification,
    },
    {
      title: "How would you like to register?",
      subtitle: "Choose your role to continue the registration process",
      component: RoleSelection,
    },
    {
      title: "Create Your Account",
      subtitle: "Enter your basic information to get started",
      component: UserInfo,
    },
    {
      title: "Professional Details",
      subtitle: "Tell us about your professional background",
      component: ProviderInfo,
    },
    {
      title: "Complete Your Profile",
      subtitle: "Add a profile picture to help patients recognize you",
      component: ProfilePhoto,
    },
    {
      title: "Upload Documents",
      subtitle: "Please upload the required documents for verification",
      component: DocumentUpload,
    },
    {
      title: "Verify and Submit",
      subtitle: "Please verify your uploaded documents before submitting",
      component: Verification,
    },
  ];
  
  // Get current step component
  const CurrentStepComponent = steps[state.step - 1]?.component || null;
  const totalSteps = state.formData.role === 'ROLE_DOCTOR' ? 8 : 6;

  const handleRoleChange = (role: string) => {
    const event = {
      target: {
        name: 'role',
        value: role,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(event);
  };

  return (
    <RegistrationLayout
      title={steps[state.step - 1]?.title || "Registration"}
      subtitle={steps[state.step - 1]?.subtitle || ""}
      step={state.step}
      totalSteps={totalSteps}
      showProgress={state.step > 1}
    >
      {state.step === 1 && (
        <PhoneVerification
          phone={state.formData.phone}
          onPhoneChange={handleInputChange}
          onSendOtp={sendOtp}
          onNext={nextStep}
          loading={state.loading}
          error={state.error}
        />
      )}

      {state.step === 2 && (
        <OtpVerification
          phone={state.formData.phone}
          otp={state.formData.otp}
          onOtpChange={handleInputChange}
          onVerifyOtp={verifyOtp}
          onResendOtp={sendOtp}
          onPrevious={prevStep}
          onNext={nextStep}
          loading={state.loading}
          error={state.error}
        />
      )}

      {state.step === 3 && (
        <RoleSelection
          role={state.formData.role}
          onRoleChange={handleRoleChange}
          onNext={nextStep}
          onPrevious={prevStep}
          loading={state.loading}
        />
      )}

      {state.step === 4 && (
        <UserInfo
          formData={{
            firstName: state.formData.firstName,
            lastName: state.formData.lastName,
            email: state.formData.email,
            password: state.formData.password,
            confirmPassword: state.formData.confirmPassword,
          }}
          onInputChange={handleInputChange}
          onNext={nextStep}
          onPrevious={prevStep}
          loading={state.loading}
          error={state.error}
        />
      )}

      {state.step === 5 && (
        <ProviderInfo
          formData={{
            specialty: state.formData.specialty,
            license: state.formData.license,
            yearsOfExperience: state.formData.yearsOfExperience,
            bio: state.formData.bio,
            consultationFee: state.formData.consultationFee,
          }}
          onInputChange={handleInputChange}
          onNext={nextStep}
          onPrevious={prevStep}
          loading={state.loading}
          error={state.error}
          role={state.formData.role}
        />
      )}

      {state.step === 6 && (
        <ProfilePhoto
          profilePhotoUrl={state.formData.profilePhotoUrl}
          onFileChange={(e) => handleFileChange(e, 'profilePhoto')}
          onNext={nextStep}
          onPrevious={prevStep}
          loading={state.loading}
          error={state.error}
        />
      )}

      {state.step === 7 && (
        <DocumentUpload
          identityDocs={state.formData.identityDocs}
          identityDocUrls={state.formData.identityDocUrls}
          onFileChange={handleFileChange}
          onNext={nextStep}
          onPrevious={prevStep}
          loading={state.loading}
          error={state.error}
          role={state.formData.role}
        />
      )}

      {state.step === 8 && (
        <Verification
          profilePhotoUrl={state.formData.profilePhotoUrl}
          identityDocs={state.formData.identityDocs}
          identityDocUrls={state.formData.identityDocUrls}
          onSubmit={completeRegistration}
          onPrevious={prevStep}
          loading={state.loading}
          error={state.error}
          role={state.formData.role}
        />
      )}
      
      {state.step === 1 && (
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Already have an account?</span>{' '}
          <Link href="/login" className="font-medium text-[#F26E5C] hover:text-[#e05a47]">
            Log in
          </Link>
        </div>
      )}
    </RegistrationLayout>
  );
}
