'use client';

import { useState, useCallback } from 'react';
import { paymentsApi, Payment, Invoice, InvoiceItem, PaymentProcessRequest } from '@/lib/api/payments';

export type { Payment, Invoice, InvoiceItem, PaymentProcessRequest };

/**
 * Hook for managing payment and invoice data
 * 
 * This hook provides functionality to:
 * - Fetch and manage payments
 * - Fetch and manage invoices
 * - Process new payments
 * - Download invoice PDFs
 * 
 * All API calls include proper error handling and loading states
 */
export function usePayments() {
  // State for payments
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  
  // State for invoices
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetches all payments for the current user
   * 
   * @param params Optional parameters for filtering and pagination
   * @returns Array of Payment objects or null on error
   */
  const fetchPayments = useCallback(async (params?: { 
    status?: string; 
    method?: string;
    startDate?: string;
    endDate?: string;
    page?: number; 
    size?: number 
  }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentsApi.getPayments(params);
      setPayments(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetches a specific payment by ID
   * 
   * @param id The payment ID to fetch
   * @returns Payment object or null on error
   */
  const fetchPayment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentsApi.getPayment(id);
      setCurrentPayment(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch payment ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetches all invoices for the current user
   * 
   * @param params Optional parameters for filtering and pagination
   * @returns Array of Invoice objects or null on error
   */
  const fetchInvoices = useCallback(async (params?: { 
    status?: string; 
    startDate?: string;
    endDate?: string;
    page?: number; 
    size?: number 
  }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentsApi.getInvoices(params);
      setInvoices(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Fetches a specific invoice by ID
   * 
   * @param id The invoice ID to fetch
   * @returns Invoice object or null on error
   */
  const fetchInvoice = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentsApi.getInvoice(id);
      setCurrentInvoice(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch invoice ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Downloads an invoice as PDF
   * 
   * @param id The invoice ID to download
   * @returns true if successful, false on error
   */
  const downloadInvoice = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await paymentsApi.downloadInvoice(id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and click it to download the file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to download invoice ${id}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Processes a new payment
   * 
   * @param data Payment request data including amount, method, and payment details
   * @returns The newly created Payment object or null on error
   */
  const makePayment = useCallback(async (data: PaymentProcessRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newPayment = await paymentsApi.processPayment(data);
      setPayments(prev => [...prev, newPayment]);
      setCurrentPayment(newPayment);
      return newPayment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Returns all payment-related functions and state
   */
  return {
    // State
    payments,          // List of all payments
    currentPayment,    // Currently selected payment
    invoices,          // List of all invoices
    currentInvoice,    // Currently selected invoice
    loading,           // Loading state
    error,             // Error message if any
    
    // Payment methods
    fetchPayments,     // Get all payments
    fetchPayment,      // Get a specific payment
    
    // Invoice methods
    fetchInvoices,     // Get all invoices
    fetchInvoice,      // Get a specific invoice
    downloadInvoice,   // Download an invoice as PDF
    
    // Payment processing
    makePayment        // Process a new payment
  };
}
