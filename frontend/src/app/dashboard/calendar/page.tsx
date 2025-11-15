'use client';

import { useState } from 'react';
import { MedicationCalendar } from '@/components/ui/medication-calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState('medications');
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View your medication schedule and upcoming appointments
        </p>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="medications" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Medication Schedule</h2>
            <MedicationCalendar />
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <p className="text-muted-foreground">
              Your scheduled appointments will appear here.
            </p>
            {/* Appointment calendar component would go here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
