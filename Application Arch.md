# The Physc - Telemedicine Application Architecture

## Project Overview
The Physc is a comprehensive telemedicine platform designed for psychiatrist and psychologist consultations, featuring video consultations, appointment scheduling, prescription management, and mental health resources with HIPAA-compliant security.

## Technology Stack

### Backend
- **Framework**: Java Spring Boot LTS - DONE
- **Workflow Engine**: Camunda Platform 7 - NOT IMPLEMENTED
- **Data Access**: Spring Data JPA - DONE
- **Security**: Spring Security with JWT - DONE
- **Build Tool**: Maven - DONE
- **Code Generation**: Lombok - DONE
- **Application Server**: Apache Tomcat 9+ - DONE

### Frontend
- **Framework**: React.js LTS with Next.js LTS
- **Styling**: Tailwind CSS
- **State Management**: Context(primery) -  optional (Redux Toolkit / Zustand)
- **UI Components**: Radix UI
- **Runtime**: Node.js 18+
- **ICON Library**: https://lucide.dev/

### Database
- **Primary Database**: PostgreSQL 15+
- **Caching**: Redis (optional)
- **File Storage**: AWS S3 / Azure Blob Storage

### Video Consultation
- **Primary**: WebRTC (peer-to-peer) - PARTIAL
- **Fallback**: Twilio Video API - NOT IMPLEMENTED
- **Alternative**: Jitsi Meet integration - NOT IMPLEMENTED

### Security & Compliance
- **Authentication**: OAuth2 with JWT - DONE
- **Encryption**: SSL/TLS 1.3 - PARTIAL
- **Compliance**: HIPAA-compliant frameworks - PARTIAL
- **API Security**: Spring Security + OAuth2 Resource Server - DONE

## Project Structure

```
the-physc/
├── backend/                              # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── thephysc/
│   │   │   │           ├── ThePhyscApplication.java
│   │   │   │           ├── config/                    # Configuration Classes
│   │   │   │           │   ├── SecurityConfig.java
│   │   │   │           │   ├── DatabaseConfig.java
│   │   │   │           │   ├── CamundaConfig.java
│   │   │   │           │   ├── JwtConfig.java
│   │   │   │           │   └── WebConfig.java
│   │   │   │           ├── core/                      # Core Domain Layer
│   │   │   │           │   ├── entities/              # JPA Entities
│   │   │   │           │   │   ├── User.java
│   │   │   │           │   │   ├── Doctor.java
│   │   │   │           │   │   ├── Patient.java
│   │   │   │           │   │   ├── Appointment.java
│   │   │   │           │   │   ├── Consultation.java
│   │   │   │           │   │   ├── Prescription.java
│   │   │   │           │   │   ├── MedicalRecord.java
│   │   │   │           │   │   ├── VideoSession.java
│   │   │   │           │   │   └── Payment.java
│   │   │   │           │   ├── repositories/          # Data Access Layer
│   │   │   │           │   │   ├── UserRepository.java
│   │   │   │           │   │   ├── DoctorRepository.java
│   │   │   │           │   │   ├── PatientRepository.java
│   │   │   │           │   │   ├── AppointmentRepository.java
│   │   │   │           │   │   ├── ConsultationRepository.java
│   │   │   │           │   │   ├── PrescriptionRepository.java
│   │   │   │           │   │   ├── MedicalRecordRepository.java
│   │   │   │           │   │   └── VideoSessionRepository.java
│   │   │   │           │   └── enums/                 # Domain Enums
│   │   │   │           │       ├── UserRole.java
│   │   │   │           │       ├── AppointmentStatus.java
│   │   │   │           │       ├── ConsultationStatus.java
│   │   │   │           │       └── PaymentStatus.java
│   │   │   │           ├── modules/                   # Feature Modules (Atomic Components)
│   │   │   │           │   ├── auth/                  # Authentication Module - DONE
│   │   │   │           │   │   ├── controllers/
│   │   │   │           │   │   │   ├── AuthController.java - DONE
│   │   │   │           │   │   │   └── OAuth2Controller.java - NOT IMPLEMENTED
│   │   │   │           │   │   ├── services/
│   │   │   │           │   │   │   ├── AuthService.java - DONE
│   │   │   │           │   │   │   ├── JwtService.java - DONE (as JwtTokenProvider)
│   │   │   │           │   │   │   └── OAuth2Service.java - NOT IMPLEMENTED
│   │   │   │           │   │   ├── dto/
│   │   │   │           │   │   │   ├── LoginRequest.java - DONE
│   │   │   │           │   │   │   ├── LoginResponse.java - DONE
│   │   │   │           │   │   │   ├── RegisterRequest.java - DONE
│   │   │   │           │   │   │   ├── RefreshTokenRequest.java - DONE
│   │   │   │           │   │   │   └── TokenResponse.java - DONE
│   │   │   │           │   │   └── security/
│   │   │   │           │   │       ├── JwtAuthenticationFilter.java - DONE
│   │   │   │           │   │       ├── JwtTokenProvider.java - DONE
│   │   │   │           │   │       └── CustomUserDetailsService.java - DONE
│   │   │   │           │   ├── users/                 # User Management Module
│   │   │   │           │   │   ├── controllers/
│   │   │   │           │   │   │   ├── UserController.java
│   │   │   │           │   │   │   ├── DoctorController.java
│   │   │   │           │   │   │   └── PatientController.java
│   │   │   │           │   │   ├── services/
│   │   │   │           │   │   │   ├── UserService.java
│   │   │   │           │   │   │   ├── DoctorService.java
│   │   │   │           │   │   │   └── PatientService.java
│   │   │   │           │   │   └── dto/
│   │   │   │           │   │       ├── UserDto.java
│   │   │   │           │   │       ├── DoctorDto.java
│   │   │   │           │   │       ├── PatientDto.java
│   │   │   │           │   │       └── UserProfileDto.java
│   │   │   │           │   ├── appointments/          # Appointment Management Module - DONE
│   │   │   │           │   │   ├── controllers/
│   │   │   │           │   │   │   └── AppointmentController.java - DONE
│   │   │   │           │   │   ├── services/
│   │   │   │           │   │   │   ├── AppointmentService.java - DONE
│   │   │   │           │   │   │   ├── SchedulingService.java - NOT IMPLEMENTED
│   │   │   │           │   │   │   └── AvailabilityService.java - DONE
│   │   │   │           │   │   ├── dto/
│   │   │   │           │   │   │   ├── AppointmentDto.java - DONE
│   │   │   │           │   │   │   ├── CreateAppointmentRequest.java - DONE
│   │   │   │           │   │   │   ├── AvailabilityDto.java - DONE
│   │   │   │           │   │   │   └── TimeSlotDto.java - DONE
│   │   │   │           │   │   └── workflow/
│   │   │   │           │   │       ├── AppointmentWorkflow.java - NOT IMPLEMENTED
│   │   │   │           │   │       └── AppointmentDelegate.java - NOT IMPLEMENTED
│   │   │   │           │   ├── consultations/         # Consultation Module - DONE
│   │   │   │           │   │   ├── controllers/
│   │   │   │           │   │   │   └── ConsultationController.java - DONE
│   │   │   │           │   │   ├── services/
│   │   │   │           │   │   │   ├── ConsultationService.java - DONE
│   │   │   │           │   │   │   ├── VideoSessionService.java - MOVED TO VIDEO MODULE
│   │   │   │           │   │   │   └── RecordingService.java - NOT IMPLEMENTED
│   │   │   │           │   │   └── dto/
│   │   │   │           │   │       ├── ConsultationDto.java - DONE
│   │   │   │           │   │       ├── ConsultationNotes.java - DONE
│   │   │   │           │   │       └── StartConsultationRequest.java - DONE
│   │   │   │           │   ├── prescriptions/         # Prescription Module
│   │   │   │           │   │   ├── controllers/
│   │   │   │           │   │   │   └── PrescriptionController.java
│   │   │   │           │   │   ├── services/
│   │   │   │           │   │   │   ├── PrescriptionService.java
│   │   │   │           │   │   │   └── MedicationService.java
│   │   │   │           │   │   └── dto/
│   │   │   │           │   │       ├── PrescriptionDto.java
│   │   │   │           │   │       ├── MedicationDto.java
│   │   │   │           │   │       └── DosageDto.java
│   │   │   │           │   ├── medical-records/       # Medical Records Module
│   │   │   │           │   │   ├── controllers/
│   │   │   │           │   │   │   └── MedicalRecordController.java
│   │   │   │           │   │   ├── services/
│   │   │   │           │   │   │   ├── MedicalRecordService.java
│   │   │   │           │   │   │   └── DocumentService.java
│   │   │   │           │   │   └── dto/
│   │   │   │           │   │       ├── MedicalRecordDto.java
│   │   │   │           │   │       └── DocumentDto.java
│   │   │   │           │   ├── video/                 # Video Consultation Module - PARTIAL
│   │   │   │           │   │   ├── controllers/
│   │   │   │           │   │   │   └── VideoSessionController.java - DONE
│   │   │   │           │   │   ├── services/
│   │   │   │           │   │   │   ├── VideoSessionService.java - DONE
│   │   │   │           │   │   │   ├── WebRTCService.java - PARTIAL (Frontend hook implemented)
│   │   │   │           │   │   │   ├── TwilioService.java - NOT IMPLEMENTED
│   │   │   │           │   │   │   └── JitsiService.java - NOT IMPLEMENTED
│   │   │   │           │   │   ├── websocket/
│   │   │   │           │   │   │   └── WebRTCSignalingHandler.java - PARTIAL
│   │   │   │           │   │   └── dto/
│   │   │   │           │   │       ├── VideoSessionDto.java - DONE
│   │   │   │           │   │       ├── VideoTokenResponse.java - DONE
│   │   │   │           │   │       ├── WebRTCConfigDto.java - PARTIAL
│   │   │   │           │   │       └── SignalingMessageDto.java - PARTIAL
│   │   │   │           │   ├── payments/              # Payment Module
│   │   │   │           │   │   ├── controllers/
│   │   │   │           │   │   │   └── PaymentController.java
│   │   │   │           │   │   ├── services/
│   │   │   │           │   │   │   ├── PaymentService.java
│   │   │   │           │   │   │   └── BillingService.java
│   │   │   │           │   │   └── dto/
│   │   │   │           │   │       ├── PaymentDto.java
│   │   │   │           │   │       └── InvoiceDto.java
│   │   │   │           │   ├── notifications/         # Notification Module
│   │   │   │           │   │   ├── controllers/
│   │   │   │           │   │   │   └── NotificationController.java
│   │   │   │           │   │   ├── services/
│   │   │   │           │   │   │   ├── NotificationService.java
│   │   │   │           │   │   │   ├── EmailService.java
│   │   │   │           │   │   │   └── SMSService.java
│   │   │   │           │   │   └── dto/
│   │   │   │           │   │       └── NotificationDto.java
│   │   │   │           │   └── content/               # Content Management Module
│   │   │   │           │       ├── controllers/
│   │   │   │           │       │   ├── BlogController.java
│   │   │   │           │       │   └── ResourceController.java
│   │   │   │           │       ├── services/
│   │   │   │           │       │   ├── BlogService.java
│   │   │   │           │       │   └── ResourceService.java
│   │   │   │           │       └── dto/
│   │   │   │           │           ├── BlogPostDto.java
│   │   │   │           │           └── ResourceDto.java
│   │   │   │           ├── shared/                    # Shared Components
│   │   │   │           │   ├── exceptions/            # Global Exception Handling
│   │   │   │           │   │   ├── GlobalExceptionHandler.java
│   │   │   │           │   │   ├── ResourceNotFoundException.java
│   │   │   │           │   │   ├── ValidationException.java
│   │   │   │           │   │   └── UnauthorizedException.java
│   │   │   │           │   ├── utils/                 # Utility Classes
│   │   │   │           │   │   ├── DateUtils.java
│   │   │   │           │   │   ├── EncryptionUtils.java
│   │   │   │           │   │   ├── ValidationUtils.java
│   │   │   │           │   │   └── FileUtils.java
│   │   │   │           │   ├── constants/             # Application Constants
│   │   │   │           │   │   ├── ApiEndpoints.java
│   │   │   │           │   │   ├── ErrorMessages.java
│   │   │   │           │   │   └── SecurityConstants.java
│   │   │   │           │   └── dto/                   # Base DTOs
│   │   │   │           │       ├── BaseDto.java
│   │   │   │           │       ├── ApiResponse.java
│   │   │   │           │       ├── PageResponse.java
│   │   │   │           │       └── ErrorResponse.java
│   │   │   │           └── integration/              # External Integrations
│   │   │   │               ├── twilio/
│   │   │   │               │   └── TwilioConfiguration.java
│   │   │   │               ├── aws/
│   │   │   │               │   └── S3Configuration.java
│   │   │   │               └── oauth/
│   │   │   │                   ├── GoogleOAuth2Config.java
│   │   │   │                   └── FacebookOAuth2Config.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-dev.yml
│   │   │       ├── application-prod.yml
│   │   │       ├── db/
│   │   │       │   └── migration/               # Flyway migrations
│   │   │       │       ├── V1__Create_Users_Table.sql
│   │   │       │       ├── V2__Create_Doctors_Table.sql
│   │   │       │       ├── V3__Create_Patients_Table.sql
│   │   │       │       ├── V4__Create_Appointments_Table.sql
│   │   │       │       └── V5__Create_Consultations_Table.sql
│   │   │       └── processes/                   # Camunda BPMN files
│   │   │           ├── appointment-booking.bpmn
│   │   │           ├── consultation-workflow.bpmn
│   │   │           └── payment-processing.bpmn
│   │   └── test/
│   │       └── java/
│   │           └── com/
│   │               └── thephysc/
│   │                   ├── integration/         # Integration tests
│   │                   ├── unit/                # Unit tests
│   │                   └── TestConfiguration.java
│   ├── pom.xml                                  # Maven configuration
│   └── Dockerfile
│
├── frontend/                                    # Next.js Frontend
│   ├── src/
│   │   ├── app/                                # App Router (Next.js 13+)
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx                      # Root layout
│   │   │   ├── page.tsx                        # Home page
│   │   │   ├── loading.tsx                     # Global loading UI
│   │   │   ├── error.tsx                       # Global error UI
│   │   │   ├── not-found.tsx                   # 404 page
│   │   │   ├── (auth)/                         # Auth route group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx                # DONE - Basic login UI
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx                # NOT IMPLEMENTED (Using signup instead)
│   │   │   │   └── layout.tsx                  # NOT IMPLEMENTED
│   │   │   ├── (dashboard)/                    # Dashboard route group
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── page.tsx                # DONE - Enhanced dashboard UI with prescription section
│   │   │   │   │   ├── appointments/
│   │   │   │   │   │   ├── page.tsx            # DONE - Appointments list UI
│   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   └── page.tsx        # NOT IMPLEMENTED
│   │   │   │   │   │   └── new/
│   │   │   │   │   │       └── page.tsx        # DONE - New appointment form
│   │   │   │   │   ├── consultations/
│   │   │   │   │   │   ├── page.tsx            # NOT IMPLEMENTED
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx        # NOT IMPLEMENTED
│   │   │   │   │   ├── medical-records/
│   │   │   │   │   │   ├── page.tsx            # DONE - Medical records list UI
│   │   │   │   │   │   └── [id]/
│   │   │   │   │   │       └── page.tsx        # NOT IMPLEMENTED
│   │   │   │   │   ├── prescriptions/
│   │   │   │   │   │   └── page.tsx            # NOT IMPLEMENTED
│   │   │   │   │   └── profile/
│   │   │   │   │       └── page.tsx            # NOT IMPLEMENTED
│   │   │   │   └── layout.tsx                  # DONE - Dashboard layout
│   │   │   ├── (public)/                       # Public route group
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx                # DONE - Full about page
│   │   │   │   ├── services/
│   │   │   │   │   └── page.tsx                # DONE - Services listing page
│   │   │   │   ├── team/
│   │   │   │   │   └── page.tsx                # DONE - Team listing page
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx                # DONE - Blog listing page
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx            # DONE - Blog post detail page
│   │   │   │   ├── contact/
│   │   │   │   │   └── page.tsx                # DONE - Contact page with form
│   │   │   │   └── faqs/
│   │   │   │       └── page.tsx                # DONE - FAQ page with categories
│   │   │   ├── video-call/
│   │   │   │   ├── [roomId]/
│   │   │   │   │   └── page.tsx                # DONE - Video call UI with WebRTC integration
│   │   │   │   └── layout.tsx                  # NOT IMPLEMENTED
│   │   │   └── api/                            # API Routes (Next.js) - NOT IMPLEMENTED
│   │   │       ├── auth/
│   │   │       │   └── route.ts
│   │   │       ├── webhooks/
│   │   │       │   └── route.ts
│   │   │       └── health/
│   │   │           └── route.ts
│   │   ├── components/                         # Atomic Design System
│   │   │   ├── atoms/                          # Basic building blocks - PARTIAL
│   │   │   │   ├── Button/                     # DONE (Using ui/button.tsx instead)
│   │   │   │   ├── Input/
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   ├── Input.module.css
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Label/
│   │   │   │   │   ├── Label.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Avatar/
│   │   │   │   │   ├── Avatar.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Badge/
│   │   │   │   │   ├── Badge.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Spinner/
│   │   │   │   │   ├── Spinner.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Icon/
│   │   │   │   │   ├── Icon.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── Typography/
│   │   │   │       ├── Typography.tsx
│   │   │   │       └── index.ts
│   │   │   ├── molecules/                      # Combinations of atoms
│   │   │   │   ├── FormField/
│   │   │   │   │   ├── FormField.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── SearchBox/
│   │   │   │   │   ├── SearchBox.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── UserCard/
│   │   │   │   │   ├── UserCard.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── AppointmentCard/
│   │   │   │   │   ├── AppointmentCard.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── VideoControls/
│   │   │   │   │   ├── VideoControls.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── DateTimePicker/
│   │   │   │   │   ├── DateTimePicker.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── DoctorCard/
│   │   │   │   │   ├── DoctorCard.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── NotificationItem/
│   │   │   │       ├── NotificationItem.tsx
│   │   │   │       └── index.ts
│   │   │   ├── organisms/                      # Complex UI components - PARTIAL
│   │   │   │   ├── Header.tsx                  # DONE
│   │   │   │   ├── Footer.tsx                  # DONE
│   │   │   │   ├── HeroSection.tsx             # DONE
│   │   │   │   ├── AboutSection.tsx            # DONE
│   │   │   │   ├── ServicesSection.tsx         # DONE
│   │   │   │   ├── TestimonialsSection.tsx     # DONE
│   │   │   │   ├── BlogSection.tsx             # DONE
│   │   │   │   ├── ContactSection.tsx          # DONE
│   │   │   │   ├── FAQsSection.tsx             # DONE
│   │   │   │   ├── TeamSection.tsx             # DONE
│   │   │   │   ├── CTASection.tsx              # DONE
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Footer/
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Navigation/
│   │   │   │   │   ├── Navigation.tsx
│   │   │   │   │   ├── MobileNavigation.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── HeroSection/
│   │   │   │   │   ├── HeroSection.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ServicesGrid/
│   │   │   │   │   ├── ServicesGrid.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── TestimonialsCarousel/
│   │   │   │   │   ├── TestimonialsCarousel.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── AppointmentForm/
│   │   │   │   │   ├── AppointmentForm.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── VideoCallInterface/
│   │   │   │   │   ├── VideoCallInterface.tsx
│   │   │   │   │   ├── VideoCallControls.tsx
│   │   │   │   │   ├── ParticipantGrid.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── DashboardSidebar/
│   │   │   │   │   ├── DashboardSidebar.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── AppointmentList/
│   │   │   │   │   ├── AppointmentList.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── DoctorsList/
│   │   │   │   │   ├── DoctorsList.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── PrescriptionForm/
│   │   │   │   │   ├── PrescriptionForm.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── MedicalRecordViewer/
│   │   │   │   │   ├── MedicalRecordViewer.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── BlogList/
│   │   │   │       ├── BlogList.tsx
│   │   │   │       └── index.ts
│   │   │   ├── templates/                      # Page-level components
│   │   │   │   ├── PublicPageTemplate/
│   │   │   │   │   ├── PublicPageTemplate.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── DashboardTemplate/
│   │   │   │   │   ├── DashboardTemplate.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── AuthTemplate/
│   │   │   │   │   ├── AuthTemplate.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── VideoCallTemplate/
│   │   │   │       ├── VideoCallTemplate.tsx
│   │   │   │       └── index.ts
│   │   │   └── providers/                      # Context providers
│   │   │       ├── AuthProvider.tsx
│   │   │       ├── ThemeProvider.tsx
│   │   │       ├── VideoProvider.tsx
│   │   │       └── NotificationProvider.tsx
│   │   ├── hooks/                              # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useApi.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useWebRTC.ts                    # DONE - WebRTC hook for video consultations
│   │   │   ├── useSocket.ts
│   │   │   ├── useAppointments.ts
│   │   │   ├── useDoctors.ts
│   │   │   ├── useNotifications.ts
│   │   │   ├── useVideoCall.ts
│   │   │   ├── useContent.ts                   # DONE - Hooks for blog, services, testimonials & FAQs
│   │   │   └── useContact.ts                   # DONE - Hooks for contact form & newsletter
│   │   ├── lib/                                # Utility libraries
│   │   │   ├── api/
│   │   │   │   ├── client.ts                   # DONE - Axios configuration
│   │   │   │   ├── endpoints.ts                # DONE - API endpoints
│   │   │   │   ├── auth.ts                     # Auth API methods
│   │   │   │   ├── appointments.ts             # Appointment API methods
│   │   │   │   ├── doctors.ts                  # Doctor API methods
│   │   │   │   ├── patients.ts                 # Patient API methods
│   │   │   │   ├── consultations.ts            # Consultation API methods
│   │   │   │   ├── prescriptions.ts            # Prescription API methods
│   │   │   │   ├── video.ts                    # Video API methods
│   │   │   │   ├── content.ts                  # DONE - Content API methods
│   │   │   │   └── contact.ts                  # DONE - Contact form API methods
│   │   │   ├── utils/
│   │   │   │   ├── date.ts                     # Date utilities
│   │   │   │   ├── validation.ts               # Form validation
│   │   │   │   ├── format.ts                   # Data formatting
│   │   │   │   ├── storage.ts                  # Local storage utilities
│   │   │   │   ├── encryption.ts               # Client-side encryption
│   │   │   │   └── constants.ts                # Application constants
│   │   │   ├── auth/
│   │   │   │   ├── config.ts                   # Auth configuration
│   │   │   │   ├── tokens.ts                   # Token management
│   │   │   │   └── oauth.ts                    # OAuth utilities
│   │   │   ├── video/
│   │   │   │   ├── webrtc.ts                   # WebRTC utilities
│   │   │   │   ├── twilio.ts                   # Twilio integration
│   │   │   │   └── jitsi.ts                    # Jitsi integration
│   │   │   └── schema/
│   │   │       ├── auth.ts                     # Auth validation schemas
│   │   │       ├── appointment.ts              # Appointment schemas
│   │   │       ├── user.ts                     # User schemas
│   │   │       └── medical.ts                  # Medical data schemas
│   │   ├── store/                              # State management
│   │   │   ├── index.ts                        # Store configuration
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── appointmentSlice.ts
│   │   │   │   ├── doctorSlice.ts
│   │   │   │   ├── patientSlice.ts
│   │   │   │   ├── videoSlice.ts
│   │   │   │   ├── notificationSlice.ts
│   │   │   │   └── uiSlice.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts
│   │   │   │   └── apiMiddleware.ts
│   │   │   └── selectors/
│   │   │       ├── authSelectors.ts
│   │   │       ├── appointmentSelectors.ts
│   │   │       └── doctorSelectors.ts
│   │   ├── styles/                             # Global styles
│   │   │   ├── globals.css
│   │   │   ├── components.css
│   │   │   ├── variables.css
│   │   │   └── utilities.css
│   │   └── types/                              # TypeScript type definitions
│   │       ├── auth.ts
│   │       ├── user.ts
│   │       ├── appointment.ts
│   │       ├── doctor.ts
│   │       ├── patient.ts
│   │       ├── consultation.ts
│   │       ├── prescription.ts
│   │       ├── video.ts
│   │       ├── api.ts
│   │       └── common.ts
│   ├── public/                                 # Static assets
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── hero/
│   │   │   ├── doctors/
│   │   │   ├── services/
│   │   │   └── icons/
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── next.config.js                          # Next.js configuration
│   ├── tailwind.config.js                      # Tailwind CSS configuration
│   ├── tsconfig.json                           # TypeScript configuration
│   ├── package.json
│   └── Dockerfile
│
├── database/                                   # Database scripts and configurations
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_video_sessions.sql
│   │   ├── 003_add_prescriptions.sql
│   │   └── 004_add_medical_records.sql
│   ├── seeds/
│   │   ├── development/
│   │   │   ├── users.sql
│   │   │   ├── doctors.sql
│   │   │   └── specializations.sql
│   │   └── production/
│   │       └── initial_data.sql
│   └── docker-compose.yml                      # PostgreSQL setup
│
├── deployment/                                 # Deployment configurations
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   ├── docker-compose.dev.yml
│   │   └── docker-compose.prod.yml
│   ├── kubernetes/
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── database-deployment.yaml
│   │   ├── ingress.yaml
│   │   └── configmap.yaml
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── ssl/
│   └── scripts/
│       ├── deploy.sh
│       ├── backup.sh
│       └── restore.sh
│
├── docs/                                       # Documentation
│   ├── API.md                                  # API documentation
│   ├── DEPLOYMENT.md                           # Deployment guide
│   ├── DEVELOPMENT.md                          # Development setup
│   ├── SECURITY.md                             # Security guidelines
│   ├── TESTING.md                              # Testing strategies
│   └── USER_GUIDE.md                           # User manual
│
├── tests/                                      # End-to-end and integration tests
│   ├── e2e/
│   │   ├── auth.spec.ts
│   │   ├── appointments.spec.ts
│   │   ├── video-calls.spec.ts
│   │   └── prescriptions.spec.ts
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   └── performance/
│       ├── load-tests/
│       └── stress-tests/
│
├── scripts/                                    # Build and deployment scripts
│   ├── build.sh
│   ├── test.sh
│   ├── deploy.sh
│   ├── backup.sh
│   └── setup-dev.sh
│
├── .github/                                    # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── security-scan.yml
│
├── README.md                                   # Project documentation
├── CONTRIBUTING.md                             # Contribution guidelines
├── LICENSE                                     # License file
└── .gitignore                                  # Git ignore rules
```

## Component Hierarchy & Atomic Design

### Frontend Architecture (Atomic Design Pattern)

#### 1. **Atoms** (Basic Building Blocks)
- Button, Input, Label, Avatar, Badge, Spinner, Icon, Typography
- **Responsibility**: Single-purpose, reusable UI elements
- **Example**: `<Button variant="primary" size="lg">Book Appointment</Button>`

#### 2. **Molecules** (Combinations of Atoms)
- FormField, SearchBox, UserCard, AppointmentCard, VideoControls, DateTimePicker
- **Responsibility**: Functional groups of atoms working together
- **Example**: FormField combines Label + Input + validation feedback

#### 3. **Organisms** (Complex UI Components)
- Header, Footer, Navigation, HeroSection, AppointmentForm, VideoCallInterface
- **Responsibility**: Distinct sections of interface with specific functionality
- **Example**: VideoCallInterface manages entire video consultation experience

#### 4. **Templates** (Page-level Layout Components)
- PublicPageTemplate, DashboardTemplate, AuthTemplate, VideoCallTemplate
- **Responsibility**: Page structure and layout without specific content
- **Example**: DashboardTemplate provides sidebar + main content layout

#### 5. **Pages** (Next.js App Router)
- Specific instances of templates with actual content and data
- **Responsibility**: Route-specific implementations with data fetching
- **Example**: `/app/dashboard/appointments/page.tsx`

### Backend Architecture (Domain-Driven Design)

#### 1. **Core Domain Layer**
- **Entities**: Business objects (User, Doctor, Patient, Appointment)
- **Repositories**: Data access interfaces
- **Enums**: Domain-specific value objects

#### 2. **Module Layer (Feature-based)**
- **Auth Module**: Authentication & authorization
- **Users Module**: User management (doctors/patients)
- **Appointments Module**: Scheduling & booking
- **Consultations Module**: Video sessions & notes
- **Prescriptions Module**: Medication management
- **Medical Records Module**: Patient history
- **Video Module**: WebRTC/Twilio integration
- **Payments Module**: Billing & transactions
- **Notifications Module**: Email/SMS alerts
- **Content Module**: Blog & resources

#### 3. **Shared Layer**
- **Exceptions**: Global error handling
- **Utils**: Common utilities
- **Constants**: Application-wide constants
- **DTOs**: Data transfer objects

## Security & Compliance

### HIPAA Compliance Features
- **Data Encryption**: End-to-end encryption for all patient data
- **Access Controls**: Role-based access with detailed audit logs
- **Secure Video**: Encrypted video consultations with recording controls
- **Data Minimization**: Only collect necessary patient information
- **Breach Detection**: Automated monitoring and alerting
- **Business Associate Agreements**: Compliance with third-party services

### Security Implementation
- **Authentication**: OAuth2 + JWT with refresh token rotation
- **Authorization**: Role-based access control (RBAC)
- **API Security**: Rate limiting, input validation, SQL injection prevention
- **Transport Security**: TLS 1.3 for all communications
- **Data Protection**: AES-256 encryption at rest, bcrypt for passwords

## Video Consultation Architecture

### Primary: WebRTC (Peer-to-Peer)
- Direct browser-to-browser communication
- Low latency for real-time consultation
- Built-in encryption
- Screen sharing capabilities

### Fallback: Twilio Video API
- Cloud-based video infrastructure
- Automatic fallback when P2P fails
- Recording and analytics features
- Global edge network

### Alternative: Jitsi Meet Integration
- Open-source video conferencing
- Self-hosted option for maximum privacy
- Custom branding and features

## Development Workflow

### Backend Development
1. **Domain Design**: Define entities and business rules
2. **API First**: Design REST APIs with OpenAPI specification
3. **Test-Driven Development**: Unit tests for all business logic
4. **Integration Testing**: Test module interactions
5. **Workflow Implementation**: Camunda BPMN for complex processes

### Frontend Development
1. **Design System**: Build atomic components first
2. **Component Library**: Create reusable UI components
3. **State Management**: Redux for global state, React hooks for local state
4. **Type Safety**: TypeScript for all components and API interfaces
5. **Testing**: Jest + React Testing Library for components

### DevOps & Deployment
1. **Containerization**: Docker for both frontend and backend
2. **Orchestration**: Kubernetes for production deployment
3. **CI/CD**: GitHub Actions for automated testing and deployment
4. **Monitoring**: Application performance monitoring and health checks
5. **Security Scanning**: Automated vulnerability assessment

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component with WebP format
- **Caching**: Service Worker for offline capabilities
- **Bundle Analysis**: Regular bundle size monitoring

### Backend Optimization
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Redis for session and frequently accessed data
- **Connection Pooling**: Efficient database connection management
- **API Rate Limiting**: Prevent abuse and ensure fair usage

### Video Optimization
- **Adaptive Bitrate**: Dynamic quality adjustment based on network
- **Network Detection**: Automatic fallback based on connection quality
- **Bandwidth Optimization**: Efficient video encoding and compression

This architecture provides a solid foundation for The Physc telemedicine application, ensuring scalability, security, and maintainability while following modern development practices and compliance requirements.
