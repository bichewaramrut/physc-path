import { PushNotificationTester } from "@/components/ui/push-notification-tester";

export default function NotificationTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Push Notification Testing Page</h1>
      <p className="text-gray-600 mb-8">
        Use this page to test and verify push notifications are working correctly.
      </p>
      
      <div className="max-w-lg">
        <PushNotificationTester />
      </div>
    </div>
  );
}
