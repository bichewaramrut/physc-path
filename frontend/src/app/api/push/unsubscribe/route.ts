import { NextResponse, NextRequest } from 'next/server';

// In-memory store for subscriptions (should match the one in subscribe/route.ts)
// Note: In production, you would use a database instead
const subscriptions = new Map();

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    const userId = request.cookies.get('userId')?.value || 'anonymous';
    
    // Remove the subscription
    subscriptions.delete(userId);
    
    // In a real application, you'd delete this from your database
    console.log(`Subscription removed for user: ${userId}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 }
    );
  }
}
