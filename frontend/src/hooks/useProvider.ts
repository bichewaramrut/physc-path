'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/api/client';

/**
 * Provider statistics interface
 * Contains aggregated data about appointments, patients, and revenue
 */
export interface ProviderStats {
  totalAppointments: number;
  completedAppointments: number;
  upcomingAppointments: number;
  cancelledAppointments: number;
  totalPatients: number;
  averageRating: number;
  appointmentsByMonth: Array<{
    month: string;
    count: number;
  }>;
  appointmentsByType: Array<{
    type: string;
    count: number;
  }>;
  appointmentsByStatus: Array<{
    status: string;
    count: number;
  }>;
  revenueData: Array<{
    period: string;
    amount: number;
  }>;
}

export interface Availability {
  id?: string;
  dayOfWeek: number; // 1 = Monday, 7 = Sunday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  clinicId?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
  id?: string;
}

export function useProvider() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Fetch provider statistics
  const fetchProviderStats = useCallback(async (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get(`/api/provider/stats?period=${period}`);
      setStats(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch provider stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch provider availabilities
  const fetchAvailabilities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get('/api/provider/availabilities');
      setAvailabilities(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch availabilities');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update provider availabilities
  const updateAvailabilities = useCallback(async (availabilities: Availability[]) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.put('/api/provider/availabilities', availabilities);
      setAvailabilities(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update availabilities');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a time slot to a specific day
  const addTimeSlot = useCallback(async (dayOfWeek: number, startTime: string, endTime: string, clinicId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.post('/api/provider/timeslots', {
        dayOfWeek,
        startTime,
        endTime,
        clinicId
      });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add time slot');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove a time slot
  const removeTimeSlot = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.delete(`/api/provider/timeslots/${id}`);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove time slot');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get time slots for a specific day
  const getTimeSlots = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get(`/api/provider/timeslots?date=${date}`);
      setTimeSlots(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get time slots');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update appointment fees
  const updateAppointmentFees = useCallback(async (fees: number) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.put('/api/provider/fees', { fees });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment fees');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    stats,
    availabilities,
    timeSlots,
    fetchProviderStats,
    fetchAvailabilities,
    updateAvailabilities,
    addTimeSlot,
    removeTimeSlot,
    getTimeSlots,
    updateAppointmentFees
  };
}
