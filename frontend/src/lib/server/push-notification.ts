import webpush from 'web-push';
import { Medication } from '@/lib/api/prescriptions';
import { format } from 'date-fns';

// Initialize VAPID keys for web push
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  console.error('VAPID keys are missing. Push notifications will not work.');
} else {
  webpush.setVapidDetails(
    'mailto:support@thepshyc.com', // Contact email for push service
    vapidPublicKey,
    vapidPrivateKey
  );
}

/**
 * Interface for a push notification subscription stored in the database
 */
export interface PushSubscriptionData {
  userId: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Send a push notification for a medication reminder
 * 
 * @param subscription Push subscription to send to
 * @param medication Medication to send reminder for
 * @param time Time to take the medication
 * @returns Promise that resolves when the notification is sent
 */
export async function sendMedicationReminderPush(
  subscription: PushSubscriptionObject,
  medication: Medication,
  time: Date
): Promise<void> {
  const payload = JSON.stringify({
    title: 'Medication Reminder',
    body: `Time to take ${medication.dosage} of ${medication.name}`,
    icon: '/images/pill-icon.png',
    badge: '/images/pill-badge.png',
    tag: `med-${medication.id}-${time.getTime()}`,
    requireInteraction: true,
    data: {
      url: '/dashboard/medication-reminders',
      medicationId: medication.id,
      time: time.toISOString()
    }
  });
  
  try {
    await webpush.sendNotification(subscription, payload);
    console.log(`Push notification sent for medication ${medication.id}`);
  } catch (error) {
    console.error('Error sending push notification:', error);
    
    // Handle expired subscription
    if (typeof error === 'object' && error !== null && 'statusCode' in error && error.statusCode === 410) {
      // Subscription has expired or is no longer valid
      console.log(`Subscription for endpoint ${subscription.endpoint} is no longer valid`);
      // In a production app, you would remove this subscription from your database
    }
  }
}

/**
 * Format a subscription object from database to webpush format
 */
interface PushSubscriptionObject {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Convert a PushSubscriptionData to the format expected by web-push
 * 
 * @param data PushSubscriptionData from database
 * @returns Subscription object for web-push
 */
export function formatPushSubscription(data: PushSubscriptionData): PushSubscriptionObject {
  return {
    endpoint: data.endpoint,
    keys: data.keys
  };
}
