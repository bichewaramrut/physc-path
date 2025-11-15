package com.thephysc.modules.video.dto;

import com.thephysc.core.entities.MeetingParticipant;
import lombok.Builder;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
@Builder
public class JoinMeetingRequest {

    private String roomId; // This will be set from path variable, no validation needed

    @NotBlank(message = "Participant ID is required")
    private String participantId;

    @NotBlank(message = "Participant name is required")
    private String participantName;

    private String participantEmail;

    private String password;

    @Builder.Default
    private MeetingParticipant.ParticipantRole role = MeetingParticipant.ParticipantRole.PARTICIPANT;

    @Builder.Default
    private Boolean isAudioEnabled = true;

    @Builder.Default
    private Boolean isVideoEnabled = true;
}
