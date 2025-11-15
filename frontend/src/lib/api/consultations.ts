import apiClient from './client';
import { CONSULTATION_ENDPOINTS } from './endpoints';

// Types
export interface ConsultationNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startTime: string;
  endTime: string | null;
  duration: number | null; // in minutes
  notes: ConsultationNote[];
  diagnosis: string | null;
  recommendations: string | null;
  followUpRequired: boolean;
  videoSessionId: string | null;
}

// API methods
export const consultationsApi = {
  // Get all consultations for current user
  getConsultations: async (params?: { status?: string; page?: number; size?: number }) => {
    try {
      const response = await apiClient.get(CONSULTATION_ENDPOINTS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  },
  
  // Get consultation details by ID
  getConsultation: async (id: string) => {
    try {
      const response = await apiClient.get(CONSULTATION_ENDPOINTS.DETAILS(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching consultation ${id}:`, error);
      throw error;
    }
  },
  
  // Start a consultation from an appointment
  startConsultation: async (appointmentId: string) => {
    try {
      const response = await apiClient.post(CONSULTATION_ENDPOINTS.START(appointmentId));
      return response.data;
    } catch (error) {
      console.error(`Error starting consultation for appointment ${appointmentId}:`, error);
      throw error;
    }
  },
  
  // End a consultation
  endConsultation: async (id: string) => {
    try {
      const response = await apiClient.post(CONSULTATION_ENDPOINTS.END(id));
      return response.data;
    } catch (error) {
      console.error(`Error ending consultation ${id}:`, error);
      throw error;
    }
  },
  
  // Add or update consultation notes
  updateNotes: async (id: string, notes: string) => {
    try {
      const response = await apiClient.post(CONSULTATION_ENDPOINTS.NOTES(id), { notes });
      return response.data;
    } catch (error) {
      console.error(`Error updating notes for consultation ${id}:`, error);
      throw error;
    }
  },
  
  // Update consultation details (diagnosis, recommendations, etc.)
  updateConsultation: async (id: string, data: Partial<Consultation>) => {
    try {
      const response = await apiClient.put(CONSULTATION_ENDPOINTS.DETAILS(id), data);
      return response.data;
    } catch (error) {
      console.error(`Error updating consultation ${id}:`, error);
      throw error;
    }
  }
};
