'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppointments } from '@/hooks/useAppointments';
import { useConsultations } from '@/hooks/useConsultations';
import { Appointment } from '@/lib/api/appointments';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

interface AppointmentDetailParams {
  params: {
    id: string;
  };
}

export default function AppointmentDetail({ params }: AppointmentDetailParams) {
  const router = useRouter();
  const { id } = params;
  const { fetchAppointment, currentAppointment, cancelAppointment, loading: appointmentLoading, error: appointmentError } = useAppointments();
  const { startConsultation, loading: consultationLoading, error: consultationError } = useConsultations();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAppointment = async () => {
      setIsLoading(true);
      await fetchAppointment(id);
      setIsLoading(false);
    };
    
    loadAppointment();
  }, [fetchAppointment, id]);
  
  const handleStartConsultation = async () => {
    const result = await startConsultation(id);
    if (result) {
      router.push(`/video-call/${result.videoSessionId}`);
    }
  };
  
  const handleCancelAppointment = async () => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      const result = await cancelAppointment(id);
      if (result) {
        router.push('/dashboard/appointments');
      }
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'MISSED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  const canStartConsultation = currentAppointment?.status === 'CONFIRMED';
  const canCancel = ['SCHEDULED', 'CONFIRMED'].includes(currentAppointment?.status || '');
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (appointmentError || !currentAppointment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            Error
          </h2>
          <p className="mt-2 text-red-600">
            {appointmentError || 'Appointment not found. It may have been deleted or you may not have permission to view it.'}
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push('/dashboard/appointments')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appointments
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/dashboard/appointments" 
          className="text-gray-500 hover:text-gray-700 inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Appointments
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {currentAppointment.type.replace('_', ' ')}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(currentAppointment.status)}`}>
              {currentAppointment.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(currentAppointment.appointmentTime)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{formatTime(currentAppointment.appointmentTime)} - {formatTime(currentAppointment.endTime)}</p>
                <p className="text-sm text-gray-500">Duration: {currentAppointment.duration} minutes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-medium">{currentAppointment.doctorName}</p>
                <p className="text-sm text-gray-600">{currentAppointment.doctorSpecialization}</p>
              </div>
            </div>
          </div>
          
          {currentAppointment.reasonForVisit && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Reason for Visit</h3>
              <p className="text-gray-700">{currentAppointment.reasonForVisit}</p>
            </div>
          )}
          
          {currentAppointment.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
              <p className="text-gray-700">{currentAppointment.notes}</p>
            </div>
          )}
          
          <div className="mt-8 flex flex-wrap gap-4">
            {canStartConsultation && (
              <Button
                onClick={handleStartConsultation}
                className="flex items-center gap-2"
                disabled={consultationLoading}
              >
                <Video className="h-4 w-4" />
                Start Video Consultation
              </Button>
            )}
            
            {currentAppointment.consultationId && (
              <Link href={`/dashboard/consultations/${currentAppointment.consultationId}`} passHref>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  View Consultation
                </Button>
              </Link>
            )}
            
            {canCancel && (
              <Button
                onClick={handleCancelAppointment}
                variant="destructive"
                className="ml-auto"
                disabled={appointmentLoading}
              >
                Cancel Appointment
              </Button>
            )}
          </div>
        </div>
        
        {consultationError && (
          <div className="p-4 bg-red-50 border-t border-red-100">
            <p className="text-red-600 text-sm">
              {consultationError}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
