// API endpoint constants

// Base URLs
const API_VERSION = 'v1';
const BASE_URL = `/api/${API_VERSION}`;

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
};

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${BASE_URL}/users/profile`,
  CHANGE_PASSWORD: `${BASE_URL}/users/change-password`,
};

// Doctor endpoints
export const DOCTOR_ENDPOINTS = {
  LIST: `${BASE_URL}/doctors`,
  DETAILS: (id: string) => `${BASE_URL}/doctors/${id}`,
  AVAILABILITY: (id: string) => `${BASE_URL}/doctors/${id}/availability`,
};

// Appointment endpoints
export const APPOINTMENT_ENDPOINTS = {
  LIST: `${BASE_URL}/appointments`,
  DETAILS: (id: string) => `${BASE_URL}/appointments/${id}`,
  CREATE: `${BASE_URL}/appointments`,
  UPDATE: (id: string) => `${BASE_URL}/appointments/${id}`,
  CANCEL: (id: string) => `${BASE_URL}/appointments/${id}/cancel`,
};

// Consultation endpoints
export const CONSULTATION_ENDPOINTS = {
  LIST: `${BASE_URL}/consultations`,
  DETAILS: (id: string) => `${BASE_URL}/consultations/${id}`,
  START: (appointmentId: string) => `${BASE_URL}/consultations/appointments/${appointmentId}/start`,
  END: (id: string) => `${BASE_URL}/consultations/${id}/end`,
  NOTES: (id: string) => `${BASE_URL}/consultations/${id}/notes`,
};

// Video endpoints
export const VIDEO_ENDPOINTS = {
  SESSION: (appointmentId: string) => `${BASE_URL}/video/sessions/appointment/${appointmentId}`,
  TOKEN: (sessionId: string) => `${BASE_URL}/video/sessions/${sessionId}/token`,
  CONFIG: `${BASE_URL}/video/config`,
  SIGNALING: `${BASE_URL}/video/signaling`,
};

// Medical records endpoints
export const MEDICAL_RECORD_ENDPOINTS = {
  LIST: `${BASE_URL}/medical-records`,
  DETAILS: (id: string) => `${BASE_URL}/medical-records/${id}`,
  CREATE: `${BASE_URL}/medical-records`,
  UPDATE: (id: string) => `${BASE_URL}/medical-records/${id}`,
  DELETE: (id: string) => `${BASE_URL}/medical-records/${id}`,
};

// Prescription endpoints
export const PRESCRIPTION_ENDPOINTS = {
  LIST: `${BASE_URL}/prescriptions`,
  DETAILS: (id: string) => `${BASE_URL}/prescriptions/${id}`,
  CREATE: `${BASE_URL}/prescriptions`,
  UPDATE: (id: string) => `${BASE_URL}/prescriptions/${id}`,
};

// Content endpoints
export const CONTENT_ENDPOINTS = {
  BLOG_POSTS: `${BASE_URL}/content/blog`,
  BLOG_POST: (slug: string) => `${BASE_URL}/content/blog/${slug}`,
  SERVICES: `${BASE_URL}/content/services`,
  SERVICE: (slug: string) => `${BASE_URL}/content/services/${slug}`,
  FAQS: `${BASE_URL}/content/faqs`,
  TESTIMONIALS: `${BASE_URL}/content/testimonials`,
};

// Contact endpoints
export const CONTACT_ENDPOINTS = {
  SEND_MESSAGE: `${BASE_URL}/contact/message`,
  NEWSLETTER_SIGNUP: `${BASE_URL}/contact/newsletter`,
};
