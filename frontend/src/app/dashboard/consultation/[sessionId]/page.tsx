"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedVideoCallInterface from '@/components/organisms/EnhancedVideoCall/EnhancedVideoCallInterface';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Clock, Shield, Wifi } from 'lucide-react';
import { checkBrowserSupport, validateSessionParams } from '@/lib/utils/consultation';

interface ConsultationPageProps {
  params: {
    sessionId: string;
  };
  searchParams: {
    patientId?: string;
    doctorId?: string;
    patientPhone?: string;
    patientName?: string;
    doctorName?: string;
    doctorSpecialty?: string;
  };
}

export default function ConsultationPage({ params, searchParams }: ConsultationPageProps) {
  const router = useRouter();
  const { sessionId } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);

  // Mock data - In production, this would come from your database/API
  const patientInfo = {
    id: searchParams.patientId || 'patient_123',
    name: searchParams.patientName || 'John Doe',
    phone: searchParams.patientPhone || '+1-555-0123'
  };

  const doctorInfo = {
    id: searchParams.doctorId || 'doctor_456',
    name: searchParams.doctorName || 'Dr. Sarah Wilson',
    specialty: searchParams.doctorSpecialty || 'Psychiatrist'
  };

  useEffect(() => {
    // Check browser support
    const support = checkBrowserSupport();
    if (!support.fullSupport) {
      setIsSupported(false);
      setIsLoading(false);
      return;
    }

    // Validate session parameters
    const validation = validateSessionParams({
      sessionId,
      patientId: patientInfo.id,
      doctorId: doctorInfo.id,
      patientPhone: patientInfo.phone
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [sessionId, patientInfo.id, doctorInfo.id, patientInfo.phone]);

  const handleSessionEnd = (sessionData: any) => {
    setIsCallActive(false);
    
    // Show success message and redirect
    setTimeout(() => {
      router.push('/dashboard/consultations?sessionEnded=true');
    }, 2000);
  };

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  // Browser not supported
  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Browser Not Supported
          </h2>
          <p className="text-gray-600 mb-6">
            Your browser doesn't support the required features for video consultations. 
            Please use a modern browser like Chrome, Firefox, Safari, or Edge.
          </p>
          <Button onClick={handleBackToDashboard} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Validation errors
  if (validationErrors.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-6">
          <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Session
          </h2>
          <div className="text-left mb-6">
            <p className="text-gray-600 mb-2">Please check the following:</p>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
          <Button onClick={handleBackToDashboard} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing consultation...</p>
        </div>
      </div>
    );
  }

  // Pre-call lobby
  if (!isCallActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Video Consultation</h1>
                <p className="text-sm text-gray-600">Session ID: {sessionId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              {/* Session Info */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ready to Start Consultation
                </h2>
                <p className="text-gray-600">
                  You're about to join a secure video consultation
                </p>
              </div>

              {/* Participant Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Doctor</h3>
                  <p className="text-lg font-medium text-blue-800">{doctorInfo.name}</p>
                  <p className="text-sm text-blue-600">{doctorInfo.specialty}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-2">Patient</h3>
                  <p className="text-lg font-medium text-green-800">{patientInfo.name}</p>
                  <p className="text-sm text-green-600">{patientInfo.phone}</p>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Wifi className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">HD Video & Audio</h4>
                  <p className="text-sm text-gray-600">Crystal clear communication</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Secure & Private</h4>
                  <p className="text-sm text-gray-600">HIPAA compliant encryption</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Session Recording</h4>
                  <p className="text-sm text-gray-600">Automatic documentation</p>
                </div>
              </div>

              {/* Technical Requirements */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">System Check</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Camera & Microphone Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Stable Internet Connection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>WebRTC Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure Environment</span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button
                  onClick={handleStartCall}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
                >
                  Start Consultation
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  By clicking start, you agree to our terms of service and privacy policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active call interface
  return (
    <EnhancedVideoCallInterface
      sessionId={sessionId}
      patientInfo={patientInfo}
      doctorInfo={doctorInfo}
      onSessionEnd={handleSessionEnd}
    />
  );
}
