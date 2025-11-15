"use client";

import { useState, useEffect } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  ArrowLeft,
  Video,
  MessageSquare,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Define appointment status options with colors
const STATUS_MAP = {
  'SCHEDULED': { label: 'Scheduled', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Calendar },
  'CONFIRMED': { label: 'Confirmed', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Check },
  'IN_PROGRESS': { label: 'In Progress', color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Clock },
  'COMPLETED': { label: 'Completed', color: 'text-green-600 bg-green-50 border-green-200', icon: Check },
  'CANCELLED': { label: 'Cancelled', color: 'text-red-600 bg-red-50 border-red-200', icon: X },
  'MISSED': { label: 'Missed', color: 'text-gray-600 bg-gray-50 border-gray-200', icon: AlertCircle },
};

// Helper to format date and time
const formatDateTime = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  return {
    date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    dateTime: date.toLocaleString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

export default function AppointmentDetails({ params }: { params: { id: string } }) {
  const { 
    fetchAppointment, 
    currentAppointment, 
    loading, 
    error,
    updateAppointmentStatus
  } = useAppointments();
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  
  useEffect(() => {
    fetchAppointment(params.id);
  }, [fetchAppointment, params.id]);

  useEffect(() => {
    if (currentAppointment?.notes) {
      setNotes(currentAppointment.notes);
    }
  }, [currentAppointment]);
  
  const handleStatusChange = async (status: string) => {
    await updateAppointmentStatus(params.id, status);
    await fetchAppointment(params.id); // Refresh data
  };
  
  const handleSaveNotes = async () => {
    if (!currentAppointment) return;
    
    setIsSavingNotes(true);
    try {
      // This is a mock implementation. Replace with your actual API call.
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Saving notes:', notes);
      
      // If you have an API endpoint to save notes:
      // await updateAppointment(params.id, { notes });
      
      // Update UI optimistically
      if (currentAppointment) {
        currentAppointment.notes = notes;
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F26E5C]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!currentAppointment) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Appointment Not Found</h3>
        <p className="mt-1 text-sm text-gray-500">The appointment you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/provider/appointments">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Appointments
          </Button>
        </Link>
      </div>
    );
  }

  const formattedDateTime = formatDateTime(currentAppointment.appointmentTime);
  const formattedEndTime = currentAppointment.endTime ? formatDateTime(currentAppointment.endTime) : null;
  const statusInfo = STATUS_MAP[currentAppointment.status as keyof typeof STATUS_MAP] || STATUS_MAP.SCHEDULED;
  const StatusIcon = statusInfo.icon;
  
  // Calculate appointment duration in minutes
  const startTime = new Date(currentAppointment.appointmentTime);
  const endTime = new Date(currentAppointment.endTime || '');
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/provider/appointments">
            <Button variant="outline" size="sm" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Appointments
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Appointment Details</h1>
        </div>
        
        <div className={`px-3 py-1 rounded-full border flex items-center ${statusInfo.color}`}>
          <StatusIcon className="h-4 w-4 mr-1" />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main appointment details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">{formattedDateTime.date}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  <span>
                    {formattedDateTime.time} 
                    {formattedEndTime && ` - ${formattedEndTime.time}`} 
                    {durationMinutes ? ` (${durationMinutes} minutes)` : ''}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">Appointment Type</p>
                <p className="text-gray-700">
                  {currentAppointment.type || currentAppointment.consultationType || 'Consultation'}
                </p>
              </div>

              {currentAppointment.reasonForVisit && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-medium">Reason for Visit</p>
                  <p className="text-gray-700">{currentAppointment.reasonForVisit}</p>
                </div>
              )}
              
              {/* Action buttons for appointment */}
              <div className="flex flex-wrap gap-2 pt-2">
                {currentAppointment.status === 'SCHEDULED' && (
                  <>
                    <Button 
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStatusChange('CONFIRMED')}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Confirm Appointment
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-red-600 border-red-600"
                      onClick={() => handleStatusChange('CANCELLED')}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel Appointment
                    </Button>
                  </>
                )}
                
                {currentAppointment.status === 'CONFIRMED' && (
                  <>
                    <Button 
                      variant="default"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleStatusChange('IN_PROGRESS')}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Start Appointment
                    </Button>
                    <Button 
                      variant="outline"
                      className="text-red-600 border-red-600"
                      onClick={() => handleStatusChange('CANCELLED')}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel Appointment
                    </Button>
                  </>
                )}
                
                {currentAppointment.status === 'IN_PROGRESS' && (
                  <Button 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange('COMPLETED')}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Complete Appointment
                  </Button>
                )}
              </div>
              
              {/* Consultation buttons */}
              {['CONFIRMED', 'IN_PROGRESS'].includes(currentAppointment.status) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {(currentAppointment.type?.includes('VIDEO') || currentAppointment.consultationType === 'VIDEO') && (
                    <Link href={`/dashboard/provider/video-call/${currentAppointment.id}`}>
                      <Button className="bg-[#F26E5C] hover:bg-[#E05A4A]">
                        <Video className="mr-2 h-4 w-4" />
                        Join Video Call
                      </Button>
                    </Link>
                  )}
                  
                  <Link href={`/dashboard/provider/messages/${currentAppointment.patientId}`}>
                    <Button variant="outline">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message Patient
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes section */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md min-h-[150px]"
                placeholder="Add notes about this appointment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
              <Button
                className="mt-3 bg-[#F26E5C] hover:bg-[#E05A4A]"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
              >
                {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Patient information sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="mr-3">
                  <Image
                    src={currentAppointment.patientImage || "/images/vectors/avatar-placeholder.png"}
                    alt={currentAppointment.patientName}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{currentAppointment.patientName}</h3>
                  <p className="text-gray-500 text-sm">Patient ID: {currentAppointment.patientId}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>patient@example.com</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link href={`/dashboard/provider/patients/${currentAppointment.patientId}`}>
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    View Patient Records
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Previous appointments with this patient */}
          <Card>
            <CardHeader>
              <CardTitle>Previous Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {/* This would be populated from an API call */}
              <div className="text-center py-4 text-gray-500">
                <p>No previous appointments found.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
