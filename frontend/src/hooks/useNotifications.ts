'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  browserSupportsNotifications, 
  requestNotificationPermission,
  showMedicationNotification,
  createNotificationSchedule,
  NotificationPreferences,
  DEFAULT_NOTIFICATION_SETTINGS,
  NotificationType
} from '@/lib/utils/prescription-utils';
import {
  isPushNotificationSupported,
  initializePushNotifications,
  unsubscribeFromPush
} from '@/lib/utils/push-utils';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { Medication } from '@/lib/api/prescriptions';

// Time to check for upcoming notifications (in ms)
const NOTIFICATION_CHECK_INTERVAL = 60000; // Check every minute

export function useNotifications() {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_SETTINGS);
  const [upcomingNotifications, setUpcomingNotifications] = useState<Array<{ 
    time: Date; 
    medication: Medication; 
    type: NotificationType 
  }>>([]);
  
  const { prescriptions, loading } = usePrescriptions();

  // Check if browser supports notifications and current permission status
  useEffect(() => {
    const checkPermission = async () => {
      if (browserSupportsNotifications()) {
        const permission = await Notification.permission;
        setNotificationPermission(permission);
        setNotificationsEnabled(permission === 'granted');
      }
    };

    checkPermission();
  }, []);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('notification-preferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setPreferences(parsedPreferences);
      } catch (e) {
        console.error('Error parsing notification preferences:', e);
      }
    }
  }, []);

  // Request permission for notifications
  const requestPermission = useCallback(async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    setNotificationsEnabled(permission === 'granted');
    
    // If permission granted and push notifications are enabled in preferences,
    // also initialize push notifications
    if (permission === 'granted' && 
        isPushNotificationSupported() && 
        preferences.reminderTypes.includes(NotificationType.PUSH)) {
      try {
        // VAPID public key would come from your environment variables
        // This is a placeholder value
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY || 
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
        
        await initializePushNotifications(vapidPublicKey);
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    }
    
    return permission;
  }, [preferences.reminderTypes]);

  // Save notification preferences
  const savePreferences = useCallback((newPreferences: NotificationPreferences) => {
    const oldPreferences = preferences;
    setPreferences(newPreferences);
    localStorage.setItem('notification-preferences', JSON.stringify(newPreferences));
    
    // Handle changes in push notification preferences
    const hadPushBefore = oldPreferences.reminderTypes.includes(NotificationType.PUSH);
    const hasPushNow = newPreferences.reminderTypes.includes(NotificationType.PUSH);
    
    if (!hadPushBefore && hasPushNow && isPushNotificationSupported()) {
      // User enabled push notifications, initialize them
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY || 
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
      
      initializePushNotifications(vapidPublicKey)
        .catch(error => console.error('Failed to initialize push notifications:', error));
    } else if (hadPushBefore && !hasPushNow && isPushNotificationSupported()) {
      // User disabled push notifications, unsubscribe them
      unsubscribeFromPush()
        .catch(error => console.error('Failed to unsubscribe from push notifications:', error));
    }
  }, [preferences]);

  // Generate schedule based on active prescriptions
  useEffect(() => {
    if (!prescriptions.length || !notificationsEnabled || loading) {
      return;
    }

    let allNotifications: Array<{ 
      time: Date; 
      medication: Medication; 
      type: NotificationType 
    }> = [];

    // Generate notifications for all active medications
    prescriptions
      .filter(p => p.status === 'ACTIVE')
      .forEach(prescription => {
        if (prescription.medications && prescription.medications.length) {
          prescription.medications.forEach(medication => {
            const medicationNotifications = createNotificationSchedule(
              medication,
              preferences,
              new Date(),
              7 // Schedule for the next week
            );
            allNotifications = [...allNotifications, ...medicationNotifications];
          });
        }
      });

    // Sort by time
    allNotifications.sort((a, b) => a.time.getTime() - b.time.getTime());
    
    // Keep only upcoming notifications
    const now = new Date();
    const upcoming = allNotifications.filter(n => n.time > now);

    setUpcomingNotifications(upcoming);
  }, [prescriptions, preferences, notificationsEnabled, loading]);

  // Set up notification checking interval
  useEffect(() => {
    if (!notificationsEnabled || !upcomingNotifications.length) {
      return;
    }

    // Check for notifications that should be shown
    const checkNotifications = () => {
      const now = new Date();
      const notificationsToShow = upcomingNotifications.filter(notification => {
        // Show notifications that are due within the next minute
        const notificationTime = notification.time.getTime();
        const checkTime = now.getTime() + 60000; // Next minute
        return notificationTime <= checkTime && notification.type === NotificationType.BROWSER;
      });

      // Show browser notifications
      notificationsToShow.forEach(notification => {
        showMedicationNotification(notification.medication, notification.time);
      });

      // Remove shown notifications from the queue
      if (notificationsToShow.length > 0) {
        setUpcomingNotifications(prev => 
          prev.filter(n => !notificationsToShow.some(shown => 
            shown.time.getTime() === n.time.getTime() && 
            shown.medication.id === n.medication.id &&
            shown.type === n.type
          ))
        );
      }
    };

    // Initial check
    checkNotifications();

    // Set interval for checking
    const intervalId = setInterval(checkNotifications, NOTIFICATION_CHECK_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [notificationsEnabled, upcomingNotifications]);

  // Enable notifications function for UI
  const enableNotifications = useCallback(async () => {
    if (notificationsEnabled) return true;
    
    const permission = await requestPermission();
    
    if (permission === 'granted') {
      // If push is supported and selected in preferences, initialize it
      if (isPushNotificationSupported() && preferences.reminderTypes.includes(NotificationType.PUSH)) {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY || 
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
        
        await initializePushNotifications(vapidPublicKey);
      }
    }
    
    return permission === 'granted';
  }, [notificationsEnabled, requestPermission, preferences.reminderTypes]);

  // Disable notifications
  const disableNotifications = useCallback(() => {
    setNotificationsEnabled(false);
    
    // Update preferences to disable all notification types
    const updatedPreferences = {
      ...preferences,
      reminderTypes: []
    };
    savePreferences(updatedPreferences);
    
    // Unsubscribe from push notifications if they were enabled
    if (preferences.reminderTypes.includes(NotificationType.PUSH) && isPushNotificationSupported()) {
      unsubscribeFromPush()
        .catch(error => console.error('Failed to unsubscribe from push notifications:', error));
    }
  }, [preferences, savePreferences]);

  return {
    notificationsEnabled,
    notificationPermission,
    preferences,
    upcomingNotifications,
    enableNotifications,
    disableNotifications,
    savePreferences,
    requestPermission
  };
}
