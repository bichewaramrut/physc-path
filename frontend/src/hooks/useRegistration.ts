import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService, { RegisterRequest } from '@/lib/api/auth';

interface RegistrationState {
  step: number;
  formData: {
    // Basic user info
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: string;

    // Phone verification
    otp: string;
    phoneVerified: boolean;

    // Provider-specific fields
    specialty: string;
    license: string;
    yearsOfExperience: number | null;
    bio: string;
    consultationFee: number | null;

    // Patient-specific fields
    dateOfBirth: string;
    gender: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelationship: string;

    // File uploads
    profilePhoto: File | null;
    profilePhotoUrl: string;
    identityDocs: File[] | null;
    identityDocUrls: string[];
  };
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useRegistration = () => {
  const router = useRouter();

  const [state, setState] = useState<RegistrationState>({
    step: 1,
    formData: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'ROLE_PATIENT',
      otp: '',
      phoneVerified: false,
      specialty: '',
      license: '',
      yearsOfExperience: null,
      bio: '',
      consultationFee: null,
      dateOfBirth: '',
      gender: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      profilePhoto: null,
      profilePhotoUrl: '',
      identityDocs: null,
      identityDocUrls: [],
    },
    loading: false,
    error: null,
    success: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    
    if (files) {
      if (fieldName === 'profilePhoto' && files[0]) {
        const profilePhoto = files[0];
        const profilePhotoUrl = URL.createObjectURL(profilePhoto);
        
        setState((prev) => ({
          ...prev,
          formData: {
            ...prev.formData,
            profilePhoto,
            profilePhotoUrl,
          },
        }));
      } else if (fieldName === 'identityDocs') {
        const docsArray = Array.from(files);
        const docUrls = docsArray.map(file => URL.createObjectURL(file));
        
        setState((prev) => ({
          ...prev,
          formData: {
            ...prev.formData,
            identityDocs: docsArray,
            identityDocUrls: docUrls,
          },
        }));
      }
    }
  };

  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      step: prev.step + 1,
    }));
  };

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1),
    }));
  };

  const goToStep = (step: number) => {
    setState((prev) => ({
      ...prev,
      step,
    }));
  };

  const sendOtp = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await AuthService.sendOtp(state.formData.phone);
      
      if (response.data.success) {
        setState((prev) => ({ 
          ...prev, 
          loading: false,
          error: null,
        }));
        return true;
      } else {
        setState((prev) => ({ 
          ...prev, 
          loading: false, 
          error: response.data.message || 'Failed to send OTP' 
        }));
        return false;
      }
    } catch (error: any) {
      setState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to send OTP' 
      }));
      return false;
    }
  };

  const verifyOtp = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await AuthService.verifyOtp({
        phone: state.formData.phone,
        otp: state.formData.otp,
      });
      
      if (response.data.success) {
        setState((prev) => ({ 
          ...prev, 
          loading: false,
          formData: {
            ...prev.formData,
            phoneVerified: true,
          },
          error: null,
        }));
        return true;
      } else {
        setState((prev) => ({ 
          ...prev, 
          loading: false, 
          error: response.data.message || 'Invalid OTP' 
        }));
        return false;
      }
    } catch (error: any) {
      setState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to verify OTP' 
      }));
      return false;
    }
  };

  const uploadProfilePhoto = async () => {
    if (!state.formData.profilePhoto) return true; // Skip if no photo
    
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      // Use the updated auth service method that accepts a File directly
      const response = await AuthService.uploadProfilePhoto(state.formData.profilePhoto);
      console.log('Profile photo upload response:', response);
      
      if (response.success) {
        setState((prev) => ({ 
          ...prev, 
          loading: false,
          formData: {
            ...prev.formData,
            profilePhotoUrl: response.url,
          },
          error: null,
        }));
        return true;
      } else {
        setState((prev) => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to upload profile photo' 
        }));
        return false;
      }
    } catch (error: any) {
      setState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to upload profile photo' 
      }));
      return false;
    }
  };

  const uploadIdentityDocs = async () => {
    if (!state.formData.identityDocs || !state.formData.identityDocs.length) return true; // Skip if no docs
    
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      // Use the updated auth service method that accepts File[] directly
      const response = await AuthService.uploadDocuments(Array.from(state.formData.identityDocs));
      console.log('Profile photo upload response:', response);
      if (response.length > 0 && response.every(doc => doc.success)) {
        const docUrls = response.map(doc => doc.url);
        setState((prev) => ({ 
          ...prev, 
          loading: false, 
          error: null,
          formData: {
            ...prev.formData,
            identityDocUrls: docUrls,
          },
        }));
        return true;
      } else {
        setState((prev) => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to upload identity documents' 
        }));
        return false;
      }
    } catch (error: any) {
      setState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to upload identity documents' 
      }));
      return false;
    }
  };

  const completeRegistration = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const { confirmPassword, profilePhoto, profilePhotoUrl, identityDocs, identityDocUrls, otp, phoneVerified, ...userData } = state.formData;
      
      // Format request data according to backend expectations
      const requestData: RegisterRequest = {
        ...userData,
        yearsOfExperience: userData.yearsOfExperience || undefined,
        consultationFee: userData.consultationFee || undefined,
        role: userData.role, // 'ROLE_PATIENT' or 'ROLE_DOCTOR'
        profilePhotoUrl: profilePhotoUrl || '',
        identityDocsUrls: identityDocUrls.length > 0 ? identityDocUrls : [],
      };
      
      // Upload profile photo if exists
      await uploadProfilePhoto();
      
      // Upload identity documents if provider
      if (userData.role === 'ROLE_DOCTOR') {
        await uploadIdentityDocs();
      }
      
      // Submit registration
      if(!state.error){
        throw new Error('Please resolve all errors before submitting');
      }
      const response = await AuthService.register(requestData);
      
      if (response.data) {
        // Save token and user info to local storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          roles: response.data.roles,
          profileType: response.data.profileType,
          profileId: response.data.profileId,
        }));
        
        setState((prev) => ({ 
          ...prev, 
          loading: false,
          success: true,
          error: null,
        }));
        
        // Redirect to dashboard
        router.push('/dashboard');
        return true;
      } else {
        setState((prev) => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to register user' 
        }));
        return false;
      }
    } catch (error: any) {
      setState((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to register user' 
      }));
      return false;
    }
  };

  return {
    state,
    setState,
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
  };
};
