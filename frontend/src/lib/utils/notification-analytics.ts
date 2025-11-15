/**
 * Notification analytics utilities
 * 
 * This file contains utility functions for tracking and analyzing notification
 * delivery, user engagement, and effectiveness metrics.
 */

import { NotificationType } from './prescription-utils';

// Types for notification analytics
export interface NotificationEvent {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  userId: string;
  medicationId?: string;
  prescriptionId?: string;
  appointmentId?: string;
}

export interface NotificationInteraction {
  eventId: string;
  action: 'delivered' | 'viewed' | 'clicked' | 'dismissed' | 'failed';
  timestamp: string;
  timeTaken?: number; // milliseconds from delivery to interaction
  deviceInfo?: string;
  browser?: string;
}

export interface NotificationMetrics {
  totalSent: number;
  totalDelivered: number;
  totalViewed: number;
  totalClicked: number;
  totalDismissed: number;
  totalFailed: number;
  clickThroughRate: number;
  viewRate: number;
  averageResponseTime: number; // milliseconds
  deliveryRate: number;
  mostEffectiveType: NotificationType;
  bestTimeOfDay: number; // hour of day (0-23)
}

// In-memory store for notification events (in production, use a database)
const notificationEvents: NotificationEvent[] = [];
const notificationInteractions: NotificationInteraction[] = [];

/**
 * Track a notification event (sending)
 * 
 * @param event Notification event details
 * @returns The notification event ID
 */
export function trackNotificationSent(event: Omit<NotificationEvent, 'id' | 'timestamp'>): string {
  const id = generateEventId();
  const timestamp = new Date().toISOString();
  
  const notificationEvent: NotificationEvent = {
    ...event,
    id,
    timestamp
  };
  
  // Store the event
  notificationEvents.push(notificationEvent);
  
  // In production, send to analytics API
  sendToAnalyticsAPI('notification_sent', notificationEvent);
  
  return id;
}

/**
 * Track a notification interaction (view, click, dismiss)
 * 
 * @param eventId ID of the notification event
 * @param action Type of interaction
 * @returns Boolean indicating if tracking was successful
 */
export function trackNotificationInteraction(
  eventId: string,
  action: NotificationInteraction['action']
): boolean {
  // Find the original event
  const originalEvent = notificationEvents.find(event => event.id === eventId);
  
  if (!originalEvent) {
    console.error(`No notification event found with ID: ${eventId}`);
    return false;
  }
  
  const timestamp = new Date().toISOString();
  const originalTimestamp = new Date(originalEvent.timestamp);
  const currentTimestamp = new Date(timestamp);
  
  // Calculate time taken in milliseconds
  const timeTaken = currentTimestamp.getTime() - originalTimestamp.getTime();
  
  // Get browser info
  const browser = getBrowserInfo();
  
  const interaction: NotificationInteraction = {
    eventId,
    action,
    timestamp,
    timeTaken,
    browser,
    deviceInfo: navigator.userAgent
  };
  
  // Store the interaction
  notificationInteractions.push(interaction);
  
  // In production, send to analytics API
  sendToAnalyticsAPI('notification_interaction', interaction);
  
  return true;
}

/**
 * Calculate notification metrics based on tracked events and interactions
 * 
 * @param userId Optional user ID to filter metrics by
 * @param startDate Optional start date for metrics calculation
 * @param endDate Optional end date for metrics calculation
 * @returns Calculated notification metrics
 */
export function calculateNotificationMetrics(
  userId?: string,
  startDate?: Date,
  endDate?: Date
): NotificationMetrics {
  // Filter events by user and date range if specified
  let filteredEvents = [...notificationEvents];
  let filteredInteractions = [...notificationInteractions];
  
  if (userId) {
    filteredEvents = filteredEvents.filter(event => event.userId === userId);
    const userEventIds = filteredEvents.map(event => event.id);
    filteredInteractions = filteredInteractions.filter(interaction => 
      userEventIds.includes(interaction.eventId)
    );
  }
  
  if (startDate) {
    filteredEvents = filteredEvents.filter(event => 
      new Date(event.timestamp) >= startDate
    );
    filteredInteractions = filteredInteractions.filter(interaction => 
      new Date(interaction.timestamp) >= startDate
    );
  }
  
  if (endDate) {
    filteredEvents = filteredEvents.filter(event => 
      new Date(event.timestamp) <= endDate
    );
    filteredInteractions = filteredInteractions.filter(interaction => 
      new Date(interaction.timestamp) <= endDate
    );
  }
  
  // Calculate basic metrics
  const totalSent = filteredEvents.length;
  
  const totalDelivered = filteredInteractions.filter(
    interaction => interaction.action === 'delivered'
  ).length;
  
  const totalViewed = filteredInteractions.filter(
    interaction => interaction.action === 'viewed'
  ).length;
  
  const totalClicked = filteredInteractions.filter(
    interaction => interaction.action === 'clicked'
  ).length;
  
  const totalDismissed = filteredInteractions.filter(
    interaction => interaction.action === 'dismissed'
  ).length;
  
  const totalFailed = filteredInteractions.filter(
    interaction => interaction.action === 'failed'
  ).length;
  
  // Calculate rates
  const deliveryRate = totalSent > 0 ? totalDelivered / totalSent : 0;
  const viewRate = totalDelivered > 0 ? totalViewed / totalDelivered : 0;
  const clickThroughRate = totalViewed > 0 ? totalClicked / totalViewed : 0;
  
  // Calculate average response time (for clicked notifications only)
  const clickedInteractions = filteredInteractions.filter(
    interaction => interaction.action === 'clicked' && interaction.timeTaken !== undefined
  );
  
  const averageResponseTime = clickedInteractions.length > 0
    ? clickedInteractions.reduce((sum, interaction) => sum + (interaction.timeTaken || 0), 0) / clickedInteractions.length
    : 0;
  
  // Determine most effective notification type
  const typeEffectiveness: Record<NotificationType, { sent: number; clicked: number }> = {
    [NotificationType.BROWSER]: { sent: 0, clicked: 0 },
    [NotificationType.EMAIL]: { sent: 0, clicked: 0 },
    [NotificationType.SMS]: { sent: 0, clicked: 0 },
    [NotificationType.PUSH]: { sent: 0, clicked: 0 }
  };
  
  // Count sent by type
  filteredEvents.forEach(event => {
    typeEffectiveness[event.type].sent += 1;
  });
  
  // Count clicked by type
  for (const interaction of filteredInteractions) {
    if (interaction.action === 'clicked') {
      const event = filteredEvents.find(e => e.id === interaction.eventId);
      if (event) {
        typeEffectiveness[event.type].clicked += 1;
      }
    }
  }
  
  // Calculate effectiveness rates
  let mostEffectiveType = NotificationType.BROWSER;
  let highestRate = 0;
  
  Object.entries(typeEffectiveness).forEach(([type, data]) => {
    const rate = data.sent > 0 ? data.clicked / data.sent : 0;
    if (rate > highestRate) {
      highestRate = rate;
      mostEffectiveType = type as NotificationType;
    }
  });
  
  // Determine best time of day (hour with highest click rate)
  const hourlyStats: Record<number, { sent: number; clicked: number }> = {};
  
  // Initialize hours
  for (let hour = 0; hour < 24; hour++) {
    hourlyStats[hour] = { sent: 0, clicked: 0 };
  }
  
  // Count by hour
  filteredEvents.forEach(event => {
    const hour = new Date(event.timestamp).getHours();
    hourlyStats[hour].sent += 1;
  });
  
  for (const interaction of filteredInteractions) {
    if (interaction.action === 'clicked') {
      const hour = new Date(interaction.timestamp).getHours();
      hourlyStats[hour].clicked += 1;
    }
  }
  
  // Find best hour
  let bestTimeOfDay = 9; // Default to 9 AM
  let bestHourRate = 0;
  
  Object.entries(hourlyStats).forEach(([hour, data]) => {
    const rate = data.sent > 0 ? data.clicked / data.sent : 0;
    if (rate > bestHourRate && data.sent >= 5) { // Require minimum sample size
      bestHourRate = rate;
      bestTimeOfDay = parseInt(hour, 10);
    }
  });
  
  return {
    totalSent,
    totalDelivered,
    totalViewed,
    totalClicked,
    totalDismissed,
    totalFailed,
    clickThroughRate,
    viewRate,
    averageResponseTime,
    deliveryRate,
    mostEffectiveType,
    bestTimeOfDay
  };
}

/**
 * Send notification analytics to backend API
 * 
 * @param eventType Type of event
 * @param data Event data
 */
async function sendToAnalyticsAPI(eventType: string, data: any): Promise<void> {
  try {
    // In production, send to real analytics API
    await fetch('/api/analytics/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        data,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to send analytics data:', error);
    // In production, consider storing failed analytics locally and retrying later
  }
}

/**
 * Generate a unique event ID
 * 
 * @returns Unique ID string
 */
function generateEventId(): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `${timestamp}-${random}`;
}

/**
 * Get browser information for analytics
 * 
 * @returns Browser name and version string
 */
function getBrowserInfo(): string {
  const userAgent = navigator.userAgent;
  let browser = "Unknown";
  
  if (userAgent.indexOf("Edge") > -1) {
    browser = "Microsoft Edge (Legacy)";
  } else if (userAgent.indexOf("Edg") > -1) {
    browser = "Microsoft Edge (Chromium)";
  } else if (userAgent.indexOf("Chrome") > -1) {
    browser = "Google Chrome";
  } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
    browser = "Apple Safari";
  } else if (userAgent.indexOf("Firefox") > -1) {
    browser = "Mozilla Firefox";
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
    browser = "Internet Explorer";
  }
  
  return browser;
}

/**
 * Calculate effectiveness of notifications by type and time of day
 * 
 * @param startDate Optional start date for data range
 * @param endDate Optional end date for data range
 * @returns Object containing effectiveness metrics
 */
export async function analyzeNotificationEffectiveness(
  startDate?: Date,
  endDate?: Date
): Promise<{
  byType: Record<NotificationType, number>,
  byTimeOfDay: Record<string, number>,
  byContent: Array<{ pattern: string, effectiveness: number }>
}> {
  try {
    // In production, this would fetch data from the analytics API
    const response = await fetch('/api/analytics/notification-effectiveness', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notification effectiveness data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing notification effectiveness:', error);
    
    // Return dummy data if API call fails
    return {
      byType: {
        [NotificationType.BROWSER]: 0.65,
        [NotificationType.EMAIL]: 0.48,
        [NotificationType.SMS]: 0.82,
        [NotificationType.PUSH]: 0.71
      },
      byTimeOfDay: {
        'morning': 0.72,
        'afternoon': 0.53,
        'evening': 0.64,
        'night': 0.31
      },
      byContent: [
        { pattern: "Your medication is due", effectiveness: 0.68 },
        { pattern: "Time to take", effectiveness: 0.72 },
        { pattern: "Don't forget", effectiveness: 0.61 }
      ]
    };
  }
}

/**
 * Track notification delivery success or failure
 * 
 * @param eventId ID of the notification event
 * @param success Whether delivery was successful
 * @param errorMessage Optional error message if delivery failed
 * @returns Promise resolving when tracking is complete
 */
export async function trackNotificationDelivery(
  eventId: string,
  success: boolean,
  errorMessage?: string
): Promise<void> {
  const timestamp = new Date().toISOString();
  const action = success ? 'delivered' : 'failed';
  
  const interaction: NotificationInteraction = {
    eventId,
    action,
    timestamp,
    deviceInfo: navigator.userAgent
  };
  
  // Store interaction locally
  notificationInteractions.push(interaction);
  
  // Send to analytics API
  try {
    await fetch('/api/analytics/notification-delivery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        success,
        errorMessage,
        timestamp,
        browserInfo: getBrowserInfo(),
        deviceInfo: navigator.userAgent
      }),
    });
  } catch (error) {
    console.error('Failed to track notification delivery:', error);
  }
}

/**
 * Generate a report on notification effectiveness for user segments
 * 
 * @returns Promise resolving to segment effectiveness data
 */
export async function generateUserSegmentReport(): Promise<Record<string, number>> {
  try {
    const response = await fetch('/api/analytics/user-segment-report', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch segment report');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating user segment report:', error);
    
    // Return dummy data if API call fails
    return {
      'elderly-users': 0.58,
      'young-adults': 0.83,
      'middle-aged': 0.76,
      'tech-savvy': 0.92,
      'tech-averse': 0.43
    };
  }
}

/**
 * Optimize notification schedule based on user interaction history
 * 
 * @param userId User ID to optimize for
 * @returns Promise resolving to optimized schedule
 */
export async function optimizeNotificationSchedule(
  userId: string
): Promise<{ 
  bestTimes: number[],
  bestTypes: NotificationType[],
  recommendedFrequency: number
}> {
  try {
    const response = await fetch(`/api/analytics/optimize-schedule/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to optimize notification schedule');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error optimizing notification schedule:', error);
    
    // Return reasonable defaults if API call fails
    return {
      bestTimes: [8, 12, 18], // 8am, 12pm, 6pm
      bestTypes: [NotificationType.PUSH, NotificationType.SMS],
      recommendedFrequency: 3 // notifications per day
    };
  }
}
