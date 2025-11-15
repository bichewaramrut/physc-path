"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, Clock, Video } from 'lucide-react';

export default function AppointmentConfirmation() {
  const [appointmentDetails, setAppointmentDetails] = useState({
    id: 'APT12345',
    doctor: 'Dr. Sarah Wilson',
    specialty: 'Psychiatrist',
    date: 'March 15, 2023',
    time: '10:00 AM',
    type: 'Video Consultation',
  });

  useEffect(() => {
    // In a real app, you would fetch the details from API or get from state management
    // This is just a placeholder
  }, []);

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          Appointment Confirmed!
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Your appointment has been successfully scheduled.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 mb-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Appointment Details
        </h2>
        
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-500 dark:text-gray-400">Appointment ID</span>
                <span className="font-medium text-gray-900 dark:text-white">{appointmentDetails.id}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Doctor</span>
                <span className="font-medium text-gray-900 dark:text-white">{appointmentDetails.doctor}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Specialty</span>
                <span className="font-medium text-gray-900 dark:text-white">{appointmentDetails.specialty}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[#F26E5C]" />
                  <span className="font-medium text-gray-900 dark:text-white">{appointmentDetails.date}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Time</span>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-[#F26E5C]" />
                  <span className="font-medium text-gray-900 dark:text-white">{appointmentDetails.time}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Type</span>
                <div className="flex items-center">
                  <Video className="h-4 w-4 mr-2 text-[#F26E5C]" />
                  <span className="font-medium text-gray-900 dark:text-white">{appointmentDetails.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-left">
          <h3 className="font-medium text-blue-800 dark:text-blue-300">What happens next?</h3>
          <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 list-disc pl-5 space-y-1">
            <li>You will receive an email confirmation with all the details.</li>
            <li>A calendar invitation will be sent to your email.</li>
            <li>For video consultations, you'll receive a link to join 10 minutes before the scheduled time.</li>
            <li>You can reschedule or cancel your appointment up to 24 hours before the scheduled time.</li>
          </ul>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button asChild>
          <Link href="/dashboard/appointments" className="bg-[#F26E5C] hover:bg-[#e05a47] text-white px-8">
            View All Appointments
          </Link>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            Return to Dashboard
          </Link>
        </Button>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Need help? <Link href="/support" className="text-[#F26E5C] hover:underline">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}
