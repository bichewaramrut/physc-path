/**
 * RazorPay payment integration utilities for prescription payments
 */

import { Payment, PaymentMethod, PaymentStatus } from './payment-utils';

// RazorPay configuration and types
export interface RazorPayOptions {
  key: string;
  amount: number; // in paisa (1 INR = 100 paisa)
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler?: (response: RazorPaySuccessResponse) => void;
}

export interface RazorPaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Load RazorPay script dynamically
const loadRazorPayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load RazorPay script');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/**
 * Initialize RazorPay payment for a prescription
 * 
 * @param options RazorPay configuration options
 * @returns Promise resolving to payment result
 */
export const initializeRazorPayPayment = async (
  options: RazorPayOptions
): Promise<RazorPaySuccessResponse | null> => {
  const isScriptLoaded = await loadRazorPayScript();
  
  if (!isScriptLoaded || !window.Razorpay) {
    throw new Error('Failed to load RazorPay checkout script');
  }

  return new Promise((resolve) => {
    const razorpayOptions: RazorPayOptions = {
      ...options,
      handler: (response) => {
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          resolve(null);
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  });
};

/**
 * Create a RazorPay order for prescription payment
 * 
 * @param prescriptionId The prescription ID to pay for
 * @param amount Amount in INR (will be converted to paisa)
 * @param patientName Name of the patient
 * @param patientEmail Email of the patient
 * @param patientPhone Phone number of the patient
 * @returns Promise resolving to order details
 */
export const createRazorPayOrder = async (
  prescriptionId: string,
  amount: number,
  patientName?: string,
  patientEmail?: string,
  patientPhone?: string
): Promise<{ orderId: string; amount: number }> => {
  try {
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prescriptionId,
        amount: Math.round(amount * 100), // Convert to paisa
        currency: 'INR',
        receipt: `prescription_${prescriptionId}`,
        notes: {
          prescriptionId,
          patientName,
          patientEmail,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment order');
    }

    const data = await response.json();
    return {
      orderId: data.id,
      amount: data.amount,
    };
  } catch (error) {
    console.error('Error creating RazorPay order:', error);
    throw error;
  }
};

/**
 * Verify RazorPay payment after successful transaction
 * 
 * @param response RazorPay success response
 * @returns Promise resolving to payment verification result
 */
export const verifyRazorPayPayment = async (
  response: RazorPaySuccessResponse
): Promise<Payment> => {
  try {
    const verificationResponse = await fetch('/api/payments/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    });

    if (!verificationResponse.ok) {
      throw new Error('Payment verification failed');
    }

    return await verificationResponse.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Process a complete prescription payment using RazorPay
 * 
 * @param prescriptionId The prescription ID to pay for
 * @param amount Amount in INR
 * @param patientDetails Patient details
 * @returns Promise resolving to payment status
 */
export const processPrescriptionPayment = async (
  prescriptionId: string,
  amount: number,
  patientDetails: {
    name: string;
    email: string;
    phone: string;
  }
): Promise<Payment> => {
  try {
    // Step 1: Create order
    const order = await createRazorPayOrder(
      prescriptionId,
      amount,
      patientDetails.name,
      patientDetails.email,
      patientDetails.phone
    );
    
    // Step 2: Initialize payment
    const razorPayOptions: RazorPayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: 'INR',
      name: 'The Pshyc',
      description: 'Prescription Payment',
      order_id: order.orderId,
      prefill: {
        name: patientDetails.name,
        email: patientDetails.email,
        contact: patientDetails.phone,
      },
      theme: {
        color: '#4A3AFF',
      },
    };
    
    const paymentResult = await initializeRazorPayPayment(razorPayOptions);
    
    // Step 3: If payment successful, verify and complete
    if (paymentResult) {
      const verifiedPayment = await verifyRazorPayPayment(paymentResult);
      
      // Update local prescription data with payment information
      await updatePrescriptionPaymentStatus(
        prescriptionId,
        verifiedPayment.id,
        PaymentStatus.COMPLETED
      );
      
      return verifiedPayment;
    } else {
      throw new Error('Payment was cancelled or failed');
    }
  } catch (error) {
    console.error('Payment process failed:', error);
    
    // Update with failed status
    await updatePrescriptionPaymentStatus(
      prescriptionId,
      undefined,
      PaymentStatus.FAILED
    );
    
    throw error;
  }
};

/**
 * Update prescription with payment status
 * 
 * @param prescriptionId The prescription ID
 * @param paymentId The payment ID (if successful)
 * @param status The payment status
 */
async function updatePrescriptionPaymentStatus(
  prescriptionId: string,
  paymentId?: string,
  status: PaymentStatus = PaymentStatus.PENDING
): Promise<void> {
  try {
    await fetch(`/api/prescriptions/${prescriptionId}/payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentId,
        status,
        updatedAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to update prescription payment status:', error);
  }
}

/**
 * Check if RazorPay is supported in the current browser
 * 
 * @returns Boolean indicating RazorPay support
 */
export const isRazorPaySupported = (): boolean => {
  // Check for required features
  const requiredFeatures = [
    'fetch' in window,
    'Promise' in window,
    'localStorage' in window,
    'addEventListener' in window,
    'postMessage' in window
  ];
  
  return requiredFeatures.every(Boolean);
};

/**
 * Get fallback payment URL for unsupported browsers
 * 
 * @param prescriptionId The prescription ID to pay for
 * @param amount Amount in INR
 * @returns URL for server-side payment page
 */
export const getFallbackPaymentUrl = (
  prescriptionId: string,
  amount: number
): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/payment/fallback?prescriptionId=${prescriptionId}&amount=${amount}`;
};

/**
 * Handle RazorPay payment errors with detailed information
 * 
 * @param error The error object from RazorPay
 * @returns Formatted error message
 */
export const handleRazorPayError = (error: any): string => {
  // Known error codes from RazorPay
  const errorMessages: Record<string, string> = {
    'BAD_REQUEST_ERROR': 'The payment request was invalid. Please check your information.',
    'GATEWAY_ERROR': 'There was an issue with the payment gateway. Please try again later.',
    'SERVER_ERROR': 'The payment server encountered an error. Please try again later.',
    'PAYMENT_CANCELED': 'The payment was canceled.',
    'NETWORK_ERROR': 'A network error occurred. Please check your internet connection.'
  };
  
  // Log the full error for debugging
  console.error('RazorPay error:', error);
  
  // Extract error code
  const errorCode = error.error?.code || error.code || 'UNKNOWN_ERROR';
  
  // Return appropriate message
  return errorMessages[errorCode] || 'An unexpected error occurred with the payment. Please try again.';
};

/**
 * Track payment analytics
 * 
 * @param event Payment event details
 * @returns Promise resolving when tracking is complete
 */
export const trackPaymentAnalytics = async (
  event: {
    action: 'initiated' | 'completed' | 'failed' | 'cancelled';
    prescriptionId: string;
    amount: number;
    paymentId?: string;
    orderId?: string;
    error?: string;
  }
): Promise<void> => {
  try {
    await fetch('/api/analytics/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
        browserInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
        }
      }),
    });
  } catch (error) {
    console.error('Failed to track payment analytics:', error);
  }
};

/**
 * Enhanced process for handling prescription payment with RazorPay
 * including fallbacks and error tracking
 * 
 * @param prescriptionId The prescription ID to pay for
 * @param amount Amount in INR
 * @param patientDetails Patient details
 * @param options Additional payment options
 * @returns Promise resolving to payment status
 */
export const enhancedProcessPrescriptionPayment = async (
  prescriptionId: string,
  amount: number,
  patientDetails: {
    name: string;
    email: string;
    phone: string;
  },
  options?: {
    currency?: string;
    description?: string;
    theme?: {
      color?: string;
    };
  }
): Promise<Payment> => {
  // Track payment initiation
  await trackPaymentAnalytics({
    action: 'initiated',
    prescriptionId,
    amount
  });
  
  try {
    // Check browser support
    if (!isRazorPaySupported()) {
      throw new Error('BROWSER_UNSUPPORTED');
    }
    
    // Create order
    const order = await createRazorPayOrder(
      prescriptionId,
      amount,
      patientDetails.name,
      patientDetails.email,
      patientDetails.phone
    );
    
    // Initialize payment
    const razorPayOptions: RazorPayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: options?.currency || 'INR',
      name: 'The Pshyc',
      description: options?.description || 'Prescription Payment',
      order_id: order.orderId,
      prefill: {
        name: patientDetails.name,
        email: patientDetails.email,
        contact: patientDetails.phone,
      },
      theme: options?.theme || {
        color: '#4A3AFF',
      },
    };
    
    const paymentResult = await initializeRazorPayPayment(razorPayOptions);
    
    // Handle payment result
    if
