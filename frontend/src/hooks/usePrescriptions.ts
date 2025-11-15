'use client';

import { useState, useCallback } from 'react';
import { prescriptionsApi, Prescription } from '@/lib/api/prescriptions';

export function usePrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPrescriptions = useCallback(async (params?: { status?: string; page?: number; size?: number }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await prescriptionsApi.getPrescriptions(params);
      setPrescriptions(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prescriptions');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchPrescription = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await prescriptionsApi.getPrescription(id);
      setCurrentPrescription(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch prescription ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createPrescription = useCallback(async (data: Omit<Prescription, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newPrescription = await prescriptionsApi.createPrescription(data);
      setPrescriptions(prev => [...prev, newPrescription]);
      setCurrentPrescription(newPrescription);
      return newPrescription;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create prescription');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updatePrescription = useCallback(async (id: string, data: Partial<Prescription>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPrescription = await prescriptionsApi.updatePrescription(id, data);
      setPrescriptions(prev => 
        prev.map(item => item.id === id ? updatedPrescription : item)
      );
      setCurrentPrescription(updatedPrescription);
      return updatedPrescription;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to update prescription ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const downloadPrescription = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await prescriptionsApi.downloadPrescription(id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and click it to download the file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to download prescription ${id}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    prescriptions,
    currentPrescription,
    loading,
    error,
    fetchPrescriptions,
    fetchPrescription,
    createPrescription,
    updatePrescription,
    downloadPrescription
  };
}
