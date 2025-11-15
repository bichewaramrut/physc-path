'use client';

import { useState, useCallback } from 'react';
import { contactApi, ContactMessage, NewsletterSignup } from '@/lib/api/contact';

export function useContactForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const sendMessage = useCallback(async (messageData: ContactMessage) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await contactApi.sendMessage(messageData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const subscribeToNewsletter = useCallback(async (signupData: NewsletterSignup) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await contactApi.subscribeToNewsletter(signupData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to newsletter');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);
  
  return {
    loading,
    success,
    error,
    sendMessage,
    subscribeToNewsletter,
    resetState
  };
}
