package com.thephysc.modules.appointments.services;

import com.thephysc.core.entities.Appointment;
import com.thephysc.core.entities.Doctor;
import com.thephysc.core.entities.Patient;
import com.thephysc.core.repositories.AppointmentRepository;
import com.thephysc.core.repositories.DoctorRepository;
import com.thephysc.core.repositories.PatientRepository;
import com.thephysc.modules.appointments.dto.AppointmentDto;
import com.thephysc.modules.appointments.dto.CreateAppointmentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AvailabilityService availabilityService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            AvailabilityService availabilityService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.availabilityService = availabilityService;
    }

    @Transactional
    public AppointmentDto createAppointment(CreateAppointmentRequest request) {
        // Get current authenticated user (patient)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Patient patient = patientRepository.findByUser_Email(email)
                .orElseThrow(() -> new AccessDeniedException("Only patients can book appointments"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));

        // Check if the time slot is available
        boolean isSlotAvailable = availabilityService.isTimeSlotAvailable(
                doctor.getId(),
                request.getAppointmentDate(),
                request.getAppointmentDate().plusHours(1) // Assuming 1 hour appointment
        );

        if (!isSlotAvailable) {
            throw new IllegalArgumentException("The selected time slot is not available");
        }

        // Create and save appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setEndTime(request.getAppointmentDate().plusHours(1)); // Default 1 hour
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        appointment.setReason(request.getReason());
        appointment.setConsultationType(request.getConsultationType());
        appointment.setCreatedAt(LocalDateTime.now());

        // Todo : create a room for the appointment if consultation type is video/audio
        //  create a notification for the patient and doctor
        //  send email notification to patient and doctor
        //  send SMS notification to patient and doctor
        //  create a calendar event for the appointment
        //  save the room details in the appointment

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return mapToDto(savedAppointment);
    }

    public AppointmentDto getAppointment(Long id) {
        Appointment appointment = findAppointmentAndCheckAccess(id);
        return mapToDto(appointment);
    }

    public Page<AppointmentDto> getPatientAppointments(Long patientId, String status, Pageable pageable) {
        // Check access
        checkPatientAccess(patientId);

        Page<Appointment> appointments;
        if (status != null && !status.isEmpty()) {
            appointments = appointmentRepository.findByPatient_IdAndStatus(
                    patientId, Appointment.AppointmentStatus.valueOf(status), pageable);
        } else {
            appointments = appointmentRepository.findByPatient_Id(patientId, pageable);
        }

        return appointments.map(this::mapToDto);
    }
    
    public Page<AppointmentDto> getDoctorAppointments(Long doctorId, String status, Pageable pageable) {
        // Check access
        checkDoctorAccess(doctorId);

        Page<Appointment> appointments;
        if (status != null && !status.isEmpty()) {
            appointments = appointmentRepository.findByDoctor_IdAndStatus(
                    doctorId, Appointment.AppointmentStatus.valueOf(status), pageable);
        } else {
            appointments = appointmentRepository.findByDoctor_Id(doctorId, pageable);
        }

        return appointments.map(this::mapToDto);
    }
    
    @Transactional
    public AppointmentDto updateAppointmentStatus(Long appointmentId, String status) {
        return updateAppointmentStatus(appointmentId, status, null);
    }
    
    @Transactional
    public AppointmentDto updateAppointmentStatus(Long appointmentId, String status, String reason) {
        Appointment appointment = findAppointmentAndCheckAccess(appointmentId);
        
        Appointment.AppointmentStatus newStatus;
        try {
            newStatus = Appointment.AppointmentStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        
        appointment.setStatus(newStatus);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        if (newStatus == Appointment.AppointmentStatus.CANCELLED && reason != null) {
            appointment.setCancellationReason(reason);
        }
        
        // Additional business logic depending on status
        switch (newStatus) {
            case COMPLETED:
                // Could trigger consultation record creation, billing, etc.
                break;
            case CANCELLED:
                // Could trigger notification, refund logic, etc.
                break;
            default:
                break;
        }
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToDto(savedAppointment);
    }
    
    @Transactional
    public AppointmentDto rescheduleAppointment(Long appointmentId, CreateAppointmentRequest request) {
        Appointment appointment = findAppointmentAndCheckAccess(appointmentId);
        
        // Check if new time slot is available
        boolean isSlotAvailable = availabilityService.isTimeSlotAvailable(
                appointment.getDoctor().getId(),
                request.getAppointmentDate(),
                request.getAppointmentDate().plusHours(1)
        );
        
        if (!isSlotAvailable) {
            throw new IllegalArgumentException("The selected time slot is not available");
        }
        
        // Update appointment
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setEndTime(request.getAppointmentDate().plusHours(1));
        appointment.setReason(request.getReason());
        appointment.setConsultationType(request.getConsultationType());
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToDto(savedAppointment);
    }
    
    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = findAppointmentAndCheckAccess(appointmentId);
        
        // Business logic before cancellation (e.g., check cancellation policy)
        LocalDateTime now = LocalDateTime.now();
        if (appointment.getAppointmentDate().minusHours(24).isBefore(now)) {
            throw new IllegalStateException("Appointments can only be cancelled 24 hours in advance");
        }
        
        // Update appointment status
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointment.setUpdatedAt(now);
        appointmentRepository.save(appointment);
        
        // Additional cancellation logic could be added (notifications, refunds, etc.)
    }
    
    public List<AppointmentDto> getUpcomingAppointments() {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        List<AppointmentDto> upcomingAppointments = new ArrayList<>();
        
        // Check if user is a patient
        patientRepository.findByUser_Email(email).ifPresent(patient -> {
            List<Appointment> appointments = appointmentRepository.findByPatient_IdAndAppointmentDateGreaterThanAndStatus(
                    patient.getId(),
                    LocalDateTime.now(),
                    Appointment.AppointmentStatus.SCHEDULED);

            appointments.stream()
                    .map(this::mapToDto)
                    .forEach(upcomingAppointments::add);
        });
        
        // Check if user is a doctor
        doctorRepository.findByUser_Email(email).ifPresent(doctor -> {
            List<Appointment> appointments = appointmentRepository.findByDoctor_IdAndAppointmentDateGreaterThanAndStatus(
                    doctor.getId(), 
                    LocalDateTime.now(),
                    Appointment.AppointmentStatus.SCHEDULED);

            appointments.stream()
                    .map(this::mapToDto)
                    .forEach(upcomingAppointments::add);
        });
        
        return upcomingAppointments;
    }
    
    // Helper methods
    private Appointment findAppointmentAndCheckAccess(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Admin access - can access any appointment
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return appointment;
        }
        
        // Doctor access - can only access their own appointments
        doctorRepository.findByUser_Email(email).ifPresent(doctor -> {
            if (!appointment.getDoctor().getId().equals(doctor.getId())) {
                throw new AccessDeniedException("You do not have access to this appointment");
            }
        });
        
        // Patient access - can only access their own appointments
        patientRepository.findByUser_Email(email).ifPresent(patient -> {
            if (!appointment.getPatient().getId().equals(patient.getId())) {
                throw new AccessDeniedException("You do not have access to this appointment");
            }
        });
        
        return appointment;
    }
    
    private void checkPatientAccess(Long patientId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Admin access - can access any patient data
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return;
        }
        
        // Doctors can access their patients
        doctorRepository.findByUser_Email(email).ifPresent(doctor -> {
            // Here we would typically check if the patient is assigned to this doctor
            // For simplicity, we'll allow all doctors to access all patient data
            return;
        });
        
        // Patients can only access their own data
        patientRepository.findByUser_Email(email).ifPresent(patient -> {
            if (!patient.getId().equals(patientId)) {
                throw new AccessDeniedException("You do not have access to this patient's data");
            }
        });
    }
    
    private void checkDoctorAccess(Long doctorId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Admin access - can access any doctor data
        if (authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
            return;
        }
        
        // Doctors can only access their own data
        doctorRepository.findByUser_Email(email).ifPresent(doctor -> {
            if (!doctor.getId().equals(doctorId)) {
                throw new AccessDeniedException("You do not have access to this doctor's data");
            }
        });
    }
    
    private AppointmentDto mapToDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setDoctorId(appointment.getDoctor().getId());
        dto.setPatientId(appointment.getPatient().getId());
        dto.setDoctorName(appointment.getDoctor().getUser().getFirstName() + " " + 
                          appointment.getDoctor().getUser().getLastName());
        dto.setPatientName(appointment.getPatient().getUser().getFirstName() + " " + 
                           appointment.getPatient().getUser().getLastName());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setEndTime(appointment.getEndTime());
        dto.setStatus(appointment.getStatus().name());
        dto.setReason(appointment.getReason());
        dto.setConsultationType(appointment.getConsultationType().toString());

        if (appointment.getCancellationReason() != null) {
            dto.setCancellationReason(appointment.getCancellationReason());
        }
        
        dto.setCreatedAt(appointment.getCreatedAt());
        dto.setUpdatedAt(appointment.getUpdatedAt());
        
        return dto;
    }
}
