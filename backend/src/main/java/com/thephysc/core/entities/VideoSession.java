package com.thephysc.core.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "video_sessions")
public class VideoSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;

    @Column(name = "session_id", nullable = false, unique = true)
    private String sessionId;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "patient_joined")
    private boolean patientJoined;

    @Column(name = "doctor_joined")
    private boolean doctorJoined;

    @Column(name = "recording_enabled")
    private boolean recordingEnabled;

    @Column(name = "recording_url")
    private String recordingUrl;
    
    @Column(name = "provider")
    private String provider; // WEBRTC, TWILIO, JITSI
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @Column(name = "session_token")
    private String sessionToken;

    @Column(name = "session_config", columnDefinition = "TEXT")
    private String sessionConfig; // JSON configuration

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
