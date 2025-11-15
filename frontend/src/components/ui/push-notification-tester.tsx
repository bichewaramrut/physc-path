"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  isPushNotificationSupported, 
  requestPushPermission,
  getNotificationPermission,
  subscribeToPush,
  sendSubscriptionToServer
} from "@/lib/utils/push-utils";

export function PushNotificationTester() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(
    typeof Notification !== 'undefined' ? Notification.permission : null
  );

  // Get the VAPID public key from environment
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

  async function handleEnablePushNotifications() {
    setIsLoading(true);
    try {
      // Check browser support
      if (!isPushNotificationSupported()) {
        toast({
          title: "Push Notifications Not Supported",
          description: "Your browser does not support push notifications.",
          variant: "destructive",
        });
        return;
      }

      // Request permission
      const permission = await requestPushPermission();
      setPermissionStatus(permission);

      if (permission !== "granted") {
        toast({
          title: "Permission Denied",
          description: "You need to grant permission for push notifications.",
          variant: "destructive",
        });
        return;
      }

      // Subscribe to push service
      const subscription = await subscribeToPush(vapidPublicKey);
      if (!subscription) {
        toast({
          title: "Subscription Failed",
          description: "Failed to subscribe to push service.",
          variant: "destructive",
        });
        return;
      }

      // Send subscription to server
      const success = await sendSubscriptionToServer(subscription);
      if (success) {
        toast({
          title: "Push Notifications Enabled",
          description: "You will now receive medication reminders.",
        });
      } else {
        toast({
          title: "Server Error",
          description: "Failed to register subscription with server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error setting up push notifications:", error);
      toast({
        title: "Setup Error",
        description: "An error occurred setting up push notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleTestNotification() {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser does not support notifications.",
        variant: "destructive",
      });
      return;
    }

    if (Notification.permission !== "granted") {
      toast({
        title: "Permission Needed",
        description: "Notification permission has not been granted.",
        variant: "destructive",
      });
      return;
    }

    // Send a test notification
    new Notification("Test Notification", {
      body: "This is a test notification from The Pshyc.",
      icon: "/images/pill-icon.png",
    });
  }

  return (
    <div className="space-y-4 p-4 border rounded-md bg-card">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Push Notification Testing</h3>
        <p className="text-sm text-muted-foreground">
          Current permission status: <span className="font-medium">{permissionStatus || "unknown"}</span>
        </p>
      </div>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button
          onClick={handleEnablePushNotifications}
          disabled={isLoading || permissionStatus === "granted"}
        >
          {isLoading ? "Setting up..." : "Enable Push Notifications"}
        </Button>
        
        <Button
          onClick={handleTestNotification}
          disabled={permissionStatus !== "granted"}
          variant="outline"
        >
          Send Test Notification
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Note: Notifications may not work in some browsers or private browsing modes.</p>
        <p>Push notifications require a secure context (HTTPS) to function properly.</p>
      </div>
    </div>
  );
}
