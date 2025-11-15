'use client';

import { useState, useCallback } from 'react';
import { appointmentsApi, Appointment, TimeSlot, Doctor } from '@/lib/api/appointments';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAppointments = useCallback(async (params?: { status?: string; page?: number; size?: number }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsApi.getAppointments(params);
      setAppointments(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchAppointment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsApi.getAppointment(id);
      setCurrentAppointment(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch appointment ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createAppointment = useCallback(async (data: {
    doctorId: string;
    appointmentTime: string;
    duration: number;
    type: string;
    reasonForVisit?: string;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const newAppointment = await appointmentsApi.createAppointment(data);
      setAppointments(prev => [...prev, newAppointment]);
      setCurrentAppointment(newAppointment);
      return newAppointment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateAppointment = useCallback(async (id: string, data: Partial<Appointment>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAppointment = await appointmentsApi.updateAppointment(id, data);
      setAppointments(prev => 
        prev.map(item => item.id === id ? updatedAppointment : item)
      );
      setCurrentAppointment(updatedAppointment);
      return updatedAppointment;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to update appointment ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const cancelAppointment = useCallback(async (id: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAppointment = await appointmentsApi.cancelAppointment(id, reason);
      setAppointments(prev => 
        prev.map(item => item.id === id ? updatedAppointment : item)
      );
      setCurrentAppointment(updatedAppointment);
      return updatedAppointment;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to cancel appointment ${id}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchDoctorAvailability = useCallback(async (doctorId: string, date: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsApi.getDoctorAvailability(doctorId, date);
      setAvailableTimeSlots(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch availability for doctor ${doctorId}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchAvailableDoctors = useCallback(async (params?: { specialization?: string; date?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsApi.getAvailableDoctors(params);
      setDoctors(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch available doctors');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    appointments,
    currentAppointment,
    availableTimeSlots,
    doctors,
    loading,
    error,
    fetchAppointments,
    fetchAppointment,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    fetchDoctorAvailability,
    fetchAvailableDoctors
  };
}
