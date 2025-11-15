import apiClient from './client';
import { PRESCRIPTION_ENDPOINTS } from './endpoints';

// Types
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  sideEffects: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  medications: Medication[];
  issueDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
  notes: string;
  pharmacyDetails?: {
    name: string;
    address: string;
    phone: string;
  };
}

// API methods
export const prescriptionsApi = {
  // Get all prescriptions for current user
  getPrescriptions: async (params?: { status?: string; page?: number; size?: number }) => {
    try {
      const response = await apiClient.get(PRESCRIPTION_ENDPOINTS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  },
  
  // Get prescription details by ID
  getPrescription: async (id: string) => {
    try {
      const response = await apiClient.get(PRESCRIPTION_ENDPOINTS.DETAILS(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching prescription:', error);
      throw error;
    }
  },
  
  // Request refill for a prescription
  requestRefill: async (id: string) => {
    try {
      const response = await apiClient.post(`${PRESCRIPTION_ENDPOINTS.DETAILS(id)}/refill`);
      return response.data;
    } catch (error) {
      console.error('Error requesting refill:', error);
      throw error;
    }
  },
  
  // Create a new prescription
  createPrescription: async (data: Omit<Prescription, 'id'>) => {
    try {
      const response = await apiClient.post(PRESCRIPTION_ENDPOINTS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  },
  
  // Update a prescription
  updatePrescription: async (id: string, data: Partial<Prescription>) => {
    try {
      const response = await apiClient.put(PRESCRIPTION_ENDPOINTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error(`Error updating prescription ${id}:`, error);
      throw error;
    }
  },
  
  // Download a prescription as PDF
  downloadPrescription: async (id: string) => {
    try {
      const response = await apiClient.get(`${PRESCRIPTION_ENDPOINTS.DETAILS(id)}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error downloading prescription ${id}:`, error);
      throw error;
    }
  }
};
