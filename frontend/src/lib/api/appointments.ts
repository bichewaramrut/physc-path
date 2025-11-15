import apiClient from './client';
import { APPOINTMENT_ENDPOINTS } from './endpoints';

// Types
export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  profileImage?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  doctorSpecialization: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'MISSED';
  appointmentTime: string;
  endTime: string;
  duration: number; // in minutes
  type: 'INITIAL_CONSULTATION' | 'FOLLOW_UP' | 'THERAPY_SESSION' | 'MEDICATION_REVIEW';
  reasonForVisit?: string;
  notes?: string;
  consultationId?: string;
  videoSessionId?: string;
}

// API methods
export const appointmentsApi = {
  // Get all appointments for current user
  getAppointments: async (params?: { status?: string; page?: number; size?: number }) => {
    try {
      const response = await apiClient.get(APPOINTMENT_ENDPOINTS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },
  
  // Get appointment details by ID
  getAppointment: async (id: string) => {
    try {
      const response = await apiClient.get(APPOINTMENT_ENDPOINTS.DETAILS(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new appointment
  createAppointment: async (data: {
    doctorId: string;
    appointmentTime: string;
    duration: number;
    type: string;
    reasonForVisit?: string;
    notes?: string;
  }) => {
    try {
      const response = await apiClient.post(APPOINTMENT_ENDPOINTS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  // Update an appointment
  updateAppointment: async (id: string, data: Partial<Appointment>) => {
    try {
      const response = await apiClient.put(APPOINTMENT_ENDPOINTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error);
      throw error;
    }
  },
  
  // Cancel an appointment
  cancelAppointment: async (id: string, reason?: string) => {
    try {
      const response = await apiClient.post(APPOINTMENT_ENDPOINTS.CANCEL(id), { reason });
      return response.data;
    } catch (error) {
      console.error(`Error cancelling appointment ${id}:`, error);
      throw error;
    }
  },
  
  // Check doctor's available time slots
  getDoctorAvailability: async (doctorId: string, date: string) => {
    try {
      const response = await apiClient.get(`/api/v1/doctors/${doctorId}/availability`, {
        params: { date }
      });
      return response.data as TimeSlot[];
    } catch (error) {
      console.error(`Error fetching availability for doctor ${doctorId}:`, error);
      throw error;
    }
  },
  
  // Get list of available doctors
  getAvailableDoctors: async (params?: { specialization?: string; date?: string }) => {
    try {
      const response = await apiClient.get('/api/v1/doctors', { params });
      return response.data as Doctor[];
    } catch (error) {
      console.error('Error fetching available doctors:', error);
      throw error;
    }
  }
};
