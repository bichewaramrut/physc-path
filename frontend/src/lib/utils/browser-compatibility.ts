/**
 * Browser compatibility utilities
 * 
 * This file contains utility functions for checking browser compatibility
 * with various features used in the application.
 */

// Interface for browser feature detection results
export interface BrowserCompatibility {
  notifications: boolean;
  pushManager: boolean;
  serviceWorker: boolean;
  webCrypto: boolean;
  indexedDB: boolean;
  localStorage: boolean;
  dateTimeInput: boolean;
  fullFeatureSet: boolean;
}

/**
 * Detect browser capabilities for features used in the application
 * 
 * @returns Object containing feature support information
 */
export function detectBrowserCapabilities(): BrowserCompatibility {
  // Default all capabilities to false
  const capabilities: BrowserCompatibility = {
    notifications: false,
    pushManager: false,
    serviceWorker: false,
    webCrypto: false,
    indexedDB: false,
    localStorage: false,
    dateTimeInput: false,
    fullFeatureSet: false
  };

  // Only run these checks in a browser environment
  if (typeof window !== 'undefined') {
    // Check for notification support
    capabilities.notifications = 'Notification' in window;

    // Check for Push API support
    capabilities.pushManager = 'PushManager' in window;

    // Check for Service Worker support
    capabilities.serviceWorker = 'serviceWorker' in navigator;

    // Check for Web Crypto API support
    capabilities.webCrypto = !!(window.crypto && window.crypto.subtle);

    // Check for IndexedDB support (for offline storage)
    capabilities.indexedDB = !!window.indexedDB;

    // Check for localStorage support
    capabilities.localStorage = !!window.localStorage;

    // Check for datetime input support
    const input = document.createElement('input');
    input.setAttribute('type', 'datetime-local');
    capabilities.dateTimeInput = input.type === 'datetime-local';

    // Check if all required features are supported
    capabilities.fullFeatureSet = (
      capabilities.notifications && 
      capabilities.pushManager && 
      capabilities.serviceWorker && 
      capabilities.webCrypto && 
      capabilities.indexedDB &&
      capabilities.localStorage
    );
  }

  return capabilities;
}

/**
 * Get browser name and version
 * 
 * @returns Object with browser name and version
 */
export function getBrowserInfo(): { name: string; version: string } {
  const userAgent = navigator.userAgent;
  let browserName = "Unknown";
  let version = "Unknown";
  
  // Extract browser name and version from user agent
  if (userAgent.indexOf("Edge") > -1) {
    browserName = "Microsoft Edge (Legacy)";
    version = userAgent.split("Edge/")[1];
  } else if (userAgent.indexOf("Edg") > -1) {
    browserName = "Microsoft Edge (Chromium)";
    version = userAgent.split("Edg/")[1];
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserName = "Google Chrome";
    version = userAgent.split("Chrome/")[1].split(" ")[0];
  } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
    browserName = "Apple Safari";
    version = userAgent.split("Version/")[1].split(" ")[0];
  } else if (userAgent.indexOf("Firefox") > -1) {
    browserName = "Mozilla Firefox";
    version = userAgent.split("Firefox/")[1];
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
    browserName = "Internet Explorer";
    version = userAgent.indexOf("MSIE") > -1 ? userAgent.split("MSIE ")[1].split(";")[0] : "11.0";
  }

  return { name: browserName, version };
}

/**
 * Check if the browser is supported for critical features
 * 
 * @returns Boolean indicating if the browser has minimum required support
 */
export function isBrowserSupported(): boolean {
  const capabilities = detectBrowserCapabilities();
  
  // Minimum requirements for basic functionality
  return capabilities.localStorage && capabilities.dateTimeInput;
}

/**
 * Get fallback recommendations based on browser capabilities
 * 
 * @returns Object with fallback options for unsupported features
 */
export function getFallbackOptions(): Record<string, string> {
  const capabilities = detectBrowserCapabilities();
  const fallbacks: Record<string, string> = {};
  
  // Provide fallback options for unsupported features
  if (!capabilities.notifications) {
    fallbacks.notifications = "Email notifications";
  }
  
  if (!capabilities.pushManager || !capabilities.serviceWorker) {
    fallbacks.pushNotifications = "Email or SMS alerts";
  }
  
  if (!capabilities.webCrypto) {
    fallbacks.security = "Reduced security features";
  }
  
  return fallbacks;
}

/**
 * Get recommended notification methods based on browser capabilities
 * 
 * @returns Array of recommended notification methods
 */
export function getRecommendedNotificationMethods(): { type: string; supported: boolean }[] {
  const capabilities = detectBrowserCapabilities();
  
  return [
    { type: 'browser', supported: capabilities.notifications },
    { type: 'push', supported: capabilities.pushManager && capabilities.serviceWorker },
    { type: 'email', supported: true }, // Email is always supported server-side
    { type: 'sms', supported: true }    // SMS is always supported server-side
  ];
}

/**
 * Check if the current browser can support RazorPay integration
 * 
 * @returns Boolean indicating if RazorPay is supported
 */
export function isPaymentGatewaySupported(): boolean {
  // Check for minimum requirements for payment gateway
  if (typeof window !== 'undefined') {
    return (
      'fetch' in window && 
      'Promise' in window && 
      'localStorage' in window
    );
  }
  return false;
}

/**
 * Get recommended browser if current one is not fully compatible
 * 
 * @returns Object with recommendation details or null if current browser is fine
 */
export function getBrowserRecommendation(): { name: string; reason: string } | null {
  const capabilities = detectBrowserCapabilities();
  const browserInfo = getBrowserInfo();
  
  // If the browser supports all critical features, don't recommend switching
  if (capabilities.notifications && 
      capabilities.pushManager && 
      capabilities.webCrypto && 
      capabilities.localStorage) {
    return null;
  }
  
  // Recommend based on the OS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  if (isIOS) {
    return {
      name: 'Safari',
      reason: 'Better support for notifications and web features on iOS'
    };
  } else if (isAndroid) {
    return {
      name: 'Chrome',
      reason: 'Best support for notifications and web push on Android'
    };
  } else {
    return {
      name: 'Chrome or Firefox',
      reason: 'Better support for notifications and web crypto features'
    };
  }
}

/**
 * Log browser compatibility for analytics
 * 
 * @returns Promise that resolves when logging is complete
 */
export async function logBrowserCompatibility(): Promise<void> {
  const capabilities = detectBrowserCapabilities();
  const browserInfo = getBrowserInfo();
  
  try {
    await fetch('/api/analytics/browser-compatibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        browser: browserInfo.name,
        version: browserInfo.version,
        capabilities,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to log browser compatibility:', error);
  }
}

/**
 * Log detailed browser compatibility information for troubleshooting
 * 
 * @returns Promise resolving when log is complete
 */
export async function logDetailedBrowserInfo(): Promise<void> {
  const capabilities = detectBrowserCapabilities();
  const browserInfo = getBrowserInfo();
  const securityInfo = {
    isSecureContext: window.isSecureContext,
    isHttps: window.location.protocol === 'https:',
    cookiesEnabled: navigator.cookieEnabled,
  };
  
  // Collect screen and device info
  const screenInfo = {
    width: window.screen.width,
    height: window.screen.height,
    pixelRatio: window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
  };
  
  try {
    await fetch('/api/analytics/detailed-browser-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        browser: browserInfo.name,
        version: browserInfo.version,
        capabilities,
        securityInfo,
        screenInfo,
        userAgent: navigator.userAgent,
        language: navigator.language,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to log detailed browser information:', error);
  }
}
