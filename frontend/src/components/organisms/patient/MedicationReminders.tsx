'use client';

import { useState, useEffect } from 'react';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { Prescription } from '@/lib/api/prescriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Clock, Pill, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { 
  generateMedicationReminders, 
  formatReminderTime,
  isReminderDueSoon,
  groupRemindersByDay
} from '@/lib/utils/prescription-utils';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';

/**
 * MedicationReminders component
 * 
 * Displays upcoming medication reminders for the patient on the dashboard
 */
export function MedicationReminders() {
  const { fetchPrescriptions, prescriptions, loading, error } = usePrescriptions();
  const [reminders, setReminders] = useState<Array<{ time: Date; medication: any }>>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Array<{ time: Date; medication: any }>>([]);
  
  useEffect(() => {
    const getActivePrescriptions = async () => {
      // Only fetch if prescriptions haven't been loaded yet
      if (!prescriptions || prescriptions.length === 0) {
        await fetchPrescriptions({ status: 'ACTIVE' });
      }
    };
    
    getActivePrescriptions();
  }, [fetchPrescriptions, prescriptions]);
  
  // Generate reminders whenever prescriptions change
  useEffect(() => {
    if (prescriptions && prescriptions.length > 0) {
      let allReminders: Array<{ time: Date; medication: any }> = [];
      
      // Generate reminders for all medications in all active prescriptions
      prescriptions
        .filter(prescription => prescription.status === 'ACTIVE')
        .forEach(prescription => {
          if (prescription.medications && prescription.medications.length > 0) {
            prescription.medications.forEach(medication => {
              // Generate 7 days of reminders for each medication
              const medicationReminders = generateMedicationReminders(medication);
              allReminders = [...allReminders, ...medicationReminders];
            });
          }
        });
      
      // Sort reminders by time
      allReminders.sort((a, b) => a.time.getTime() - b.time.getTime());
      
      setReminders(allReminders);
      
      // Filter for reminders in the next 24 hours
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(now.getHours() + 24);
      
      const upcoming = allReminders.filter(reminder => 
        reminder.time >= now && reminder.time <= tomorrow
      );
      
      setUpcomingReminders(upcoming);
    }
  }, [prescriptions]);
  
  if (loading && reminders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorAlert message="Could not load medication reminders" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-semibold">Medication Reminders</CardTitle>
        <Badge variant="outline" className="font-normal">
          {upcomingReminders.length} upcoming
        </Badge>
      </CardHeader>
      <CardContent>
        {upcomingReminders.length > 0 ? (
          <div className="space-y-4">
            {upcomingReminders.slice(0, 4).map((reminder, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${isReminderDueSoon(reminder.time) ? 'bg-amber-100 text-amber-800' : 'bg-primary/10 text-primary'}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">
                    {reminder.medication.name} {reminder.medication.dosage}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatReminderTime(reminder.time)}
                  </div>
                </div>
                {isReminderDueSoon(reminder.time) && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                    Due Soon
                  </Badge>
                )}
              </div>
            ))}
            
            {upcomingReminders.length > 4 && (
              <div className="text-xs text-muted-foreground mt-2">
                And {upcomingReminders.length - 4} more reminders in the next 24 hours...
              </div>
            )}
            
            <Link href="/dashboard/medication-reminders">
              <Button variant="ghost" className="w-full mt-2 text-xs h-8" size="sm">
                View All Reminders
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-6 space-y-2">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <p className="text-sm text-muted-foreground">No upcoming medication reminders</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
