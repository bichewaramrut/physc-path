"use client";

import { useState } from 'react';
import EnhancedVideoCallInterface from '@/components/organisms/EnhancedVideoCall/EnhancedVideoCallInterface';

export default function TestVideoCall() {
  const [isInCall, setIsInCall] = useState(false);

  const mockPatientData = {
    id: 'test-patient-123',
    name: 'Test Patient',
    phone: '+1234567890'
  };

  const mockDoctorData = {
    id: 'test-doctor-456', 
    name: 'Dr. Test',
    specialty: 'Cardiology'
  };

  if (!isInCall) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">WebSocket Video Call Test</h1>
          <p className="mb-4">Click to start a test video call and check WebSocket connection.</p>
          <button 
            onClick={() => setIsInCall(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Start Test Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <EnhancedVideoCallInterface
        sessionId="test-session-789"
        patientInfo={mockPatientData}
        doctorInfo={mockDoctorData}
        onSessionEnd={() => setIsInCall(false)}
      />
    </div>
  );
}
