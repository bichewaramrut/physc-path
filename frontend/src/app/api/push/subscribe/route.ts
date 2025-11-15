import { NextResponse, NextRequest } from 'next/server';
import webpush from 'web-push';

// Set up VAPID keys for web push
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPublicKey || !vapidPrivateKey) {
  console.error('VAPID keys are missing. Push notifications will not work.');
} else {
  // Set VAPID details
  webpush.setVapidDetails(
    'mailto:support@thepshyc.com', // Contact email for push service
    vapidPublicKey,
    vapidPrivateKey
  );
}

// In-memory store for subscriptions (replace with database in production)
// Note: This will reset on server restart, you should use a database in production
const subscriptions = new Map();

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    const userId = request.cookies.get('userId')?.value || 'anonymous';
    
    // Store the subscription
    subscriptions.set(userId, subscription);
    
    // In a real application, you'd save this to your database instead
    console.log(`Subscription saved for user: ${userId}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

// Helper function to send a test notification (moved to utils to avoid Next.js API route constraints)
async function testPushNotification(userId: string) {
  const subscription = subscriptions.get(userId);
  if (!subscription) {
    throw new Error(`No subscription found for user: ${userId}`);
  }
  
  const payload = JSON.stringify({
    title: 'Test Notification',
    body: 'This is a test push notification',
    icon: '/images/pill-icon.png',
    tag: 'test-notification'
  });
  
  await webpush.sendNotification(subscription, payload);
}
