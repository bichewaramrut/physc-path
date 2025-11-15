package com.thephysc.modules.video.services;

import com.thephysc.core.entities.Consultation;
import com.thephysc.core.entities.Doctor;
import com.thephysc.core.entities.Patient;
import com.thephysc.core.entities.VideoSession;
import com.thephysc.core.repositories.ConsultationRepository;
import com.thephysc.core.repositories.DoctorRepository;
import com.thephysc.core.repositories.PatientRepository;
import com.thephysc.core.repositories.VideoSessionRepository;
import com.thephysc.modules.video.dto.VideoSessionDto;
import com.thephysc.modules.video.dto.VideoTokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class VideoSessionService {

    private final VideoSessionRepository videoSessionRepository;
    private final ConsultationRepository consultationRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    
    // In a production environment, these would be populated from environment variables or config
    @Value("${video.twilio.account-sid:}")
    private String twilioAccountSid;
    
    @Value("${video.twilio.api-key:}")
    private String twilioApiKey;
    
    @Value("${video.twilio.api-secret:}")
    private String twilioApiSecret;
    
    @Value("${video.provider:WEBRTC}")
    private String videoProvider;

    public VideoSessionService(
            VideoSessionRepository videoSessionRepository,
            ConsultationRepository consultationRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository) {
        this.videoSessionRepository = videoSessionRepository;
        this.consultationRepository = consultationRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    public VideoSessionDto getVideoSession(String sessionId) {
        VideoSession videoSession = videoSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Video session not found"));
        
        // Check user access
        checkVideoSessionAccess(videoSession);
        
        return mapToDto(videoSession);
    }
    
    public VideoSessionDto getVideoSessionForConsultation(Long consultationId) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new EntityNotFoundException("Consultation not found"));
        
        VideoSession videoSession = Optional.ofNullable(consultation.getVideoSession())
                .orElseThrow(() -> new EntityNotFoundException("No video session found for this consultation"));
        
        // Check user access
        checkVideoSessionAccess(videoSession);
        
        return mapToDto(videoSession);
    }
    
    public VideoTokenResponse generateToken(String sessionId, String identity) {
        VideoSession videoSession = videoSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Video session not found"));
        
        // Check user access
        checkVideoSessionAccess(videoSession);
        
        String token = "";
        
        // In a real implementation, we would use Twilio SDK to generate a token
        // This is a placeholder for demonstration
        switch (videoProvider) {
            case "TWILIO":
                // token = generateTwilioToken(sessionId, identity);
                token = "MOCK_TWILIO_TOKEN_" + UUID.randomUUID().toString();
                break;
            case "WEBRTC":
            default:
                // For WebRTC, we might not need a token, or would use a simple identifier
                token = "WEBRTC_" + UUID.randomUUID().toString();
                break;
        }
        
        VideoTokenResponse response = new VideoTokenResponse();
        response.setToken(token);
        response.setSessionId(sessionId);
        response.setIdentity(identity);
        response.setProvider(videoProvider);
        
        // Update last access time
        videoSession.setLastAccessedAt(LocalDateTime.now());
        videoSessionRepository.save(videoSession);
        
        return response;
    }
    
    private void checkVideoSessionAccess(VideoSession videoSession) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        Consultation consultation = videoSession.getConsultation();
        if (consultation == null) {
            throw new EntityNotFoundException("Video session is not associated with a consultation");
        }
        
        boolean hasAccess = false;
        
        // Check if user is the doctor for this consultation
        doctorRepository.findByUser_Email(email).ifPresent(doctor -> {
            if (consultation.getAppointment().getDoctor().getId().equals(doctor.getId())) {
                // User is authorized as doctor
            } else {
                throw new AccessDeniedException("You are not the doctor for this consultation");
            }
        });
        
        // Check if user is the patient for this consultation
        patientRepository.findByUser_Email(email).ifPresent(patient -> {
            if (consultation.getAppointment().getPatient().getId().equals(patient.getId())) {
                // User is authorized as patient
            } else {
                throw new AccessDeniedException("You are not the patient for this consultation");
            }
        });
    }
    
    private VideoSessionDto mapToDto(VideoSession videoSession) {
        VideoSessionDto dto = new VideoSessionDto();
        dto.setId(videoSession.getId());
        dto.setSessionId(videoSession.getSessionId());
        dto.setProvider(videoSession.getProvider() != null ? videoSession.getProvider() : videoProvider);
        dto.setStatus(videoSession.getStatus() != null ? videoSession.getStatus() : "ACTIVE");
        dto.setConsultationId(videoSession.getConsultation().getId());
        dto.setDoctorId(videoSession.getConsultation().getAppointment().getDoctor().getId());
        dto.setDoctorName(videoSession.getConsultation().getAppointment().getDoctor().getUser().getFirstName() + " " +
                         videoSession.getConsultation().getAppointment().getDoctor().getUser().getLastName());
        dto.setPatientId(videoSession.getConsultation().getAppointment().getPatient().getId());
        dto.setPatientName(videoSession.getConsultation().getAppointment().getPatient().getUser().getFirstName() + " " +
                          videoSession.getConsultation().getAppointment().getPatient().getUser().getLastName());
        dto.setCreatedAt(videoSession.getCreatedAt());
        dto.setLastAccessedAt(videoSession.getLastAccessedAt());
        
        return dto;
    }
}
