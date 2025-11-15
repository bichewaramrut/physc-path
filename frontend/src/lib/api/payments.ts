import apiClient from './client';
import { PAYMENT_ENDPOINTS, INVOICE_ENDPOINTS } from './endpoints';

// Types
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'bank_transfer' | 'paypal' | 'other';
  date: string;
  description?: string;
  appointmentId?: string;
  invoiceId?: string;
  patientId?: string;
  providerId?: string;
  transactionReference?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  patientId: string;
  patientName: string;
  providerId?: string;
  providerName?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  appointmentId?: string;
  notes?: string;
}

export interface PaymentProcessRequest {
  amount: number;
  currency: string;
  method: string;
  invoiceId: string;
  paymentDetails: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    nameOnCard?: string;
    [key: string]: any;
  };
}

// API methods
export const paymentsApi = {
  // Get all payments for the current user
  getPayments: async (params?: { 
    status?: string; 
    method?: string;
    startDate?: string;
    endDate?: string;
    page?: number; 
    size?: number 
  }): Promise<Payment[]> => {
    try {
      const response = await apiClient.get(PAYMENT_ENDPOINTS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },
  
  // Get payment details by ID
  getPayment: async (id: string): Promise<Payment> => {
    try {
      const response = await apiClient.get(PAYMENT_ENDPOINTS.DETAILS(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment ${id}:`, error);
      throw error;
    }
  },
  
  // Process a new payment
  processPayment: async (paymentData: PaymentProcessRequest): Promise<Payment> => {
    try {
      const response = await apiClient.post(PAYMENT_ENDPOINTS.PROCESS, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },
  
  // Verify a payment (e.g., after 3D Secure authentication)
  verifyPayment: async (id: string, verificationData: any): Promise<Payment> => {
    try {
      const response = await apiClient.post(PAYMENT_ENDPOINTS.VERIFY(id), verificationData);
      return response.data;
    } catch (error) {
      console.error(`Error verifying payment ${id}:`, error);
      throw error;
    }
  },
  
  // Get all invoices for the current user
  getInvoices: async (params?: { 
    status?: string; 
    startDate?: string;
    endDate?: string;
    page?: number; 
    size?: number 
  }): Promise<Invoice[]> => {
    try {
      const response = await apiClient.get(INVOICE_ENDPOINTS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },
  
  // Get invoice details by ID
  getInvoice: async (id: string): Promise<Invoice> => {
    try {
      const response = await apiClient.get(INVOICE_ENDPOINTS.DETAILS(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new invoice
  createInvoice: async (data: Omit<Invoice, 'id'>): Promise<Invoice> => {
    try {
      const response = await apiClient.post(INVOICE_ENDPOINTS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },
  
  // Update an invoice
  updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
    try {
      const response = await apiClient.put(INVOICE_ENDPOINTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice ${id}:`, error);
      throw error;
    }
  },
  
  // Download an invoice as PDF
  downloadInvoice: async (id: string): Promise<Blob> => {
    try {
      const response = await apiClient.get(INVOICE_ENDPOINTS.PDF(id), {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading invoice ${id}:`, error);
      throw error;
    }
  }
};
