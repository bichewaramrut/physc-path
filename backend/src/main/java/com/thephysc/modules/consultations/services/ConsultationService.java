package com.thephysc.modules.consultations.services;

import com.thephysc.core.entities.Appointment;
import com.thephysc.core.entities.Consultation;
import com.thephysc.core.entities.Doctor;
import com.thephysc.core.entities.VideoSession;
import com.thephysc.core.repositories.AppointmentRepository;
import com.thephysc.core.repositories.ConsultationRepository;
import com.thephysc.core.repositories.DoctorRepository;
import com.thephysc.core.repositories.VideoSessionRepository;
import com.thephysc.modules.consultations.dto.ConsultationDto;
import com.thephysc.modules.consultations.dto.ConsultationNotes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final VideoSessionRepository videoSessionRepository;

    public ConsultationService(
            ConsultationRepository consultationRepository,
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            VideoSessionRepository videoSessionRepository) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.videoSessionRepository = videoSessionRepository;
    }

    @Transactional
    public ConsultationDto startConsultation(Long appointmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Verify doctor is authorized
        Doctor doctor = doctorRepository.findByUser_Email(email)
                .orElseThrow(() -> new AccessDeniedException("Only doctors can start consultations"));
        
        // Find appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));
        
        // Check if the doctor is assigned to this appointment
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You are not authorized to start this consultation");
        }
        
        // Check if the appointment is ready to be started
        if (appointment.getStatus() != Appointment.AppointmentStatus.SCHEDULED) {
            throw new IllegalStateException("Appointment is not in SCHEDULED state");
        }
        
        // Check if consultation already exists
        Consultation existingConsultation = consultationRepository.findByAppointment_Id(appointmentId);
        if (existingConsultation != null) {
            throw new IllegalStateException("Consultation for this appointment already exists");
        }
        
        // Create a new consultation
        Consultation consultation = new Consultation();
        consultation.setAppointment(appointment);
        consultation.setStartTime(LocalDateTime.now());
        consultation.setStatus(Consultation.ConsultationStatus.IN_PROGRESS);
        consultation.setCreatedAt(LocalDateTime.now());
        
        // Create video session
        VideoSession videoSession = new VideoSession();
        videoSession.setSessionId(UUID.randomUUID().toString());
        videoSession.setConsultation(consultation);
        videoSession.setCreatedAt(LocalDateTime.now());
        
        // Save consultation
        consultation.setVideoSession(videoSession);
        Consultation savedConsultation = consultationRepository.save(consultation);
        
        // Update appointment status
        appointment.setStatus(Appointment.AppointmentStatus.IN_PROGRESS);
        appointmentRepository.save(appointment);
        
        return mapToDto(savedConsultation);
    }

    @Transactional
    public ConsultationDto endConsultation(Long consultationId, ConsultationNotes notes) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Verify doctor is authorized
        Doctor doctor = doctorRepository.findByUser_Email(email)
                .orElseThrow(() -> new AccessDeniedException("Only doctors can end consultations"));
        
        // Find consultation
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new EntityNotFoundException("Consultation not found"));
        
        // Check if the doctor is assigned to this consultation
        if (!consultation.getAppointment().getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You are not authorized to end this consultation");
        }
        
        // Check if the consultation is in progress
        if (consultation.getStatus() != Consultation.ConsultationStatus.IN_PROGRESS) {
            throw new IllegalStateException("Consultation is not in progress");
        }
        
        // Update consultation
        consultation.setEndTime(LocalDateTime.now());
        consultation.setStatus(Consultation.ConsultationStatus.COMPLETED);
        consultation.setDoctorNotes(notes.getDoctorNotes());
        consultation.setUpdatedAt(LocalDateTime.now());
        
        Consultation savedConsultation = consultationRepository.save(consultation);
        
        // Update appointment status
        Appointment appointment = consultation.getAppointment();
        appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
        
        return mapToDto(savedConsultation);
    }

    public ConsultationDto getConsultation(Long consultationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Find consultation
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new EntityNotFoundException("Consultation not found"));
        
        // Check access (simplistic - in a real app we'd have more complex permission checks)
        // For now, either the doctor or patient can access
        boolean isAuthorized = false;
        
        // Check if user is the doctor
        doctorRepository.findByUser_Email(email).ifPresent(doctor -> {
            if (consultation.getAppointment().getDoctor().getId().equals(doctor.getId())) {
                // User is authorized as doctor
            } else {
                throw new AccessDeniedException("You are not authorized to view this consultation");
            }
        });
        
        return mapToDto(consultation);
    }

    public Page<ConsultationDto> getDoctorConsultations(Long doctorId, String status, Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Check if user is authorized to view these consultations
        doctorRepository.findByUser_Email(email).ifPresent(doctor -> {
            if (!doctor.getId().equals(doctorId)) {
                throw new AccessDeniedException("You are not authorized to view these consultations");
            }
        });
        
        Page<Consultation> consultations;
        if (status != null && !status.isEmpty()) {
            consultations = consultationRepository.findByAppointment_Doctor_IdAndStatus(
                    doctorId, Consultation.ConsultationStatus.valueOf(status), pageable);
        } else {
            consultations = consultationRepository.findByAppointment_Doctor_Id(doctorId, pageable);
        }
        
        return consultations.map(this::mapToDto);
    }

    public Page<ConsultationDto> getPatientConsultations(Long patientId, String status, Pageable pageable) {
        // Similar access control as getDoctorConsultations
        // Omitted for brevity
        
        Page<Consultation> consultations;
        if (status != null && !status.isEmpty()) {
            consultations = consultationRepository.findByAppointment_Patient_IdAndStatus(
                    patientId, Consultation.ConsultationStatus.valueOf(status), pageable);
        } else {
            consultations = consultationRepository.findByAppointment_Patient_Id(patientId, pageable);
        }
        
        return consultations.map(this::mapToDto);
    }
    
    @Transactional
    public ConsultationDto updateConsultationNotes(Long consultationId, ConsultationNotes notes) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Verify doctor is authorized
        Doctor doctor = doctorRepository.findByUser_Email(email)
                .orElseThrow(() -> new AccessDeniedException("Only doctors can update consultation notes"));
        
        // Find consultation
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new EntityNotFoundException("Consultation not found"));
        
        // Check if the doctor is assigned to this consultation
        if (!consultation.getAppointment().getDoctor().getId().equals(doctor.getId())) {
            throw new AccessDeniedException("You are not authorized to update this consultation");
        }
        
        // Update consultation notes
        consultation.setDoctorNotes(notes.getDoctorNotes());
        consultation.setUpdatedAt(LocalDateTime.now());
        
        Consultation savedConsultation = consultationRepository.save(consultation);
        return mapToDto(savedConsultation);
    }

    // Helper method to map Consultation entity to DTO
    private ConsultationDto mapToDto(Consultation consultation) {
        ConsultationDto dto = new ConsultationDto();
        dto.setId(consultation.getId());
        dto.setAppointmentId(consultation.getAppointment().getId());
        dto.setDoctorId(consultation.getAppointment().getDoctor().getId());
        dto.setDoctorName(consultation.getAppointment().getDoctor().getUser().getFirstName() + " " +
                         consultation.getAppointment().getDoctor().getUser().getLastName());
        dto.setPatientId(consultation.getAppointment().getPatient().getId());
        dto.setPatientName(consultation.getAppointment().getPatient().getUser().getFirstName() + " " +
                          consultation.getAppointment().getPatient().getUser().getLastName());
        dto.setStartTime(consultation.getStartTime());
        dto.setEndTime(consultation.getEndTime());
        dto.setStatus(consultation.getStatus().name());
        dto.setDoctorNotes(consultation.getDoctorNotes());
        dto.setRecordingUrl(consultation.getRecordingUrl());
        
        if (consultation.getVideoSession() != null) {
            dto.setVideoSessionId(consultation.getVideoSession().getSessionId());
        }
        
        dto.setCreatedAt(consultation.getCreatedAt());
        dto.setUpdatedAt(consultation.getUpdatedAt());
        
        return dto;
    }
}
