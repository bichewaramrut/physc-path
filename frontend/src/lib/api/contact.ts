import apiClient from './client';
import { CONTACT_ENDPOINTS } from './endpoints';

// Types
export interface ContactMessage {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterSignup {
  email: string;
  name?: string;
  interests?: string[];
}

// API methods
export const contactApi = {
  // Send contact form message
  sendMessage: async (messageData: ContactMessage) => {
    try {
      const response = await apiClient.post(CONTACT_ENDPOINTS.SEND_MESSAGE, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error;
    }
  },
  
  // Newsletter signup
  subscribeToNewsletter: async (signupData: NewsletterSignup) => {
    try {
      const response = await apiClient.post(CONTACT_ENDPOINTS.NEWSLETTER_SIGNUP, signupData);
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }
};
