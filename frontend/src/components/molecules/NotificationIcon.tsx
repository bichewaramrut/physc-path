'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

export function NotificationIcon() {
  const { upcomingNotifications, notificationsEnabled } = useNotifications();
  const [notificationCount, setNotificationCount] = useState(0);
  const [dueSoon, setDueSoon] = useState(false);
  
  // Calculate upcoming notifications
  useEffect(() => {
    if (!upcomingNotifications) return;
    
    const now = new Date();
    const next30Minutes = new Date(now.getTime() + 30 * 60 * 1000);
    
    // Count notifications due in the next 30 minutes
    const dueSoonCount = upcomingNotifications.filter(
      notification => notification.time <= next30Minutes
    ).length;
    
    setNotificationCount(dueSoonCount);
    setDueSoon(dueSoonCount > 0);
  }, [upcomingNotifications]);
  
  if (!notificationsEnabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/dashboard/notification-settings">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enable medication reminders</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/dashboard/medication-reminders">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className={`h-5 w-5 ${dueSoon ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
              {notificationCount > 0 && (
                <Badge
                  className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground"
                  variant="secondary"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          {notificationCount > 0 
            ? `${notificationCount} medication reminder${notificationCount === 1 ? '' : 's'} due soon`
            : 'No upcoming medication reminders'
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
