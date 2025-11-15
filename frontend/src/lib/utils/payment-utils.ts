/**
 * Payment Utilities
 * 
 * This file contains utility functions for payment-related operations
 * including prescription payment integrations
 */

import { Prescription } from '@/lib/api/prescriptions';
import { addDays, format, parseISO } from 'date-fns';
import { NotificationType } from './prescription-utils';

// Payment status types
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

// Payment method types
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER'
}

// Payment interface
export interface Payment {
  id: string;
  userId: string;
  transactionId?: string;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  description?: string;
  invoiceNumber?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  prescriptionIds?: string[];
}

/**
 * Get the appropriate CSS class for payment/invoice status badges
 * 
 * @param status Payment or invoice status
 * @returns CSS class string for the status badge
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      
    case 'pending':
    case 'issued':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      
    case 'failed':
    case 'overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      
    case 'refunded':
    case 'cancelled':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

/**
 * Format a currency amount with the appropriate symbol and decimal places
 * 
 * @param amount The amount to format
 * @param currency The currency code (e.g., USD, EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Calculate the due date for an invoice based on the issue date and payment terms
 * 
 * @param issueDate The date the invoice was issued
 * @param paymentTerms Payment terms in days (e.g., 30 for Net-30)
 * @returns The due date as an ISO string
 */
export function calculateDueDate(issueDate: string | Date, paymentTerms: number = 30): string {
  const date = typeof issueDate === 'string' ? new Date(issueDate) : new Date(issueDate);
  date.setDate(date.getDate() + paymentTerms);
  return date.toISOString();
}

/**
 * Check if an invoice is overdue
 * 
 * @param dueDate The due date of the invoice
 * @returns Boolean indicating if the invoice is overdue
 */
export function isOverdue(dueDate: string | Date): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : new Date(dueDate);
  const today = new Date();
  return due < today;
}

/**
 * Mask a credit card number for display
 * 
 * @param cardNumber Full credit card number
 * @returns Masked card number (e.g., **** **** **** 1234)
 */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) return cardNumber;
  const last4 = cardNumber.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

/**
 * Calculate subtotal, tax, and total for an invoice
 * 
 * @param items Invoice line items
 * @param taxRate Tax rate as a percentage (e.g., 7.5 for 7.5%)
 * @param discount Discount amount to apply
 * @returns Object containing subtotal, tax, and total
 */
export function calculateInvoiceTotals(
  items: Array<{ quantity: number; unitPrice: number; total?: number }>,
  taxRate: number = 0,
  discount: number = 0
): { subtotal: number; tax: number; total: number } {
  // Calculate subtotal from items
  const subtotal = items.reduce((sum, item) => {
    if (typeof item.total === 'number') {
      return sum + item.total;
    }
    return sum + (item.quantity * item.unitPrice);
  }, 0);
  
  // Calculate tax amount
  const tax = subtotal * (taxRate / 100);
  
  // Calculate final total
  const total = subtotal + tax - discount;
  
  return {
    subtotal,
    tax,
    total
  };
}

/**
 * Calculate the cost of a prescription based on medications and insurance
 * 
 * @param prescription The prescription to calculate cost for
 * @param insuranceCoverage Percentage of insurance coverage (0-100)
 * @returns The calculated cost
 */
export function calculatePrescriptionCost(prescription: Prescription, insuranceCoverage: number = 0): number {
  if (!prescription.medications || prescription.medications.length === 0) {
    return 0;
  }
  
  // Base price calculation - this is simplified and should be replaced with actual pricing logic
  const totalQuantity = prescription.medications.reduce((total, med) => {
    return total + (med.quantity || 0);
  }, 0);
  
  // Assume $5 per unit of medication
  const baseCost = totalQuantity * 5;
  
  // Apply insurance coverage
  const coverage = Math.min(Math.max(0, insuranceCoverage), 100) / 100; // Ensure it's between 0-100%
  const finalCost = baseCost * (1 - coverage);
  
  return parseFloat(finalCost.toFixed(2));
}

/**
 * Check if a prescription has an associated payment
 * 
 * @param prescription The prescription to check
 * @returns Boolean indicating if payment exists
 */
export function hasPrescriptionPayment(prescription: Prescription): boolean {
  return prescription.paymentId !== undefined && prescription.paymentId !== null;
}

/**
 * Check if a prescription's payment is completed
 * 
 * @param prescription The prescription to check
 * @param payments Array of payments to check against
 * @returns Boolean indicating if payment is completed
 */
export function isPrescriptionPaymentCompleted(prescription: Prescription, payments: Payment[]): boolean {
  if (!hasPrescriptionPayment(prescription)) {
    return false;
  }
  
  const payment = payments.find(p => p.id === prescription.paymentId);
  return payment?.status === PaymentStatus.COMPLETED;
}

/**
 * Calculate the number of days until renewal payment is required
 * 
 * @param prescription The prescription to calculate for
 * @returns Number of days until renewal, or 0 if not applicable
 */
export function daysUntilRenewalPayment(prescription: Prescription): number {
  if (prescription.status !== 'ACTIVE' || !prescription.expiryDate) {
    return 0;
  }
  
  const today = new Date();
  const expiryDate = parseISO(prescription.expiryDate);
  const thirtyDaysBefore = addDays(expiryDate, -30);
  
  // If we're already in the renewal window
  if (today >= thirtyDaysBefore && today < expiryDate) {
    return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }
  
  // If it's too early for renewal
  if (today < thirtyDaysBefore) {
    return Math.ceil((thirtyDaysBefore.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }
  
  // If it's already expired
  return 0;
}

/**
 * Create a payment notification for upcoming renewals
 * 
 * @param prescription The prescription to notify for
 * @param notificationTypes Array of notification types to use
 * @returns Object with notification data if applicable
 */
export function createRenewalPaymentNotification(
  prescription: Prescription, 
  notificationTypes: NotificationType[] = [NotificationType.BROWSER, NotificationType.EMAIL]
): { 
  title: string; 
  message: string; 
  time: Date; 
  types: NotificationType[];
} | null {
  const daysUntil = daysUntilRenewalPayment(prescription);
  
  // Only notify if within 30 days of expiry
  if (daysUntil <= 0 || daysUntil > 30) {
    return null;
  }
  
  const expiryDate = parseISO(prescription.expiryDate);
  
  return {
    title: 'Prescription Renewal',
    message: `Your prescription will expire in ${daysUntil} days on ${format(expiryDate, 'MMMM d, yyyy')}. Please arrange payment for renewal.`,
    time: new Date(), // Send immediately
    types: notificationTypes
  };
}

/**
 * Generate an invoice for a prescription
 * 
 * @param prescription The prescription to create invoice for
 * @param patient The patient data
 * @param insuranceCoverage Percentage of insurance coverage (0-100)
 * @returns Object with invoice details
 */
export function generatePrescriptionInvoice(
  prescription: Prescription, 
  patient: any, 
  insuranceCoverage: number = 0
): {
  invoiceNumber: string;
  issuedDate: string;
  dueDate: string;
  patientDetails: any;
  prescriptionDetails: any;
  items: any[];
  subtotal: number;
  insuranceDiscount: number;
  totalAmount: number;
} {
  const issuedDate = new Date();
  const dueDate = addDays(issuedDate, 30);
  const medications = prescription.medications || [];
  
  // Calculate costs for each medication
  const items = medications.map(med => {
    const quantity = med.quantity || 1;
    const unitPrice = 5; // Simplified pricing
    return {
      name: med.name,
      description: `${med.dosage}${med.frequency ? `, ${med.frequency}` : ''}`,
      quantity,
      unitPrice,
      total: quantity * unitPrice
    };
  });
  
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const insuranceDiscount = subtotal * (Math.min(Math.max(0, insuranceCoverage), 100) / 100);
  const totalAmount = subtotal - insuranceDiscount;
  
  return {
    invoiceNumber: `INV-${prescription.id.substring(0, 8)}-${format(issuedDate, 'yyyyMMdd')}`,
    issuedDate: format(issuedDate, 'yyyy-MM-dd'),
    dueDate: format(dueDate, 'yyyy-MM-dd'),
    patientDetails: patient,
    prescriptionDetails: {
      id: prescription.id,
      prescriptionNumber: prescription.prescriptionNumber,
      issueDate: prescription.issueDate,
      expiryDate: prescription.expiryDate,
      doctor: prescription.doctor
    },
    items,
    subtotal,
    insuranceDiscount,
    totalAmount
  };
}
