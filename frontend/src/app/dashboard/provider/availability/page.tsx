"use client";

import { useState, useEffect } from 'react';
import { useProvider } from '@/hooks/useProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Clock, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Helper to format time for display
const formatTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

// Days of the week for availability settings
const DAYS_OF_WEEK = [
  { name: 'Monday', value: 1 },
  { name: 'Tuesday', value: 2 },
  { name: 'Wednesday', value: 3 },
  { name: 'Thursday', value: 4 },
  { name: 'Friday', value: 5 },
  { name: 'Saturday', value: 6 },
  { name: 'Sunday', value: 0 },
];

// Time options for dropdowns
const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    label: new Date(0, 0, 0, hour, minute).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  };
});

export default function ProviderAvailability() {
  const {
    fetchAvailabilities,
    updateAvailabilities,
    addTimeSlot,
    removeTimeSlot,
    updateAppointmentFees,
    loading,
    error,
    availabilities,
  } = useProvider();

  const [activeTab, setActiveTab] = useState('general');
  const [fees, setFees] = useState<number>(1200); // Default fee in cents (12.00)
  const [selectedDays, setSelectedDays] = useState<Record<number, boolean>>({});
  const [timeSlots, setTimeSlots] = useState<{ id?: string; dayOfWeek: number; startTime: string; endTime: string }[]>([]);
  const [newSlot, setNewSlot] = useState<{ dayOfWeek: number; startTime: string; endTime: string; clinicId?: string }>({
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
    clinicId: undefined
  });
  const [clinics, setClinics] = useState<{ id: string; name: string }[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Load availabilities and clinics on mount
    const loadData = async () => {
      const availabilitiesData = await fetchAvailabilities();
      if (availabilitiesData) {
        // Convert to time slots format
        const slots = availabilitiesData
          .filter(a => a.isAvailable)
          .map(a => ({
            id: a.id,
            dayOfWeek: a.dayOfWeek,
            startTime: a.startTime,
            endTime: a.endTime,
            clinicId: a.clinicId
          }));
        setTimeSlots(slots);

        // Set selected days based on availability
        const daysObj: Record<number, boolean> = {};
        availabilitiesData.forEach(a => {
          daysObj[a.dayOfWeek] = a.isAvailable;
        });
        setSelectedDays(daysObj);
      }
      
      // Mock API call for clinics - replace with actual API call
      // const clinicsData = await fetchClinics();
      const clinicsData = [
        { id: 'clinic1', name: 'Main Clinic' },
        { id: 'clinic2', name: 'Downtown Branch' }
      ];
      setClinics(clinicsData);
    };
    
    loadData();
  }, [fetchAvailabilities]);

  // Handle day selection/deselection
  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  // Handle adding a new time slot
  const handleAddTimeSlot = async () => {
    if (newSlot.startTime >= newSlot.endTime) {
      alert('End time must be after start time');
      return;
    }

    try {
      const added = await addTimeSlot(
        newSlot.dayOfWeek,
        newSlot.startTime,
        newSlot.endTime,
        selectedClinic
      );
      
      if (added) {
        setTimeSlots(prev => [...prev, {
          id: added.id,
          dayOfWeek: newSlot.dayOfWeek,
          startTime: newSlot.startTime,
          endTime: newSlot.endTime,
          clinicId: selectedClinic
        }]);
      }
    } catch (err) {
      console.error('Failed to add time slot:', err);
    }
  };

  // Handle removing a time slot
  const handleRemoveTimeSlot = async (id?: string, index: number = -1) => {
    if (id) {
      const success = await removeTimeSlot(id);
      if (success) {
        setTimeSlots(prev => prev.filter(slot => slot.id !== id));
      }
    } else if (index >= 0) {
      // For newly added slots without IDs
      setTimeSlots(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Handle saving all availability settings
  const handleSaveAvailability = async () => {
    // Convert time slots to availability format
    const availabilityData = DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day.value,
      isAvailable: !!selectedDays[day.value],
      startTime: '09:00', // Default
      endTime: '17:00',   // Default
      clinicId: selectedClinic
    }));
    
    // Add specific time slots
    timeSlots.forEach(slot => {
      const index = availabilityData.findIndex(a => a.dayOfWeek === slot.dayOfWeek);
      if (index >= 0) {
        availabilityData[index].startTime = slot.startTime;
        availabilityData[index].endTime = slot.endTime;
        if (slot.clinicId) {
          availabilityData[index].clinicId = slot.clinicId;
        }
      }
    });
    
    await updateAvailabilities(availabilityData);
  };

  // Handle updating appointment fees
  const handleUpdateFees = async () => {
    await updateAppointmentFees(fees);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/provider">
            <Button variant="outline" size="sm" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Manage Availability</h1>
        </div>
        
        <Button 
          className="flex items-center bg-[#F26E5C] hover:bg-[#E05A4A] text-white"
          onClick={handleSaveAvailability}
          disabled={loading}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="general">General Availability</TabsTrigger>
          <TabsTrigger value="clinic">Clinic Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Available Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div 
                    key={day.value}
                    className={`p-4 rounded-lg cursor-pointer border ${
                      selectedDays[day.value] 
                        ? 'bg-[#F26E5C] text-white border-[#F26E5C]' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleDayToggle(day.value)}
                  >
                    {day.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Time Slots</CardTitle>
              <Button
                onClick={handleAddTimeSlot}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Time Slot
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 border border-dashed border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F26E5C] focus:border-[#F26E5C]"
                      value={newSlot.dayOfWeek}
                      onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: parseInt(e.target.value) })}
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F26E5C] focus:border-[#F26E5C]"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={`start-${time.value}`} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <select
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F26E5C] focus:border-[#F26E5C]"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <option key={`end-${time.value}`} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {timeSlots.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No time slots added yet. Add your first time slot above.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {timeSlots.map((slot, index) => {
                      const day = DAYS_OF_WEEK.find(d => d.value === slot.dayOfWeek);
                      return (
                        <div
                          key={slot.id || index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <span className="font-medium">{day?.name}: </span>
                            <span className="text-gray-600">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTimeSlot(slot.id, index)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-lg mr-2">$</span>
                  <input
                    type="number"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F26E5C] focus:border-[#F26E5C]"
                    value={(fees / 100).toFixed(2)}
                    onChange={(e) => setFees(Math.round(parseFloat(e.target.value) * 100))}
                    min="0"
                    step="0.01"
                  />
                  <span className="ml-2 text-gray-500">per appointment</span>
                </div>
                <Button
                  onClick={handleUpdateFees}
                  className="bg-[#F26E5C] hover:bg-[#E05A4A] text-white"
                  disabled={loading}
                >
                  Update Fees
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinic" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Clinic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F26E5C] focus:border-[#F26E5C]"
                  value={selectedClinic || ''}
                  onChange={(e) => setSelectedClinic(e.target.value || undefined)}
                >
                  <option value="">All Clinics</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
                
                <p className="text-sm text-gray-500">
                  Select a specific clinic to set availability for that location only.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Similar cards for clinic-specific availability settings can go here */}
          {/* This is just a placeholder - actual implementation would depend on your specific requirements */}
          <div className="text-center py-8 text-gray-500">
            <p>Select a clinic from the dropdown above to manage clinic-specific availability.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
