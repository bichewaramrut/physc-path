# Patient Module Screens - The Physc

This document provides an overview of all the patient module screens implemented for The Physc healthcare platform.

## Overview of Patient Screens

The patient module contains several key screens that allow patients to:
- Explore doctors and clinics
- Book appointments
- View and manage appointments
- Access medical records
- View and download prescriptions
- Manage payments and invoices

## Screen Structure

### Dashboard
- `/dashboard` - Main patient dashboard showing overview of appointments, records, and prescriptions

### Find Providers
- `/dashboard/find-doctors` - Explore and search for doctors
- `/dashboard/find-clinics` - Explore and search for clinics
- `/dashboard/clinics/[clinicId]` - View detailed information about a specific clinic

### Appointments
- `/dashboard/book-appointment/[doctorId]` - Book an appointment with a specific doctor
- `/dashboard/appointments` - View all appointments (upcoming, past, cancelled)
- `/dashboard/appointments/[appointmentId]` - View details of a specific appointment

### Medical Records
- `/dashboard/medical-records` - View all medical records
- `/dashboard/medical-records/[recordId]` - View details of a specific medical record

### Prescriptions
- `/dashboard/prescriptions` - View all prescriptions
- `/dashboard/prescriptions/[prescriptionId]` - View details of a specific prescription and download it

### Payments & Invoices
- `/dashboard/payments` - View all payments and invoices
- `/dashboard/payments/[paymentId]` - View details of a specific payment
- `/dashboard/invoices/[invoiceId]` - View details of a specific invoice
- `/dashboard/invoices/[invoiceId]/pay` - Pay for a specific invoice

## Data Flow

Each screen connects to a corresponding hook that manages the data flow:
- `useAppointments.ts` - Manages appointment data and operations
- `useMedicalRecords.ts` - Manages medical records
- `usePrescriptions.ts` - Manages prescription data and operations
- `usePayments.ts` - Manages payments and invoices
- `useProvider.ts` - Manages doctor and clinic data

## Implementation Notes

### Current State
- All screens have been implemented with complete UI/UX
- Screens currently use mock data until connected to the backend
- Payment processing is simulated and needs to be connected to a real payment gateway

### Pending Tasks
- Connect all hooks to actual backend API endpoints
- Implement real-time notifications for appointment reminders
- Add pagination for lists with many items
- Implement proper error handling for all API calls
- Add loading states for better user experience
- Implement unit and integration tests

## How to Test

1. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

2. Navigate to `/login` and sign in as a patient
3. Explore the dashboard and navigate to different sections
4. Test the appointment booking flow by finding a doctor and booking an appointment
5. Test the payments flow by viewing an invoice and attempting to pay it

## Future Enhancements

- Integration with telemedicine for virtual consultations
- Patient profile customization
- Medical history upload functionality
- Integration with pharmacy services for prescription fulfillment
- Mobile app synchronization
- Calendar integration for appointment reminders

## Dependencies

The patient module screens rely on the following UI components and libraries:
- Next.js for routing and page structure
- React hooks for state management
- Tailwind CSS for styling
- Lucide React for icons
- Radix UI for accessible UI components
- date-fns for date formatting
