# Prescriptions Module Documentation

## Overview
The prescriptions module allows patients to view, download, and manage their prescriptions. It provides a comprehensive interface for tracking medication details, refill status, and related information.

## Features
- View a list of all prescriptions
- Filter prescriptions by status (Active, Completed, Expired, Cancelled)
- Search prescriptions by doctor name or medication name
- View detailed information about each prescription including:
  - Medication details (name, dosage, instructions)
  - Doctor information
  - Issue and expiry dates
  - Diagnosis and additional notes
- Download prescriptions as PDF documents
- View related appointment information
- Manage prescription refills

## Components

### Prescriptions List Page (`/dashboard/prescriptions/page.tsx`)
- Displays all prescriptions for the current user
- Includes search and filter functionality
- Shows key information for each prescription in card format
- Provides links to detailed prescription view

### Prescription Detail Page (`/dashboard/prescriptions/[prescriptionId]/page.tsx`)
- Shows comprehensive information about a specific prescription
- Displays all medications with detailed instructions
- Provides download functionality for PDF version
- Shows related appointment information when available
- Includes refill management options

## Technical Implementation

### Data Hooks
The prescriptions functionality is implemented using the `usePrescriptions` hook (`/hooks/usePrescriptions.ts`), which provides:
- Fetching prescription lists and individual prescriptions
- Creating and updating prescriptions
- Downloading prescription PDFs

### API Integration
Prescription data is fetched from the backend API using:
- List endpoint: `GET /api/v1/prescriptions`
- Detail endpoint: `GET /api/v1/prescriptions/{id}`
- PDF download: `GET /api/v1/prescriptions/{id}/pdf`

### Type Definitions
The prescription data model includes:
- Prescription: Main prescription information including doctor, patient, dates, and status
- Medication: Details about each medication including name, dosage, frequency, and instructions

### User Interface Components
The module uses several UI components:
- Cards for displaying prescription information
- Badges for showing prescription status
- Search and filter inputs for narrowing results
- Modal dialogs for actions like requesting refills

## Status Management
Prescriptions can have the following statuses:
- **Active**: Currently valid prescription
- **Completed**: Prescription that has been fully used
- **Expired**: Prescription that has passed its expiry date
- **Cancelled**: Prescription that was cancelled by the doctor or patient

## Future Enhancements
1. Integration with pharmacy services for direct prescription fulfillment
2. Medication reminder system
3. Prescription history visualization
4. Automated refill requests
5. E-prescription integration with local pharmacies

## Related Components
- Appointment module: Prescriptions are often created during appointments
- Medical records: Prescriptions form part of the patient's medical history
- Payment system: Some medications may require payment processing
