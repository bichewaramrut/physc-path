package com.thephysc.core.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "meeting_rooms")
public class MeetingRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false, unique = true)
    private String roomId;

    @Column(name = "room_name", nullable = false)
    private String roomName;

    @Column(name = "host_id")
    private Long hostId;

    @Column(name = "host_name")
    private String hostName;

    @Column(name = "description")
    private String description;

    @Column(name = "scheduled_start_time")
    private LocalDateTime scheduledStartTime;

    @Column(name = "scheduled_end_time")
    private LocalDateTime scheduledEndTime;

    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RoomStatus status = RoomStatus.SCHEDULED;

    @Column(name = "password")
    private String password;

    @Column(name = "is_recording_enabled")
    private Boolean isRecordingEnabled = true;

    @Column(name = "is_chat_enabled")
    private Boolean isChatEnabled = true;

    @Column(name = "is_file_sharing_enabled")
    private Boolean isFileSharingEnabled = true;

    @Column(name = "is_screen_sharing_enabled")
    private Boolean isScreenSharingEnabled = true;

    @Column(name = "is_camera_enabled")
    private Boolean isCameraEnabled = true;

    @Column(name = "session_config", columnDefinition = "TEXT")
    private String sessionConfig; // JSON configuration for WebRTC

    @OneToMany(mappedBy = "meetingRoom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<MeetingParticipant> participants = new ArrayList<>();

    @OneToMany(mappedBy = "meetingRoom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<MeetingMessage> messages = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum RoomStatus {
        SCHEDULED,
        ACTIVE,
        ENDED,
        CANCELLED
    }

    // Helper methods
    public boolean isActive() {
        return status == RoomStatus.ACTIVE;
    }

    public boolean isScheduled() {
        return status == RoomStatus.SCHEDULED;
    }

    public boolean hasExpired() {
        return scheduledEndTime != null && LocalDateTime.now().isAfter(scheduledEndTime);
    }

    public long getActiveParticipantsCount() {
        if (participants == null) {
            return 0;
        }
        return participants.stream()
                .filter(p -> p.getStatus() == MeetingParticipant.ParticipantStatus.CONNECTED)
                .count();
    }
}
