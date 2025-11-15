import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createNotificationSchedule } from '@/lib/utils/prescription-utils';
import { Medication, Prescription } from '@/lib/api/prescriptions';
import useMedicalRecords from '@/hooks/useMedicalRecords';
import useAppointments from '@/hooks/useAppointments';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorAlert } from "@/components/ui/error-alert";
import { CalendarEventSkeleton, Skeleton } from "@/components/ui/skeleton";

interface MedicationCalendarProps {
  patientId?: string;
  includeAppointments?: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  medication?: Medication;
  appointmentId?: string;
  doctorName?: string;
  type: 'dose' | 'refill' | 'expiry' | 'appointment';
}

export function MedicationCalendar({ patientId, includeAppointments = true }: MedicationCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { prescriptions, loading: prescriptionsLoading, error: prescriptionsError } = useMedicalRecords(patientId);
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments();
  
  const loading = prescriptionsLoading || (includeAppointments && appointmentsLoading);
  const error = prescriptionsError || (includeAppointments ? appointmentsError : null);

  useEffect(() => {
    const allEvents: CalendarEvent[] = [];
    
    // Process prescriptions for medication events
    if (prescriptions?.length) {
      // Process all prescriptions to create calendar events
      prescriptions.forEach((prescription: Prescription) => {
        if (!prescription.medications) return;
        
        // Create medication dose events
        prescription.medications.forEach((medication) => {
          // Generate reminder schedule for the next 30 days
          const reminders = createNotificationSchedule(
            medication,
            undefined, // Use default preferences
            new Date(),
            30 // Generate for the next 30 days
          );
          
          // Convert reminders to calendar events
          reminders.forEach((reminder, index) => {
            allEvents.push({
              id: `${medication.id}-dose-${index}`,
              title: `Take ${medication.name}`,
              date: reminder.time,
              time: format(reminder.time, 'h:mm a'),
              medication,
              type: 'dose'
            });
          });
          
          // Add refill events if applicable
          if (medication.refills !== undefined && medication.refills > 0) {
            const refillDate = new Date();
            refillDate.setDate(refillDate.getDate() + 25); // Assume refill needed in 25 days
            
            allEvents.push({
              id: `${medication.id}-refill`,
              title: `Refill ${medication.name}`,
              date: refillDate,
              time: '9:00 AM',
              medication,
              type: 'refill'
            });
          }
        });
        
        // Add prescription expiry event
        if (prescription.expiryDate) {
          const expiryDate = new Date(prescription.expiryDate);
          
          allEvents.push({
            id: `${prescription.id}-expiry`,
            title: `Prescription expires`,
            date: expiryDate,
            time: format(expiryDate, 'h:mm a'),
            medication: prescription.medications[0],
            type: 'expiry'
          });
        }
      });
      
      
    }
    
    // Add appointment events if requested
    if (includeAppointments && appointments?.length) {
      appointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.scheduledDateTime);
        
        allEvents.push({
          id: `appointment-${appointment.id}`,
          title: appointment.type || 'Medical Appointment',
          date: appointmentDate,
          time: format(appointmentDate, 'h:mm a'),
          appointmentId: appointment.id,
          doctorName: appointment.doctorName,
          type: 'appointment'
        });
      });
    }
    
    setEvents(allEvents);
  }, [prescriptions, appointments, includeAppointments]);

  // Group events by date for the selected day
  const selectedDateEvents = events.filter(event => 
    date && isSameDay(event.date, date)
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get unique dates that have events
  const eventDates = Array.from(new Set(events.map(event => 
    format(event.date, 'yyyy-MM-dd')
  )));

  if (loading) {
    return (
      <div className="animate-fadeIn p-4">
        <LoadingSpinner 
          text="Loading medication schedule..." 
          size="md"
          variant="pulse"
          color="primary"
          className="mx-auto my-8"
          includeBackground
          glassmorphism
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Skeleton variant="shimmer" height={40} className="w-full mb-4" />
          
          <div className="border rounded-md p-4">
            <Skeleton variant="shimmer" height={24} width="60%" className="mb-4" />
            <div className="space-y-4">
              <CalendarEventSkeleton variant="dose" />
              <CalendarEventSkeleton variant="appointment" />
              <CalendarEventSkeleton variant="refill" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorAlert 
        message={`Error loading medication schedule: ${error.message}`}
        title="Calendar Error"
        variant="error"
        onRetry={() => window.location.reload()}
        bordered
        elevated
        glassmorphism
        animationVariant="shake"
        errorCode={error.code}
        helpLink="/help/medication-calendar"
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              modifiers={{
                hasEvent: (day) => {
                  return eventDates.includes(format(day, 'yyyy-MM-dd'));
                }
              }}
              modifiersStyles={{
                hasEvent: { 
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '100%'
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="w-full lg:w-1/2 border rounded-md p-4">
        <h3 className="font-medium text-lg mb-4">
          {selectedDateEvents.length > 0 
            ? `Medications for ${format(date, 'MMMM d, yyyy')}` 
            : 'No medications scheduled for this date'}
        </h3>
        
        <div className="space-y-4">
          {selectedDateEvents.map((event) => (
            <div 
              key={event.id} 
              className={cn(
                "p-3 rounded-md",
                event.type === 'dose' ? 'bg-blue-50' : 
                event.type === 'refill' ? 'bg-amber-50' : 
                event.type === 'appointment' ? 'bg-purple-50' : 'bg-red-50'
              )}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{event.time}</span>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  event.type === 'dose' ? 'bg-blue-100 text-blue-800' : 
                  event.type === 'refill' ? 'bg-amber-100 text-amber-800' : 
                  event.type === 'appointment' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                )}>
                  {event.type === 'dose' ? 'Take Medication' : 
                   event.type === 'refill' ? 'Refill Needed' : 
                   event.type === 'appointment' ? 'Appointment' :
                   'Prescription Expires'}
                </span>
              </div>
              <div className="mt-2">
                <h4 className="font-medium">{event.title}</h4>
                {event.medication && (
                  <p className="text-sm text-gray-600">
                    {event.medication.dosage}
                    {event.medication.frequency ? `, ${event.medication.frequency}` : ''}
                  </p>
                )}
                {event.doctorName && (
                  <p className="text-sm text-gray-600">
                    Dr. {event.doctorName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
