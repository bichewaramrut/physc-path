package com.thephysc.modules.video.dto;

import com.thephysc.core.entities.MeetingRoom;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@Builder
public class CreateMeetingRoomRequest {

    @NotBlank(message = "Room ID is required")
    private String roomId;

    @NotBlank(message = "Room name is required")
    private String roomName;

    private String description;

    @NotNull(message = "Host ID is required")
    private Long hostId;

    @NotBlank(message = "Host name is required")
    private String hostName;

    private LocalDateTime scheduledStartTime;

    private LocalDateTime scheduledEndTime;

    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;

    @Min(value = 2, message = "Maximum participants must be at least 2")
    private Integer maxParticipants;

    private String password;

    @Builder.Default
    private Boolean isRecordingEnabled = true;

    @Builder.Default
    private Boolean isChatEnabled = true;

    @Builder.Default
    private Boolean isFileSharingEnabled = true;

    @Builder.Default
    private Boolean isScreenSharingEnabled = true;

    @Builder.Default
    private Boolean isCameraEnabled = true;

    // Convert to entity
    public MeetingRoom toEntity() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startTime = scheduledStartTime != null ? scheduledStartTime : now;
        LocalDateTime endTime = scheduledEndTime != null ? scheduledEndTime : 
                               (durationMinutes != null ? startTime.plusMinutes(durationMinutes) : startTime.plusMinutes(15));

        return MeetingRoom.builder()
                .roomId(roomId)
                .roomName(roomName)
                .description(description)
                .hostId(hostId)
                .hostName(hostName)
                .scheduledStartTime(startTime)
                .scheduledEndTime(endTime)
                .durationMinutes(durationMinutes != null ? durationMinutes : 15)
                .maxParticipants(maxParticipants != null ? maxParticipants : 10)
                .password(password)
                .isRecordingEnabled(isRecordingEnabled)
                .isChatEnabled(isChatEnabled)
                .isFileSharingEnabled(isFileSharingEnabled)
                .isScreenSharingEnabled(isScreenSharingEnabled)
                .isCameraEnabled(isCameraEnabled)
                .status(MeetingRoom.RoomStatus.SCHEDULED)
                .build();
    }
}
