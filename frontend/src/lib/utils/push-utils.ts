'use client';

/**
 * Push notification utilities for medication reminders
 */

/**
 * Convert a base64 string to a Uint8Array
 * 
 * @param base64String Base64 string to convert
 * @returns Uint8Array representation
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

/**
 * Check if push notifications are supported by the browser
 * 
 * @returns Boolean indicating if push is supported
 */
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Register the service worker for push notifications
 * 
 * @returns Promise resolving to ServiceWorkerRegistration or null
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushNotificationSupported()) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
}

/**
 * Request permission for push notifications
 * 
 * @returns Promise resolving to permission state
 */
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    return 'denied';
  }
  
  return await Notification.requestPermission();
}

/**
 * Subscribe to push notifications
 * 
 * @param vapidPublicKey VAPID public key for push service
 * @returns Promise resolving to PushSubscription or null
 */
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) {
    return null;
  }
  
  try {
    // Register service worker if not already registered
    const registration = await registerServiceWorker();
    if (!registration) return null;
    
    // Get existing subscription or create new one
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    }
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

/**
 * Send the push subscription to the backend for storage
 * 
 * @param subscription PushSubscription object to send to backend
 * @returns Promise resolving to boolean indicating success
 */
export async function sendSubscriptionToServer(subscription: PushSubscription): Promise<boolean> {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
    return false;
  }
}

/**
 * Unsubscribe from push notifications
 * 
 * @returns Promise resolving to boolean indicating success
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      return true; // Already unsubscribed
    }
    
    // Unsubscribe from push service
    const success = await subscription.unsubscribe();
    
    if (success) {
      // Remove subscription from server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    }
    
    return success;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    return false;
  }
}

/**
 * Get the current notification permission status
 * 
 * @returns Current notification permission state
 */
export function getNotificationPermission(): NotificationPermission {
  return Notification.permission;
}

/**
 * Complete push notification initialization workflow
 * 
 * @param vapidPublicKey VAPID public key for push service
 * @returns Promise resolving to boolean indicating success
 */
export async function initializePushNotifications(vapidPublicKey: string): Promise<boolean> {
  if (!isPushNotificationSupported()) {
    return false;
  }
  
  try {
    // Request notification permission
    const permission = await requestPushPermission();
    if (permission !== 'granted') return false;
    
    // Subscribe to push service
    const subscription = await subscribeToPush(vapidPublicKey);
    if (!subscription) return false;
    
    // Save subscription to backend
    return await sendSubscriptionToServer(subscription);
  } catch (error) {
    console.error('Failed to initialize push notifications:', error);
    return false;
  }
}
