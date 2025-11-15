# Notification System Dependencies

To fully implement the medication reminder notification system, the following packages need to be installed:

## Required Packages

```bash
# React Components and UI Libraries
npm install @radix-ui/react-switch
npm install @radix-ui/react-slider
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-label
npm install @radix-ui/react-popover
npm install react-day-picker

# For service worker registration (push notifications)
npm install workbox-core
npm install workbox-precaching
npm install workbox-routing
npm install workbox-strategies

# For testing
npm install -D cypress @testing-library/cypress
```

## Service Worker Setup

1. Create a service worker file at `/public/sw.js`:

```javascript
// This is a minimal service worker for handling push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  
  // Show notification using data from push event
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || '/images/pill-icon.png',
    badge: data.badge || '/images/pill-badge.png',
    tag: data.tag,
    data: data.data,
    requireInteraction: data.requireInteraction || true
  });
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Navigate to the appropriate page when notification is clicked
  const urlToOpen = new URL('/dashboard/medication-reminders', self.location.origin).href;
  
  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then((windowClients) => {
    // Check if there is already a window/tab open with the target URL
    let matchingClient = null;
    
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient;
        break;
      }
    }
    
    // If a matching window/tab exists, focus it
    if (matchingClient) {
      return matchingClient.focus();
    } else {
      // Otherwise, open a new window/tab
      return clients.openWindow(urlToOpen);
    }
  });
  
  event.waitUntil(promiseChain);
});
```

2. Register the service worker in your application by adding the following code in `_app.tsx` or a similar entry point:

```typescript
// Register service worker for push notifications
if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(
      function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      },
      function(err) {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}
```

## Icons and Assets

Create and add the following notification-related assets:
- `/public/images/pill-icon.png` (192x192 pixels recommended)
- `/public/images/pill-badge.png` (96x96 pixels recommended)
