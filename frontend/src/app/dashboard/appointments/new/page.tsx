"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "Psychiatrist",
    expertise: "Anxiety, Depression, PTSD",
    rating: 4.9,
    reviews: 124,
    image: "/images/doctors/placeholder.svg",
    nextAvailable: "Today"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Psychologist",
    expertise: "Stress Management, Cognitive Behavioral Therapy",
    rating: 4.7,
    reviews: 98,
    image: "/images/doctors/placeholder.svg",
    nextAvailable: "Tomorrow"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Psychiatrist",
    expertise: "Child & Adolescent Psychiatry, ADHD",
    rating: 4.8,
    reviews: 86,
    image: "/images/doctors/placeholder.svg",
    nextAvailable: "Mar 15"
  },
  {
    id: 4,
    name: "Dr. James Taylor",
    specialty: "Psychologist",
    expertise: "Addiction Recovery, Relationship Counseling",
    rating: 4.6,
    reviews: 72,
    image: "/images/doctors/placeholder.svg",
    nextAvailable: "Mar 16"
  }
];

// Mock data for available time slots
const availableTimeSlots: Record<string, string[]> = {
  "2023-03-15": ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"],
  "2023-03-16": ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
  "2023-03-17": ["09:30 AM", "12:30 PM", "02:30 PM", "05:00 PM"],
};

export default function AppointmentBooking() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [appointmentType, setAppointmentType] = useState<"video" | "in-person">("video");
  const [consultationReason, setConsultationReason] = useState("");
  
  // For demonstrating date selection in a simple way
  const nextThreeDays = [...Array(3)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit appointment
      console.log({
        doctorId: selectedDoctorId,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        reason: consultationReason,
      });
      
      // Navigate to confirmation page
      router.push('/dashboard/appointments/confirmation');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderDoctorSelection = () => {
    return (
      <>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Choose a Specialist</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id}
              className={`relative rounded-lg border p-4 cursor-pointer ${
                selectedDoctorId === doctor.id 
                  ? 'border-[#F26E5C] bg-[#FEF3F2]' 
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setSelectedDoctorId(doctor.id)}
            >
              <div className="flex">
                <div className="mr-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xl text-gray-600 dark:text-gray-300">{doctor.name.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{doctor.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{doctor.specialty}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Expertise: {doctor.expertise}</p>
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{doctor.rating} ({doctor.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Next Available: {doctor.nextAvailable}
                    </span>
                  </div>
                </div>
              </div>
              {selectedDoctorId === doctor.id && (
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-[#F26E5C] rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderDateTimeSelection = () => {
    return (
      <>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Select Date & Time
        </h2>
        
        {/* Selected Doctor info */}
        {selectedDoctorId && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                <span className="text-lg text-gray-600 dark:text-gray-300">
                  {doctors.find(d => d.id === selectedDoctorId)?.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {doctors.find(d => d.id === selectedDoctorId)?.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {doctors.find(d => d.id === selectedDoctorId)?.specialty}
                </p>
              </div>
              <Button 
                variant="ghost" 
                className="ml-auto text-sm text-[#F26E5C]"
                onClick={() => {
                  setSelectedDoctorId(null);
                  setCurrentStep(1);
                }}
              >
                Change
              </Button>
            </div>
          </div>
        )}
        
        {/* Appointment Type */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Appointment Type</h3>
          <div className="flex space-x-4">
            <div 
              className={`flex-1 p-4 border rounded-lg cursor-pointer ${
                appointmentType === 'video' 
                  ? 'border-[#F26E5C] bg-[#FEF3F2]' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setAppointmentType('video')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  appointmentType === 'video' 
                    ? 'border-[#F26E5C] bg-white' 
                    : 'border-gray-400'
                }`}>
                  {appointmentType === 'video' && (
                    <div className="w-3 h-3 rounded-full bg-[#F26E5C]"></div>
                  )}
                </div>
                <span className="ml-2 font-medium">Video Consultation</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Consult with your doctor via secure video call</p>
            </div>
            
            <div 
              className={`flex-1 p-4 border rounded-lg cursor-pointer ${
                appointmentType === 'in-person' 
                  ? 'border-[#F26E5C] bg-[#FEF3F2]' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setAppointmentType('in-person')}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  appointmentType === 'in-person' 
                    ? 'border-[#F26E5C] bg-white' 
                    : 'border-gray-400'
                }`}>
                  {appointmentType === 'in-person' && (
                    <div className="w-3 h-3 rounded-full bg-[#F26E5C]"></div>
                  )}
                </div>
                <span className="ml-2 font-medium">In-Person Visit</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Visit our clinic for a face-to-face consultation</p>
            </div>
          </div>
        </div>
        
        {/* Date Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Select Date</h3>
          <div className="grid grid-cols-3 gap-4">
            {nextThreeDays.map((date) => {
              const dateObj = new Date(date);
              const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              });
              
              return (
                <div
                  key={date}
                  className={`p-4 border rounded-lg text-center cursor-pointer ${
                    selectedDate === date 
                      ? 'border-[#F26E5C] bg-[#FEF3F2]' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <Calendar className="h-5 w-5 mx-auto text-gray-400" />
                  <div className="mt-2 font-semibold">{formattedDate}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Time Selection */}
        {selectedDate && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Select Time</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Using mock data based on date */}
              {(selectedDate && availableTimeSlots[selectedDate] ? availableTimeSlots[selectedDate] : ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]).map((time: string) => (
                <div
                  key={time}
                  className={`p-3 border rounded-lg text-center cursor-pointer ${
                    selectedTime === time 
                      ? 'border-[#F26E5C] bg-[#FEF3F2]' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  <div className="flex items-center justify-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span>{time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderConfirmationStep = () => {
    const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);
    
    return (
      <>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Confirm Your Appointment
        </h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Appointment Details</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Specialist</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedDoctor?.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Specialty</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedDoctor?.specialty}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                }) : ''}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Time</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTime}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Type</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {appointmentType === 'video' ? 'Video Consultation' : 'In-Person Visit'}
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" className="text-sm text-[#F26E5C]" onClick={() => setCurrentStep(2)}>
              Edit Details
            </Button>
          </div>
        </div>
        
        {/* Reason for consultation */}
        <div className="mb-6">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
            Reason for consultation (optional)
          </label>
          <textarea
            id="reason"
            rows={3}
            value={consultationReason}
            onChange={(e) => setConsultationReason(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-[#F26E5C] focus:ring-[#F26E5C]"
            placeholder="Please describe your symptoms or reason for the appointment..."
          />
        </div>
        
        <div className="bg-[#FEF3F2] p-4 rounded-md mb-6">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> By confirming this appointment, you agree to our <a href="/terms" className="text-[#F26E5C] hover:underline">Terms of Service</a> and <a href="/cancellation-policy" className="text-[#F26E5C] hover:underline">Cancellation Policy</a>. You can reschedule or cancel this appointment up to 24 hours before the scheduled time.
          </p>
        </div>
      </>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderDoctorSelection();
      case 2:
        return renderDateTimeSelection();
      case 3:
        return renderConfirmationStep();
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !selectedDoctorId;
    if (currentStep === 2) return !selectedDate || !selectedTime;
    return false;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book an Appointment</h1>
        </div>
        
        {/* Progress Steps */}
        <div className="mt-6">
          <ol className="flex items-center w-full">
            {[
              { step: 1, title: "Select Specialist" },
              { step: 2, title: "Choose Date & Time" },
              { step: 3, title: "Confirmation" }
            ].map(({ step, title }) => (
              <li 
                key={step} 
                className={`flex items-center ${
                  step < 3 ? 'w-full' : ''
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step <= currentStep ? 'bg-[#F26E5C] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {step < currentStep ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step <= currentStep ? 'text-[#F26E5C]' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {title}
                </span>
                {step < 3 && (
                  <div className={`flex-1 h-px ml-2 mr-2 ${
                    step < currentStep ? 'bg-[#F26E5C]' : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      
      {/* Current step content */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        {renderCurrentStep()}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={currentStep === 1 ? 'invisible' : ''}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={isNextDisabled()}
          className="bg-[#F26E5C] hover:bg-[#e05a47] text-white"
        >
          {currentStep === 3 ? 'Confirm Appointment' : 'Continue'}
          {currentStep < 3 && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
