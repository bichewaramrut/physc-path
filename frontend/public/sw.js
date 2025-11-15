// Enhanced service worker for handling push notifications with security
self.addEventListener('push', event => {
  try {
    let rawData = event.data ? event.data.text() : null;
    let data;
    
    // Check if payload is encrypted (starts with "encrypted:")
    if (rawData && rawData.startsWith('encrypted:')) {
      // In a real implementation, we would decrypt the payload here
      // For now, we'll just strip the prefix and parse the JSON
      rawData = rawData.substring(10);
      try {
        data = JSON.parse(atob(rawData));
      } catch (error) {
        console.error('Failed to decrypt push notification payload:', error);
        data = { title: 'Medication Reminder', body: 'Time to take your medication' };
      }
    } else {
      // Handle plain text payload
      data = event.data ? event.data.json() : { title: 'Medication Reminder', body: 'Time to take your medication' };
    }
    
    // Validate notification timestamp to prevent replay attacks
    const timestamp = data.timestamp || 0;
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    if (now - timestamp > maxAge) {
      console.warn('Rejected outdated push notification');
      return;
    }
    
    // Show notification using data from push event
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/images/pill-icon.png',
      badge: data.badge || '/images/pill-badge.png',
      tag: data.tag,
      data: data.data,
      requireInteraction: data.requireInteraction || true
    });
  } catch (error) {
    console.error('Error processing push notification:', error);
  }
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
