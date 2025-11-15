"use client";

import { useState, useEffect } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, MessageSquare, User, Check, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Define appointment status options
const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Scheduled', icon: Calendar },
  { value: 'CONFIRMED', label: 'Confirmed', icon: Check },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: Clock },
  { value: 'COMPLETED', label: 'Completed', icon: Check },
  { value: 'CANCELLED', label: 'Cancelled', icon: X },
  { value: 'MISSED', label: 'Missed', icon: AlertCircle },
];

// Helper to format date and time
const formatDateTime = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  return {
    date: date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

// Component to render each appointment card
const AppointmentCard = ({ appointment, onStatusChange }: { 
  appointment: any; 
  onStatusChange: (id: string, status: string) => void;
}) => {
  const { date, time } = formatDateTime(appointment.appointmentTime);
  
  // Find the status object
  const statusObj = STATUS_OPTIONS.find(s => s.value === appointment.status) || STATUS_OPTIONS[0];
  const StatusIcon = statusObj.icon;
  
  // Determine button options based on current status
  const getStatusButtons = () => {
    switch(appointment.status) {
      case 'SCHEDULED':
        return (
          <>
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => onStatusChange(appointment.id, 'CONFIRMED')}
            >
              Confirm
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-600"
              onClick={() => onStatusChange(appointment.id, 'CANCELLED')}
            >
              Cancel
            </Button>
          </>
        );
        
      case 'CONFIRMED':
        return (
          <>
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => onStatusChange(appointment.id, 'IN_PROGRESS')}
            >
              Start Session
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-600"
              onClick={() => onStatusChange(appointment.id, 'CANCELLED')}
            >
              Cancel
            </Button>
          </>
        );
        
      case 'IN_PROGRESS':
        return (
          <Button 
            variant="outline" 
            className="bg-green-50 text-green-600 border-green-600"
            onClick={() => onStatusChange(appointment.id, 'COMPLETED')}
          >
            Complete
          </Button>
        );
        
      default:
        return null;
    }
  };
  
  const getConsultationButton = () => {
    // Only show consultation buttons for confirmed or in-progress appointments
    if (!['CONFIRMED', 'IN_PROGRESS'].includes(appointment.status)) {
      return null;
    }
    
    if (appointment.type.includes('VIDEO') || appointment.consultationType === 'VIDEO') {
      return (
        <Link href={`/dashboard/provider/video-call/${appointment.id}`}>
          <Button variant="secondary" className="w-full mt-2">
            <Video className="h-4 w-4 mr-2" />
            Join Video Call
          </Button>
        </Link>
      );
    } else if (appointment.type.includes('CHAT') || appointment.consultationType === 'CHAT') {
      return (
        <Link href={`/dashboard/provider/messages/${appointment.patientId}`}>
          <Button variant="secondary" className="w-full mt-2">
            <MessageSquare className="h-4 w-4 mr-2" />
            Open Chat
          </Button>
        </Link>
      );
    }
    return null;
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
            <Image 
              src={appointment.patientImage || "/images/vectors/avatar-placeholder.png"} 
              alt={appointment.patientName} 
              width={64} 
              height={64} 
              className="rounded-full"
            />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{appointment.patientName}</h3>
                <p className="text-sm text-gray-500">
                  {appointment.type || appointment.consultationType}
                </p>
              </div>
              <div className="flex items-center">
                <StatusIcon className={`h-4 w-4 mr-1 ${
                  appointment.status === 'CANCELLED' ? 'text-red-600' :
                  appointment.status === 'COMPLETED' ? 'text-green-600' :
                  appointment.status === 'IN_PROGRESS' ? 'text-blue-600' :
                  'text-yellow-600'
                }`} />
                <span className={`text-sm ${
                  appointment.status === 'CANCELLED' ? 'text-red-600' :
                  appointment.status === 'COMPLETED' ? 'text-green-600' :
                  appointment.status === 'IN_PROGRESS' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {statusObj.label}
                </span>
              </div>
            </div>
            
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">{date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-sm text-gray-500">{time}</span>
              </div>
            </div>
            
            {appointment.reasonForVisit && (
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Reason: </span>
                {appointment.reasonForVisit}
              </p>
            )}
            
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap sm:space-x-2">
                {getStatusButtons()}
              </div>
              <div className="mt-2 sm:mt-0">
                <Link href={`/dashboard/provider/appointments/${appointment.id}`}>
                  <Button variant="link" size="sm" className="text-blue-600">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
            
            {getConsultationButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProviderAppointments() {
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  const { 
    fetchAppointments, 
    appointments, 
    loading, 
    error,
    updateAppointmentStatus
  } = useAppointments();
  
  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === 'upcoming') {
        await fetchAppointments({ status: 'SCHEDULED,CONFIRMED' });
      } else if (activeTab === 'completed') {
        await fetchAppointments({ status: 'COMPLETED' });
      } else if (activeTab === 'cancelled') {
        await fetchAppointments({ status: 'CANCELLED,MISSED' });
      }
    };
    
    fetchData();
  }, [fetchAppointments, activeTab]);
  
  const handleStatusChange = async (id: string, status: string) => {
    await updateAppointmentStatus(id, status);
    // Refresh appointments after status change
    if (activeTab === 'upcoming') {
      await fetchAppointments({ status: 'SCHEDULED,CONFIRMED' });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Link href="/dashboard/provider/availability">
          <Button className="flex items-center bg-[#F26E5C] hover:bg-[#E05A4A] text-white">
            <Clock className="mr-2 h-4 w-4" />
            Manage Availability
          </Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F26E5C]"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <TabsContent value="upcoming" className="mt-0">
            {!loading && appointments && appointments.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Upcoming Appointments</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any upcoming appointments scheduled.</p>
              </div>
            )}
            
            {!loading && appointments && appointments.map((appointment: any) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                onStatusChange={handleStatusChange}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {!loading && appointments && appointments.length === 0 && (
              <div className="text-center py-8">
                <Check className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Completed Appointments</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any completed appointments yet.</p>
              </div>
            )}
            
            {!loading && appointments && appointments.map((appointment: any) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                onStatusChange={handleStatusChange}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-0">
            {!loading && appointments && appointments.length === 0 && (
              <div className="text-center py-8">
                <X className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Cancelled Appointments</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any cancelled appointments.</p>
              </div>
            )}
            
            {!loading && appointments && appointments.map((appointment: any) => (
              <AppointmentCard 
                key={appointment.id} 
                appointment={appointment} 
                onStatusChange={handleStatusChange}
              />
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
