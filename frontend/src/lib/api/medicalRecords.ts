import apiClient from './client';
import { MEDICAL_RECORD_ENDPOINTS } from './endpoints';

// Types
export interface Document {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  uploadedBy: string;
  url: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  recordType: 'DIAGNOSIS' | 'TEST_RESULT' | 'PRESCRIPTION' | 'CONSULTATION_NOTES' | 'OTHER';
  title: string;
  description: string;
  date: string;
  doctorId?: string;
  doctorName?: string;
  documents: Document[];
  tags: string[];
  consultationId?: string;
  isShared: boolean;
}

// API methods
export const medicalRecordsApi = {
  // Get all medical records for current user
  getMedicalRecords: async (params?: { recordType?: string; page?: number; size?: number }) => {
    try {
      const response = await apiClient.get(MEDICAL_RECORD_ENDPOINTS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching medical records:', error);
      throw error;
    }
  },
  
  // Get medical record details by ID
  getMedicalRecord: async (id: string) => {
    try {
      const response = await apiClient.get(MEDICAL_RECORD_ENDPOINTS.DETAILS(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching medical record ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new medical record
  createMedicalRecord: async (data: Omit<MedicalRecord, 'id'>) => {
    try {
      const response = await apiClient.post(MEDICAL_RECORD_ENDPOINTS.CREATE, data);
      return response.data;
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  },
  
  // Update a medical record
  updateMedicalRecord: async (id: string, data: Partial<MedicalRecord>) => {
    try {
      const response = await apiClient.put(MEDICAL_RECORD_ENDPOINTS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      console.error(`Error updating medical record ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a medical record
  deleteMedicalRecord: async (id: string) => {
    try {
      const response = await apiClient.delete(MEDICAL_RECORD_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting medical record ${id}:`, error);
      throw error;
    }
  },
  
  // Upload document to a medical record
  uploadDocument: async (id: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post(`${MEDICAL_RECORD_ENDPOINTS.DETAILS(id)}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading document to medical record ${id}:`, error);
      throw error;
    }
  },
  
  // Delete document from a medical record
  deleteDocument: async (recordId: string, documentId: string) => {
    try {
      const response = await apiClient.delete(`${MEDICAL_RECORD_ENDPOINTS.DETAILS(recordId)}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting document ${documentId} from medical record ${recordId}:`, error);
      throw error;
    }
  }
};
