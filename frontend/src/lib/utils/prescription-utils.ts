/**
 * Prescription utility functions
 * 
 * This file contains utility functions for working with prescriptions data,
 * such as calculating expiry dates, formatting medication instructions,
 * and determining prescription status.
 */

import { Prescription, Medication } from '@/lib/api/prescriptions';
import { addDays, format, parseISO, isAfter, isBefore, isEqual, addHours, setHours, setMinutes, addMinutes, subMinutes } from 'date-fns';

// Notification types for medication reminders
export enum NotificationType {
  BROWSER = 'browser',
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push'
}

// Default notification settings
export const DEFAULT_NOTIFICATION_SETTINGS = {
  notifyBeforeMinutes: 15,
  reminderTypes: [NotificationType.BROWSER, NotificationType.PUSH],
  followUpReminderMinutes: 30,
  quietHoursStart: 22, // 10 PM
  quietHoursEnd: 7,    // 7 AM
  enableWeekendQuietHours: false
};

// User notification preferences interface
export interface NotificationPreferences {
  notifyBeforeMinutes: number;
  reminderTypes: NotificationType[];
  followUpReminderMinutes: number | null;
  quietHoursStart: number;
  quietHoursEnd: number;
  enableWeekendQuietHours: boolean;
}

/**
 * Get the appropriate color class for a prescription status
 * 
 * @param status Prescription status
 * @returns A string with tailwind color classes
 */
export function getStatusColorClass(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'EXPIRED':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
}

/**
 * Format a medication's instructions in a user-friendly way
 * 
 * @param medication The medication to format instructions for
 * @returns A string with formatted instructions
 */
export function formatMedicationInstructions(medication: Medication): string {
  let instructions = medication.dosage;
  
  if (medication.frequency) {
    instructions += `, ${medication.frequency}`;
  }
  
  if (medication.duration) {
    instructions += ` for ${medication.duration}`;
  }
  
  return instructions;
}

/**
 * Calculate the remaining days for a prescription
 * 
 * @param prescription The prescription to calculate days for
 * @returns The number of days remaining, or 0 if expired/completed/cancelled
 */
export function calculateRemainingDays(prescription: Prescription): number {
  if (prescription.status !== 'ACTIVE' || !prescription.expiryDate) {
    return 0;
  }
  
  const today = getCurrentDate();
  const expiryDate = parseISO(prescription.expiryDate);
  
  // If already expired
  if (isBefore(expiryDate, today)) {
    return 0;
  }
  
  // Calculate difference in days
  const differenceInTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
}

/**
 * Check if a prescription is eligible for refill
 * 
 * @param prescription The prescription to check
 * @returns Boolean indicating if refill is possible
 */
export function canRequestRefill(prescription: Prescription): boolean {
  return (
    prescription.status === 'ACTIVE' && 
    (prescription.refills === undefined || prescription.refills > 0)
  );
}

/**
 * Format a date string in a consistent way
 * 
 * @param dateString The ISO date string to format
 * @returns Formatted date string (e.g. "January 1, 2025")
 */
export function formatPrescriptionDate(dateString: string): string {
  return format(parseISO(dateString), 'MMMM d, yyyy');
}

/**
 * Get a list of primary medications from a prescription
 * 
 * @param prescription The prescription to analyze
 * @param limit Maximum number of medications to return (default: 3)
 * @returns Array of medication names
 */
export function getPrimaryMedications(prescription: Prescription, limit: number = 3): string[] {
  if (!prescription.medications || prescription.medications.length === 0) {
    return [];
  }
  
  return prescription.medications
    .slice(0, limit)
    .map(med => med.name);
}

/**
 * Calculate the total quantity of medications in a prescription
 * 
 * @param prescription The prescription to calculate for
 * @returns The total quantity of all medications
 */
export function calculateTotalQuantity(prescription: Prescription): number {
  if (!prescription.medications) {
    return 0;
  }
  
  return prescription.medications.reduce((total, med) => {
    return total + (med.quantity || 0);
  }, 0);
}

/**
 * Generate reminder schedule for a medication based on frequency
 * 
 * @param medication The medication to generate reminders for
 * @param startDate The date to start generating reminders from (default: today)
 * @param daysToGenerate Number of days to generate reminders for (default: 7)
 * @returns Array of reminder times
 */
export function generateMedicationReminders(
  medication: Medication, 
  startDate: Date = getCurrentDate(),
  daysToGenerate: number = 7
): Array<{ time: Date; medication: Medication }> {
  const reminders: Array<{ time: Date; medication: Medication }> = [];
  
  // Parse the frequency to determine how many times per day
  const frequencyMap: { [key: string]: number[] } = {
    'once daily': [9], // Once a day at 9 AM
    'twice daily': [9, 21], // Twice a day at 9 AM and 9 PM
    'three times daily': [9, 13, 21], // Three times a day at 9 AM, 1 PM, and 9 PM
    'four times daily': [9, 13, 17, 21], // Four times a day
    'every morning': [9], // Morning only
    'every evening': [21], // Evening only
    'every 12 hours': [9, 21], // Every 12 hours
    'every 8 hours': [8, 16, 24], // Every 8 hours
    'every 6 hours': [6, 12, 18, 24], // Every 6 hours
    'every 4 hours': [4, 8, 12, 16, 20, 24], // Every 4 hours
    'as needed': [] // No specific schedule for as needed medications
  };
  
  // Default to once daily if frequency isn't recognized
  const frequencyLower = medication.frequency ? medication.frequency.toLowerCase() : 'once daily';
  const times = frequencyMap[frequencyLower] || [9]; // Default to 9 AM if frequency not found
  
  // Generate reminders for each day
  for (let day = 0; day < daysToGenerate; day++) {
    const currentDate = addDays(startDate, day);
    
    // Generate reminder for each time in the day
    times.forEach(hour => {
      const reminderTime = setHours(setMinutes(currentDate, 0), hour % 24);
      reminders.push({
        time: reminderTime,
        medication
      });
    });
  }
  
  return reminders;
}

/**
 * Format medication reminder time in a user-friendly way
 * 
 * @param reminderTime The reminder time to format
 * @returns Formatted time string (e.g. "Today at 9:00 AM" or "Tomorrow at 9:00 PM")
 */
export function formatReminderTime(reminderTime: Date): string {
  const now = getCurrentDate();
  const tomorrow = addDays(now, 1);
  
  let prefix = format(reminderTime, 'MMMM d');
  
  // Check if it's today or tomorrow
  if (
    reminderTime.getDate() === now.getDate() &&
    reminderTime.getMonth() === now.getMonth() &&
    reminderTime.getFullYear() === now.getFullYear()
  ) {
    prefix = 'Today';
  } else if (
    reminderTime.getDate() === tomorrow.getDate() &&
    reminderTime.getMonth() === tomorrow.getMonth() &&
    reminderTime.getFullYear() === tomorrow.getFullYear()
  ) {
    prefix = 'Tomorrow';
  }
  
  return `${prefix} at ${format(reminderTime, 'h:mm a')}`;
}

/**
 * Check if a medication reminder is due soon
 * 
 * @param reminderTime The reminder time to check
 * @param thresholdMinutes Minutes threshold for "due soon" (default: 30)
 * @returns Boolean indicating if reminder is due soon
 */
export function isReminderDueSoon(reminderTime: Date, thresholdMinutes: number = 30): boolean {
  const now = getCurrentDate();
  const thresholdTime = addHours(now, thresholdMinutes / 60);
  
  return isAfter(reminderTime, now) && isBefore(reminderTime, thresholdTime);
}

/**
 * Group medication reminders by day
 * 
 * @param reminders Array of medication reminders
 * @returns Object with dates as keys and arrays of reminders as values
 */
export function groupRemindersByDay(reminders: Array<{ time: Date; medication: Medication }>): { 
  [key: string]: Array<{ time: Date; medication: Medication }> 
} {
  return reminders.reduce((groups, reminder) => {
    const dateKey = format(reminder.time, 'yyyy-MM-dd');
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(reminder);
    
    return groups;
  }, {} as { [key: string]: Array<{ time: Date; medication: Medication }> });
}

/**
 * Get notification settings for a medication reminder
 * 
 * @param medication The medication to get settings for
 * @param preferences User notification preferences
 * @returns Object with notification settings
 */
export function getNotificationSettings(
  medication: Medication, 
  preferences: NotificationPreferences = DEFAULT_NOTIFICATION_SETTINGS
): {
  notifyTime: Date;
  types: NotificationType[];
} {
  const now = getCurrentDate();
  
  // Calculate the notification time based on user preferences
  const notifyTime = subMinutes(now, preferences.notifyBeforeMinutes);
  
  return {
    notifyTime,
    types: preferences.reminderTypes
  };
}

/**
 * Schedule follow-up reminders for a medication
 * 
 * @param medication The medication to schedule follow-ups for
 * @param startDate The date to start scheduling from (default: today)
 * @param preferences User notification preferences
 * @returns Array of follow-up reminder times
 */
export function scheduleFollowUpReminders(
  medication: Medication,
  startDate: Date = getCurrentDate(),
  preferences: NotificationPreferences = DEFAULT_NOTIFICATION_SETTINGS
): Array<{ time: Date; medication: Medication }> {
  const followUpReminders: Array<{ time: Date; medication: Medication }> = [];
  
  // Skip if followUpReminderMinutes is null
  if (preferences.followUpReminderMinutes === null) {
    return followUpReminders;
  }
  
  // Calculate the initial follow-up time
  let followUpTime = addMinutes(startDate, preferences.followUpReminderMinutes);
  
  // Schedule follow-ups based on the number of refills
  for (let i = 0; i < (medication.refills || 0); i++) {
    followUpReminders.push({
      time: followUpTime,
      medication
    });
    
    // Increment the follow-up time (e.g. every 30 minutes)
    followUpTime = addMinutes(followUpTime, preferences.followUpReminderMinutes);
  }
  
  return followUpReminders;
}

/**
 * Check if a reminder falls within quiet hours
 * 
 * @param reminderTime The reminder time to check
 * @param preferences User notification preferences
 * @returns Boolean indicating if reminder is within quiet hours
 */
export function isReminderInQuietHours(
  reminderTime: Date, 
  preferences: NotificationPreferences = DEFAULT_NOTIFICATION_SETTINGS
): boolean {
  // Use the consistent isWithinQuietHours function for the check
  return isWithinQuietHours(reminderTime, preferences);
}

/**
 * Check if a time is within quiet hours based on user preferences
 * 
 * @param time The time to check
 * @param preferences User notification preferences
 * @returns Boolean indicating if the time is within quiet hours
 */
export function isWithinQuietHours(time: Date, preferences: NotificationPreferences): boolean {
  const hour = time.getHours();
  const day = time.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = day === 0 || day === 6;
  
  // If it's a weekend and weekend quiet hours are enabled, check using weekend rules
  if (isWeekend && preferences.enableWeekendQuietHours) {
    // For weekends with weekend quiet hours enabled, use the same logic but apply to entire day
    return true;
  }
  
  // Check if time is within normal quiet hours
  if (preferences.quietHoursStart <= preferences.quietHoursEnd) {
    // Simple case: quiet hours are within the same day (e.g., 22:00 to 07:00)
    return hour >= preferences.quietHoursStart && hour < preferences.quietHoursEnd;
  } else {
    // Quiet hours span across midnight (e.g., 22:00 to 07:00)
    return hour >= preferences.quietHoursStart || hour < preferences.quietHoursEnd;
  }
}

/**
 * Calculate the actual notification time based on preferences
 * 
 * @param medicationTime When the medication should be taken
 * @param preferences User notification preferences
 * @returns The adjusted time to send the notification
 */
export function calculateNotificationTime(medicationTime: Date, preferences: NotificationPreferences): Date {
  // By default, notify X minutes before medication time
  return subMinutes(medicationTime, preferences.notifyBeforeMinutes);
}

/**
 * Create a notification schedule for a medication
 * 
 * @param medication The medication to schedule notifications for
 * @param preferences User notification preferences
 * @param startDate Starting date for the schedule
 * @param days Number of days to schedule
 * @returns Array of notification times
 */
export function createNotificationSchedule(
  medication: Medication,
  preferences: NotificationPreferences = DEFAULT_NOTIFICATION_SETTINGS,
  startDate: Date = getCurrentDate(),
  days: number = 7
): Array<{ time: Date; medication: Medication; type: NotificationType }> {
  const notifications: Array<{ time: Date; medication: Medication; type: NotificationType }> = [];
  
  // Generate reminder times for the medication
  const reminders = generateMedicationReminders(medication, startDate, days);
  
  // For each reminder, create notifications based on user preferences
  reminders.forEach(reminder => {
    // Calculate when to send the notification (usually before the medication time)
    const notificationTime = calculateNotificationTime(reminder.time, preferences);
    
    // Skip notifications that would be in quiet hours
    if (!isWithinQuietHours(notificationTime, preferences)) {
      // Add a notification for each enabled notification type
      preferences.reminderTypes.forEach(type => {
        notifications.push({
          time: notificationTime,
          medication: reminder.medication,
          type
        });
      });
      
      // Add follow-up reminder if enabled and followUpReminderMinutes is not null
      if (preferences.followUpReminderMinutes !== null && preferences.followUpReminderMinutes > 0) {
        const followUpTime = addMinutes(reminder.time, preferences.followUpReminderMinutes);
        
        if (!isWithinQuietHours(followUpTime, preferences)) {
          preferences.reminderTypes.forEach(type => {
            notifications.push({
              time: followUpTime,
              medication: reminder.medication,
              type
            });
          });
        }
      }
    }
  });
  
  return notifications;
}

/**
 * Format a notification message for a medication reminder
 * 
 * @param medication The medication for the notification
 * @param time The scheduled time to take the medication
 * @returns A formatted notification message
 */
export function formatNotificationMessage(medication: Medication, time: Date): string {
  const medicationName = medication.name;
  const dosage = medication.dosage;
  const timeString = format(time, 'h:mm a');
  
  // Check if it's due now or in the future
  const now = getCurrentDate();
  const isOverdue = isBefore(time, now);
  
  if (isOverdue) {
    return `Medication reminder: It's time to take ${dosage} of ${medicationName}`;
  } else {
    return `Medication reminder: Take ${dosage} of ${medicationName} at ${timeString}`;
  }
}

/**
 * Check if the browser supports notifications
 * 
 * @returns Boolean indicating if notifications are supported
 */
export function browserSupportsNotifications(): boolean {
  return 'Notification' in window;
}

/**
 * Request permission for browser notifications
 * 
 * @returns Promise resolving to the permission state
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!browserSupportsNotifications()) {
    return 'denied';
  }
  
  return await Notification.requestPermission();
}

/**
 * Show a browser notification for a medication reminder with fallback options
 * 
 * @param medication The medication for the notification
 * @param time The scheduled time to take the medication
 * @param fallbackFn Optional fallback function if notifications aren't supported
 * @returns Boolean indicating if the notification was shown
 */
export function showMedicationNotification(
  medication: Medication, 
  time: Date,
  fallbackFn?: () => void
): boolean {
  // Check for browser support and permission
  if (!browserSupportsNotifications() || Notification.permission !== 'granted') {
    // Execute fallback if provided
    if (fallbackFn) {
      fallbackFn();
    }
    return false;
  }
  
  const title = 'Medication Reminder';
  const options = {
    body: formatNotificationMessage(medication, time),
    icon: '/images/pill-icon.png',
    badge: '/images/pill-badge.png',
    tag: `med-${medication.id}-${time.getTime()}`,
    renotify: true,
    requireInteraction: true
  };
  
  try {
    // Check if we should use service workers for notifications (if available)
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Service worker notifications are available
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options).then(() => {
          // Track the notification using analytics
          trackNotification();
        });
      }).catch(error => {
        // Fallback to regular notifications
        const notification = new Notification(title, options);
        setupNotificationClickHandler(notification);
        trackNotification();
      });
    } else {
      // Use standard notifications
      const notification = new Notification(title, options);
      setupNotificationClickHandler(notification);
      trackNotification();
    }
    
    return true;
    
    // Helper function to set up click handler
    function setupNotificationClickHandler(notification: Notification) {
      notification.onclick = function() {
        // Focus on the tab or open a new one if needed
        window.focus();
        // Navigate to the medication reminders page
        window.location.href = '/dashboard/medication-reminders';
      };
    }
    
    // Helper function to track notifications
    function trackNotification() {
      try {
        if (typeof window !== 'undefined' && 'trackNotificationSent' in window) {
          // @ts-ignore - Analytics might be available from notification-analytics.ts
          window.trackNotificationSent({
            type: NotificationType.BROWSER,
            title,
            body: options.body,
            userId: 'current-user', // Should be replaced with actual user ID
            medicationId: medication.id
          });
        }
      } catch (analyticsError) {
        console.error('Failed to track notification:', analyticsError);
      }
    }
  } catch (error) {
    console.error('Error showing notification:', error);
    
    // Execute fallback if provided
    if (fallbackFn) {
      fallbackFn();
    }
    
    return false;
  }
}

/**
 * Gets the current date, but can be overridden for testing
 * @returns The current date
 */
export function getCurrentDate(): Date {
  // This function makes it easy to mock the current date for testing
  return new Date();
}
