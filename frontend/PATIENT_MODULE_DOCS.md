# Patient Module Documentation

## Overview
The Patient Module in ThePhysc platform provides a complete set of screens and functionality for patients to manage their healthcare journey, including appointments, medical records, prescriptions, and payments.

## Main Components

### Dashboard
- **Patient Dashboard**: Main entry point for patients showing summary stats, upcoming appointments, and recent notifications.
- **ActiveMedications**: Widget that displays current active medications from prescriptions.

### Appointments
- **Appointments List**: View, filter, and search all appointments.
- **Appointment Details**: View comprehensive information about a specific appointment.
- **Book Appointment**: Multi-step flow to schedule a new appointment with a doctor.
- **Cancel/Reschedule**: Functionality to modify existing appointments.

### Medical Records
- **Medical Records List**: View and search medical history, lab results, and clinical documents.
- **Medical Record Details**: View detailed information about a specific medical record.
- **Upload Documents**: Functionality to upload external medical documents.

### Prescriptions
- **Prescriptions List**: View all prescriptions with filtering and search capabilities.
- **Prescription Details**: Detailed view of medications, dosage, instructions, and related information.
- **Download Functionality**: Download prescriptions as PDF documents.
- **Refill Requests**: Request prescription refills when eligible.

### Payments & Invoices
- **Payments List**: View all payment transactions with filtering and search.
- **Payment Details**: Detailed information about a specific payment.
- **Invoices List**: View all invoices with filtering and search.
- **Invoice Details**: Detailed information about a specific invoice.
- **Make Payment**: Process payments for outstanding invoices.

### Video Consultations
- **Upcoming Consultations**: List of scheduled video consultations.
- **Video Call Interface**: WebRTC-based video consultation interface.
- **Pre-consultation Checklist**: Preparation steps before joining a video consultation.

## Technical Implementation

### Data Hooks
Each module has its own React hook for data management:
- `useAppointments`: Manage appointment-related functionality
- `useMedicalRecords`: Medical records operations
- `usePrescriptions`: Prescription management
- `usePayments`: Payment and invoice operations
- `useConsultations`: Video consultation functionality
- `useFileUpload`: File upload capabilities for documents and images

### API Integration
All patient module screens connect to the backend through API clients:
- `/lib/api/appointments.ts`: Appointments API client
- `/lib/api/medical-records.ts`: Medical records API client
- `/lib/api/prescriptions.ts`: Prescriptions API client
- `/lib/api/payments.ts`: Payments and invoices API client
- `/lib/api/consultations.ts`: Consultation API client
- `/lib/api/files.ts`: File upload API client

### Utility Functions
Utility functions to handle common operations:
- `payment-utils.ts`: Payment and invoice helper functions
- `prescription-utils.ts`: Prescription-related helper functions
- `date-utils.ts`: Date formatting and manipulation

### UI Components
Reusable UI components for consistent interfaces:
- Error and loading states
- Search and filter interfaces
- Status badges and indicators
- Lists and detail views

## Status Management
Each module implements consistent status handling:
- Loading states with appropriate visual feedback
- Error states with retry options
- Empty states with helpful guidance
- Success confirmation for actions

## User Flows

### Appointment Booking Flow
1. Select service/consultation type
2. Select doctor or let system recommend
3. Select date and time slot
4. Enter reason for visit
5. Review and confirm
6. Payment (if required)
7. Confirmation with calendar integration

### Payment Processing Flow
1. Select invoice to pay
2. Choose payment method
3. Enter payment details
4. Process payment
5. Display receipt/confirmation
6. Update payment records

## Future Enhancements
1. Health tracking integration with wearable devices
2. Medication reminders and adherence tracking
3. Telemedicine enhancements with AI-assisted symptom checking
4. Interactive health questionnaires
5. Integrated pharmacy services for prescription fulfillment

## Related Systems
- Authentication and user management
- Doctor/provider systems
- Billing and insurance processing
- Medical record interoperability
- Messaging and notification systems
