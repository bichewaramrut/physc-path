'use client';

import { useState, useCallback } from 'react';
import { medicalRecordsApi, MedicalRecord } from '@/lib/api/medicalRecords';

export function useMedicalRecords() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchMedicalRecords = useCallback(async (params?: { recordType?: string; page?: number; size?: number }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicalRecordsApi.getMedicalRecords(params);
      setMedicalRecords(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch medical records');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchMedicalRecord = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await medicalRecordsApi.getMedicalRecord(id);
      setCurrentRecord(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch medical record ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createMedicalRecord = useCallback(async (data: Omit<MedicalRecord, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newRecord = await medicalRecordsApi.createMedicalRecord(data);
      setMedicalRecords(prev => [...prev, newRecord]);
      setCurrentRecord(newRecord);
      return newRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create medical record');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateMedicalRecord = useCallback(async (id: string, data: Partial<MedicalRecord>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRecord = await medicalRecordsApi.updateMedicalRecord(id, data);
      setMedicalRecords(prev => 
        prev.map(item => item.id === id ? updatedRecord : item)
      );
      setCurrentRecord(updatedRecord);
      return updatedRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to update medical record ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deleteMedicalRecord = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await medicalRecordsApi.deleteMedicalRecord(id);
      setMedicalRecords(prev => prev.filter(item => item.id !== id));
      if (currentRecord?.id === id) {
        setCurrentRecord(null);
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete medical record ${id}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentRecord?.id]);
  
  const uploadDocument = useCallback(async (recordId: string, file: File) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRecord = await medicalRecordsApi.uploadDocument(recordId, file);
      setMedicalRecords(prev => 
        prev.map(item => item.id === recordId ? updatedRecord : item)
      );
      setCurrentRecord(updatedRecord);
      return updatedRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to upload document to medical record ${recordId}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deleteDocument = useCallback(async (recordId: string, documentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRecord = await medicalRecordsApi.deleteDocument(recordId, documentId);
      setMedicalRecords(prev => 
        prev.map(item => item.id === recordId ? updatedRecord : item)
      );
      setCurrentRecord(updatedRecord);
      return updatedRecord;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to delete document ${documentId} from medical record ${recordId}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    medicalRecords,
    currentRecord,
    loading,
    error,
    fetchMedicalRecords,
    fetchMedicalRecord,
    createMedicalRecord,
    updateMedicalRecord,
    deleteMedicalRecord,
    uploadDocument,
    deleteDocument
  };
}
