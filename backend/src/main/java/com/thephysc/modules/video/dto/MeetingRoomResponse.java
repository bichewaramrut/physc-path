package com.thephysc.modules.video.dto;

import com.thephysc.core.entities.MeetingRoom;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MeetingRoomResponse {

    private Long id;
    private String roomId;
    private String roomName;
    private String description;
    private Long hostId;
    private String hostName;
    private LocalDateTime scheduledStartTime;
    private LocalDateTime scheduledEndTime;
    private LocalDateTime actualStartTime;
    private LocalDateTime actualEndTime;
    private Integer durationMinutes;
    private Integer maxParticipants;
    private MeetingRoom.RoomStatus status;
    private Boolean isRecordingEnabled;
    private Boolean isChatEnabled;
    private Boolean isFileSharingEnabled;
    private Boolean isScreenSharingEnabled;
    private Boolean isCameraEnabled;
    private Long activeParticipantsCount;
    private String joinUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Convert from entity
    public static MeetingRoomResponse fromEntity(MeetingRoom meetingRoom) {
        return MeetingRoomResponse.builder()
                .id(meetingRoom.getId())
                .roomId(meetingRoom.getRoomId())
                .roomName(meetingRoom.getRoomName())
                .description(meetingRoom.getDescription())
                .hostId(meetingRoom.getHostId())
                .hostName(meetingRoom.getHostName())
                .scheduledStartTime(meetingRoom.getScheduledStartTime())
                .scheduledEndTime(meetingRoom.getScheduledEndTime())
                .actualStartTime(meetingRoom.getActualStartTime())
                .actualEndTime(meetingRoom.getActualEndTime())
                .durationMinutes(meetingRoom.getDurationMinutes())
                .maxParticipants(meetingRoom.getMaxParticipants())
                .status(meetingRoom.getStatus())
                .isRecordingEnabled(meetingRoom.getIsRecordingEnabled())
                .isChatEnabled(meetingRoom.getIsChatEnabled())
                .isFileSharingEnabled(meetingRoom.getIsFileSharingEnabled())
                .isScreenSharingEnabled(meetingRoom.getIsScreenSharingEnabled())
                .isCameraEnabled(meetingRoom.getIsCameraEnabled())
                .activeParticipantsCount(meetingRoom.getActiveParticipantsCount())
                .joinUrl("/dashboard/meeting/" + meetingRoom.getRoomId())
                .createdAt(meetingRoom.getCreatedAt())
                .updatedAt(meetingRoom.getUpdatedAt())
                .build();
    }
}
