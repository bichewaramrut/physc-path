'use client';

import { useState, useEffect } from 'react';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { format, isSameDay } from 'date-fns';
import { 
  generateMedicationReminders, 
  formatReminderTime,
  groupRemindersByDay
} from '@/lib/utils/prescription-utils';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Calendar, Clock, Pill, ArrowLeft, Filter, CheckCircle } from 'lucide-react';
import { Prescription } from '@/lib/api/prescriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { DatePicker } from '@/components/ui/date-picker';
import Link from 'next/link';

interface MedicationReminder {
  time: Date;
  medication: any;
  taken: boolean;
}

export default function MedicationRemindersPage() {
  const { fetchPrescriptions, prescriptions, loading, error } = usePrescriptions();
  const [reminders, setReminders] = useState<Array<MedicationReminder>>([]);
  const [groupedReminders, setGroupedReminders] = useState<{ [key: string]: Array<MedicationReminder> }>({});
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  useEffect(() => {
    const getActivePrescriptions = async () => {
      await fetchPrescriptions({ status: 'ACTIVE' });
    };
    
    getActivePrescriptions();
  }, [fetchPrescriptions]);
  
  useEffect(() => {
    if (prescriptions && prescriptions.length > 0) {
      let allReminders: Array<MedicationReminder> = [];
      
      // Get saved reminders from local storage
      const savedReminders = localStorage.getItem('medication-reminders');
      const takenMedications: Record<string, boolean> = savedReminders ? JSON.parse(savedReminders) : {};
      
      // Generate reminders for all medications in all active prescriptions
      prescriptions
        .filter(prescription => prescription.status === 'ACTIVE')
        .forEach(prescription => {
          if (prescription.medications && prescription.medications.length > 0) {
            prescription.medications.forEach(medication => {
              // Generate 14 days of reminders for each medication
              const medicationReminders = generateMedicationReminders(medication, new Date(), 14)
                .map(reminder => {
                  // Create a unique ID for each reminder
                  const reminderId = `${medication.id}-${format(reminder.time, 'yyyy-MM-dd-HH-mm')}`;
                  return { 
                    ...reminder, 
                    taken: takenMedications[reminderId] || false 
                  };
                });
              allReminders = [...allReminders, ...medicationReminders];
            });
          }
        });
      
      // Sort reminders by time
      allReminders.sort((a, b) => a.time.getTime() - b.time.getTime());
      
      setReminders(allReminders);
      
      // Group reminders by day
      const grouped = groupRemindersByDay(allReminders);
      setGroupedReminders(grouped);
    }
  }, [prescriptions]);
  
  // Mark medication as taken
  const markAsTaken = (reminder: MedicationReminder) => {
    // Create a unique ID for the reminder
    const reminderId = `${reminder.medication.id}-${format(reminder.time, 'yyyy-MM-dd-HH-mm')}`;
    
    // Update the reminder in the state
    const updatedReminders = reminders.map(r => {
      if (r.time === reminder.time && r.medication.id === reminder.medication.id) {
        return { ...r, taken: true };
      }
      return r;
    });
    
    setReminders(updatedReminders);
    
    // Group reminders by day
    const grouped = groupRemindersByDay(updatedReminders);
    setGroupedReminders(grouped);
    
    // Save to local storage
    const savedReminders = localStorage.getItem('medication-reminders');
    const takenMedications = savedReminders ? JSON.parse(savedReminders) : {};
    takenMedications[reminderId] = true;
    localStorage.setItem('medication-reminders', JSON.stringify(takenMedications));
  };
  
  // Filter reminders based on selected tab
  const getFilteredReminders = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    switch (selectedTab) {
      case 'today':
        return reminders.filter(reminder => isSameDay(reminder.time, today));
      case 'tomorrow':
        return reminders.filter(reminder => isSameDay(reminder.time, tomorrow));
      case 'week':
        const weekLater = new Date(today);
        weekLater.setDate(weekLater.getDate() + 7);
        return reminders.filter(reminder => 
          reminder.time >= today && reminder.time < weekLater
        );
      default:
        return reminders;
    }
  };
  
  const filteredReminders = getFilteredReminders();
  
  if (loading && reminders.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Medication Reminders</h1>
          </div>
          <LoadingSpinner text="Loading your medication schedule..." />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Medication Reminders</h1>
          </div>
          <ErrorAlert message="Could not load medication reminders" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-4 px-4 sm:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost" className="mr-2 p-2 sm:p-3">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Medication Reminders</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Track and manage your medication schedule</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  data-testid="date-picker"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Select Date</span>
                  <span className="inline sm:hidden">Date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <DatePicker
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date)}
                  initialFocus
                  data-testid="calendar"
                />
              </PopoverContent>
            </Popover>
            
            <Link href="/dashboard/notification-settings">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                data-testid="notification-settings"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notification Settings</span>
                <span className="inline sm:hidden">Notify</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm">
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="pt-2">
              {filteredReminders.length > 0 ? (
                <div className="space-y-6">
                  {Object.keys(groupedReminders).map(dateKey => {
                    const dateReminders = filteredReminders.filter(r => 
                      format(r.time, 'yyyy-MM-dd') === dateKey
                    );
                    
                    if (dateReminders.length === 0) return null;
                    
                    const dateLabel = format(new Date(dateKey), 'EEEE, MMMM d');
                    const isToday = isSameDay(new Date(dateKey), new Date());
                    
                    return (
                      <div key={dateKey} className="mb-4 sm:mb-6" data-testid="reminder-day-group">
                        <div className="flex items-center mb-2 sm:mb-3">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
                          <h3 className="text-md sm:text-lg font-medium">
                            {isToday ? 'Today' : dateLabel}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          {dateReminders.map((reminder, index) => (
                            <Card key={index} data-testid="reminder-card" className="border shadow-sm">
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                                      <Pill className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm sm:text-base">
                                        {reminder.medication.name}
                                      </p>
                                      <p className="text-xs sm:text-sm text-muted-foreground">
                                        {reminder.medication.dosage}
                                      </p>
                                      <div className="flex items-center text-xs sm:text-sm mt-1.5">
                                        <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                        <span>{format(reminder.time, 'h:mm a')}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => markAsTaken(reminder)}
                                    disabled={reminder.taken}
                                    data-testid="mark-taken-button"
                                  >
                                    {reminder.taken ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Bell className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                
                                {reminder.medication.instructions && (
                                  <div className="mt-3 pt-3 border-t text-sm">
                                    <p className="text-muted-foreground">
                                      {reminder.medication.instructions}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 border rounded-md bg-muted/20">
                  <Bell className="h-10 w-10 text-muted-foreground mx-auto" />
                  <h3 className="mt-4 text-lg font-medium">No reminders found</h3>
                  <p className="mt-1 text-muted-foreground">
                    {selectedTab !== 'all' 
                      ? `You don't have any medication reminders for this time period` 
                      : `You don't have any active prescriptions with scheduled medications`}
                  </p>
                  {selectedTab !== 'all' && (
                    <Button 
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSelectedTab('all')}
                    >
                      View all reminders
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Your Active Prescriptions</h2>
          <div className="space-y-4">
            {prescriptions
              .filter(prescription => prescription.status === 'ACTIVE')
              .slice(0, 3)
              .map((prescription) => (
                <Card key={prescription.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{prescription.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Prescribed on {format(new Date(prescription.prescribedDate), 'MMM d, yyyy')}
                        </p>
                        
                        <div className="mt-2">
                          {prescription.medications.map((medication, idx) => (
                            <Badge key={idx} variant="outline" className="mr-2 mb-2">
                              {medication.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
            {prescriptions.filter(p => p.status === 'ACTIVE').length > 3 && (
              <div className="text-center mt-2">
                <Link href="/dashboard/prescriptions">
                  <Button variant="ghost">
                    View All Prescriptions
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
