'use client';

import { useState, useCallback } from 'react';
import { consultationsApi, Consultation } from '@/lib/api/consultations';

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [currentConsultation, setCurrentConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchConsultations = useCallback(async (params?: { status?: string; page?: number; size?: number }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultationsApi.getConsultations(params);
      setConsultations(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch consultations');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchConsultation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultationsApi.getConsultation(id);
      setCurrentConsultation(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch consultation ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const startConsultation = useCallback(async (appointmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultationsApi.startConsultation(appointmentId);
      setCurrentConsultation(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to start consultation for appointment ${appointmentId}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const endConsultation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultationsApi.endConsultation(id);
      setCurrentConsultation(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to end consultation ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateNotes = useCallback(async (id: string, notes: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultationsApi.updateNotes(id, notes);
      setCurrentConsultation(prev => prev && prev.id === id ? data : prev);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to update notes for consultation ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateConsultation = useCallback(async (id: string, data: Partial<Consultation>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedData = await consultationsApi.updateConsultation(id, data);
      setCurrentConsultation(updatedData);
      setConsultations(prev => 
        prev.map(item => item.id === id ? updatedData : item)
      );
      return updatedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to update consultation ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    consultations,
    currentConsultation,
    loading,
    error,
    fetchConsultations,
    fetchConsultation,
    startConsultation,
    endConsultation,
    updateNotes,
    updateConsultation
  };
}
