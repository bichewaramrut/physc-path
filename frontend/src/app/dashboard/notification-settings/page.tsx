'use client';

import { useState, useEffect } from 'react';
import { NotificationPreferences } from '@/components/organisms/patient/NotificationPreferences';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import Link from 'next/link';

export default function NotificationSettingsPage() {
  const { notificationsEnabled, enableNotifications } = useNotifications();
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  
  // Check if we should show the permission prompt
  useEffect(() => {
    if (!notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      setShowPermissionPrompt(true);
    } else {
      setShowPermissionPrompt(false);
    }
  }, [notificationsEnabled]);
  
  const handleEnableNotifications = async () => {
    await enableNotifications();
    setShowPermissionPrompt(false);
  };
  
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href="/dashboard/medication-reminders">
              <Button variant="ghost" className="mr-2 p-2 sm:p-3">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Notification Settings</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Customize how you receive medication reminders
              </p>
            </div>
          </div>
        </div>
        
        {showPermissionPrompt && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">Enable Notifications</h3>
                <p className="text-blue-700 mt-1">
                  Get timely reminders for your medications. Never miss a dose again.
                </p>
                <div className="mt-3">
                  <Button 
                    size="sm"
                    onClick={handleEnableNotifications}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Enable Notifications
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <NotificationPreferences />
        
        <div className="bg-muted/30 rounded-lg p-4 mt-6">
          <h3 className="font-medium mb-2">About Medication Reminders</h3>
          <p className="text-sm text-muted-foreground">
            Medication reminders help you stay on track with your prescribed treatment. 
            You can receive notifications before it's time to take your medication, and 
            follow-up reminders if you haven't marked them as taken.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Quiet hours ensure you won't be disturbed during your rest periods. 
            Customize them according to your daily routine.
          </p>
        </div>
      </div>
    </div>
  );
}
