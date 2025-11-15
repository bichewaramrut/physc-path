'use client';

import { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  BellRing, 
  Bell, 
  BellOff, 
  Mail, 
  MessageSquare, 
  Moon, 
  Clock, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { NotificationType, DEFAULT_NOTIFICATION_SETTINGS } from '@/lib/utils/prescription-utils';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export function NotificationPreferences() {
  const { 
    notificationsEnabled, 
    notificationPermission,
    preferences, 
    enableNotifications,
    disableNotifications,
    savePreferences,
    requestPermission
  } = useNotifications();
  
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [saving, setSaving] = useState(false);
  
  const handleToggleNotificationChannel = (type: NotificationType) => {
    const currentTypes = [...localPreferences.reminderTypes];
    
    if (currentTypes.includes(type)) {
      // Remove the type
      setLocalPreferences({
        ...localPreferences,
        reminderTypes: currentTypes.filter(t => t !== type)
      });
    } else {
      // Add the type
      setLocalPreferences({
        ...localPreferences,
        reminderTypes: [...currentTypes, type]
      });
    }
  };
  
  const handleEnableNotifications = async () => {
    const granted = await enableNotifications();
    if (granted && !localPreferences.reminderTypes.includes(NotificationType.BROWSER)) {
      setLocalPreferences({
        ...localPreferences,
        reminderTypes: [...localPreferences.reminderTypes, NotificationType.BROWSER]
      });
    }
  };
  
  const handleDisableNotifications = () => {
    disableNotifications();
    setLocalPreferences({
      ...localPreferences,
      reminderTypes: localPreferences.reminderTypes.filter(t => t !== NotificationType.BROWSER)
    });
  };
  
  const handleSavePreferences = () => {
    setSaving(true);
    savePreferences(localPreferences);
    setTimeout(() => setSaving(false), 1000); // Show saving status briefly
  };
  
  const handleResetToDefaults = () => {
    setLocalPreferences(DEFAULT_NOTIFICATION_SETTINGS);
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto" data-testid="notification-preferences">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Configure when and how you receive medication reminders
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Browser notifications permission */}
        <div className="p-4 border rounded-md bg-muted/20">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Browser Notifications</h3>
            </div>
            
            {notificationPermission === 'granted' ? (
              <Button 
                variant={notificationsEnabled ? "destructive" : "default"}
                size="sm"
                onClick={notificationsEnabled ? handleDisableNotifications : handleEnableNotifications}
              >
                {notificationsEnabled ? (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    Disable
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Enable
                  </>
                )}
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={requestPermission}>
                <Bell className="h-4 w-4 mr-2" />
                Request Permission
              </Button>
            )}
          </div>
          
          {notificationPermission === 'denied' && (
            <div className="flex items-start gap-2 p-3 bg-amber-100 text-amber-800 rounded-md">
              <AlertTriangle className="h-5 w-5 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Notification permission denied</p>
                <p>You need to enable notifications in your browser settings to receive medication reminders.</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Notification channels */}
        <div className="space-y-4">
          <h3 className="font-medium">Notification Channels</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
              </div>
              <Switch 
                id="browser-notifications" 
                checked={localPreferences.reminderTypes.includes(NotificationType.BROWSER)}
                onCheckedChange={() => handleToggleNotificationChannel(NotificationType.BROWSER)}
                disabled={notificationPermission !== 'granted'}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <Switch 
                id="email-notifications" 
                checked={localPreferences.reminderTypes.includes(NotificationType.EMAIL)}
                onCheckedChange={() => handleToggleNotificationChannel(NotificationType.EMAIL)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
              </div>
              <Switch 
                id="sms-notifications" 
                checked={localPreferences.reminderTypes.includes(NotificationType.SMS)}
                onCheckedChange={() => handleToggleNotificationChannel(NotificationType.SMS)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
              <Switch 
                id="push-notifications" 
                checked={localPreferences.reminderTypes.includes(NotificationType.PUSH)}
                onCheckedChange={() => handleToggleNotificationChannel(NotificationType.PUSH)}
              />
            </div>
          </div>
        </div>
        
        {/* Reminder timing */}
        <div className="space-y-4">
          <h3 className="font-medium">Reminder Timing</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="notify-before">Notify before medication time</Label>
                <span className="text-sm text-muted-foreground">
                  {localPreferences.notifyBeforeMinutes} minutes
                </span>
              </div>
              <div className="px-2">
                <Slider
                  id="notify-before"
                  min={0}
                  max={60}
                  step={5}
                  value={[localPreferences.notifyBeforeMinutes]}
                  onValueChange={(value) => setLocalPreferences({
                    ...localPreferences,
                    notifyBeforeMinutes: value[0]
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <Label htmlFor="follow-up-reminder">Follow-up reminder</Label>
                <Switch 
                  id="follow-up-enabled"
                  checked={localPreferences.followUpReminderMinutes !== null}
                  onCheckedChange={(checked) => setLocalPreferences({
                    ...localPreferences,
                    followUpReminderMinutes: checked ? 30 : null
                  })}
                />
              </div>
              
              {localPreferences.followUpReminderMinutes !== null && (
                <div className="ml-6">
                  <div className="flex justify-between">
                    <Label htmlFor="follow-up-minutes">If not taken, remind again after</Label>
                    <span className="text-sm text-muted-foreground">
                      {localPreferences.followUpReminderMinutes} minutes
                    </span>
                  </div>
                  <div className="px-2 mt-2">
                    <Slider
                      id="follow-up-minutes"
                      min={5}
                      max={60}
                      step={5}
                      value={[localPreferences.followUpReminderMinutes || 30]}
                      onValueChange={(value) => setLocalPreferences({
                        ...localPreferences,
                        followUpReminderMinutes: value[0]
                      })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quiet hours */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <h3 className="font-medium">Quiet Hours</h3>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiet-hours-start">Start time</Label>
              <Select
                value={localPreferences.quietHoursStart.toString()}
                onValueChange={(value) => setLocalPreferences({
                  ...localPreferences,
                  quietHoursStart: parseInt(value, 10)
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({length: 24}, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i === 0 ? '12 AM (Midnight)' : 
                          i < 12 ? `${i} AM` : 
                          i === 12 ? '12 PM (Noon)' : 
                          `${i-12} PM`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quiet-hours-end">End time</Label>
              <Select
                value={localPreferences.quietHoursEnd.toString()}
                onValueChange={(value) => setLocalPreferences({
                  ...localPreferences,
                  quietHoursEnd: parseInt(value, 10)
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from({length: 24}, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i === 0 ? '12 AM (Midnight)' : 
                          i < 12 ? `${i} AM` : 
                          i === 12 ? '12 PM (Noon)' : 
                          `${i-12} PM`}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Label htmlFor="weekend-quiet-hours">Enable weekend quiet hours</Label>
            </div>
            <Switch 
              id="weekend-quiet-hours"
              checked={localPreferences.enableWeekendQuietHours}
              onCheckedChange={(checked) => setLocalPreferences({
                ...localPreferences,
                enableWeekendQuietHours: checked
              })}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleResetToDefaults}
        >
          Reset to Defaults
        </Button>
        <Button
          onClick={handleSavePreferences}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardFooter>
    </Card>
  );
}
