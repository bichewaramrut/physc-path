package com.thephysc.core.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "meeting_participants")
public class MeetingParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_room_id", nullable = false)
    @JsonBackReference
    private MeetingRoom meetingRoom;

    @Column(name = "participant_id", nullable = false)
    private String participantId;

    @Column(name = "participant_name", nullable = false)
    private String participantName;

    @Column(name = "participant_email")
    private String participantEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private ParticipantRole role = ParticipantRole.PARTICIPANT;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ParticipantStatus status = ParticipantStatus.INVITED;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @Column(name = "left_at")
    private LocalDateTime leftAt;

    @Column(name = "is_audio_enabled")
    private Boolean isAudioEnabled = true;

    @Column(name = "is_video_enabled")
    private Boolean isVideoEnabled = true;

    @Column(name = "is_screen_sharing")
    private Boolean isScreenSharing = false;

    @Column(name = "connection_quality")
    private String connectionQuality; // excellent, good, poor, disconnected

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ParticipantRole {
        HOST,
        MODERATOR,
        PARTICIPANT,
        OBSERVER
    }

    public enum ParticipantStatus {
        INVITED,
        CONNECTED,
        DISCONNECTED,
        LEFT
    }

    // Helper methods
    public boolean isConnected() {
        return status == ParticipantStatus.CONNECTED;
    }

    public boolean isHost() {
        return role == ParticipantRole.HOST;
    }

    public long getSessionDurationMinutes() {
        if (joinedAt == null) return 0;
        LocalDateTime endTime = leftAt != null ? leftAt : LocalDateTime.now();
        return java.time.Duration.between(joinedAt, endTime).toMinutes();
    }
}
