package com.thephysc.modules.video.controllers;

import com.thephysc.core.entities.MeetingMessage;
import com.thephysc.core.entities.MeetingParticipant;
import com.thephysc.modules.video.dto.CreateMeetingRoomRequest;
import com.thephysc.modules.video.dto.JoinMeetingRequest;
import com.thephysc.modules.video.dto.MeetingRoomResponse;
import com.thephysc.modules.video.services.MeetingRoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.camunda.bpm.engine.runtime.ActivityInstance;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/meetings")
@RequiredArgsConstructor
@Tag(name = "Meeting Room Management", description = "APIs for managing video meeting rooms")
public class MeetingRoomController {

    private final MeetingRoomService meetingRoomService;

    @PostMapping("/create")
    @Operation(summary = "Create a new meeting room", description = "Creates a new video meeting room with specified configuration")
    public ResponseEntity<?> createMeetingRoom(@Valid @RequestBody CreateMeetingRoomRequest request) {
        try {
            log.info("Creating meeting room with ID: {}", request.getRoomId());
            MeetingRoomResponse response = meetingRoomService.createMeetingRoom(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Meeting room created successfully",
                    "data", response));
        } catch (Exception e) {
            log.error("Error creating meeting room: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/quick-create/{roomId}")
    @Operation(summary = "Quick create meeting room", description = "Quickly creates a meeting room with default settings for demo")
    public ResponseEntity<?> quickCreateMeetingRoom(
            @Parameter(description = "Unique room ID") @PathVariable String roomId) {
        try {
            log.info("Quick creating meeting room with ID: {}", roomId);

            CreateMeetingRoomRequest request = CreateMeetingRoomRequest.builder()
                    .roomId(roomId)
                    .roomName("Demo Meeting - " + roomId)
                    .description("Quick demo meeting room")
                    .hostId(1L)
                    .hostName("Demo Host")
                    .durationMinutes(120) // Extended to 2 hours for demo
                    .maxParticipants(10)
                    .isRecordingEnabled(true)
                    .isChatEnabled(true)
                    .isFileSharingEnabled(true)
                    .isScreenSharingEnabled(true)
                    .isCameraEnabled(true)
                    .scheduledStartTime(LocalDateTime.now())
                    .scheduledEndTime(LocalDateTime.now().plusMinutes(120)) // Extended to 2 hours
                    .build();

            MeetingRoomResponse response = meetingRoomService.createMeetingRoom(request);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Meeting room created successfully",
                    "data", response,
                    "joinUrl", "http://localhost:3000/dashboard/meeting/" + roomId,
                    "demoInstructions",
                    "This is a demo meeting room with 2 hours duration. All features are enabled including chat, file sharing, screen sharing, and recording."));
        } catch (Exception e) {
            log.error("Error creating quick meeting room: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/{roomId}")
    @Operation(summary = "Get meeting room details", description = "Retrieves meeting room information by room ID")
    public ResponseEntity<?> getMeetingRoom(
            @Parameter(description = "Room ID") @PathVariable String roomId) {
        try {
            return meetingRoomService.getMeetingRoom(roomId)
                    .map(room -> ResponseEntity.ok(Map.of(
                            "success", true,
                            "data", room)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("Error getting meeting room: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Get all meeting rooms", description = "Retrieves all meeting rooms")
    public ResponseEntity<?> getAllMeetingRooms() {
        try {
            List<MeetingRoomResponse> rooms = meetingRoomService.getAllMeetingRooms();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", rooms,
                    "count", rooms.size()));
        } catch (Exception e) {
            log.error("Error getting meeting rooms: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/active")
    @Operation(summary = "Get active meeting rooms", description = "Retrieves all currently active meeting rooms")
    public ResponseEntity<?> getActiveMeetingRooms() {
        try {
            List<MeetingRoomResponse> rooms = meetingRoomService.getActiveMeetingRooms();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", rooms,
                    "count", rooms.size()));
        } catch (Exception e) {
            log.error("Error getting active meeting rooms: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/{roomId}/join")
    @Operation(summary = "Join meeting room", description = "Allows a participant to join a meeting room")
    public ResponseEntity<?> joinMeeting(
            @Parameter(description = "Room ID") @PathVariable String roomId,
            @Valid @RequestBody JoinMeetingRequest request) {
        try {
            request.setRoomId(roomId);
            MeetingParticipant participant = meetingRoomService.joinMeeting(request);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Successfully joined meeting",
                    "data", participant));
        } catch (Exception e) {
            log.error("Error joining meeting: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/{roomId}/leave")
    @Operation(summary = "Leave meeting room", description = "Allows a participant to leave a meeting room")
    public ResponseEntity<?> leaveMeeting(
            @Parameter(description = "Room ID") @PathVariable String roomId,
            @RequestParam String participantId) {
        try {
            meetingRoomService.leaveMeeting(roomId, participantId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Successfully left meeting"));
        } catch (Exception e) {
            log.error("Error leaving meeting: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/{roomId}/end")
    @Operation(summary = "End meeting room", description = "Ends a meeting room and disconnects all participants")
    public ResponseEntity<?> endMeeting(
            @Parameter(description = "Room ID") @PathVariable String roomId) {
        try {
            meetingRoomService.endMeeting(roomId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Meeting ended successfully"));
        } catch (Exception e) {
            log.error("Error ending meeting: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/{roomId}/participants")
    @Operation(summary = "Get meeting participants", description = "Retrieves all participants in a meeting room")
    public ResponseEntity<?> getMeetingParticipants(
            @Parameter(description = "Room ID") @PathVariable String roomId) {
        try {
            List<MeetingParticipant> participants = meetingRoomService.getMeetingParticipants(roomId);
            List<MeetingParticipant> activeParticipants = meetingRoomService.getActiveParticipants(roomId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", Map.of(
                            "allParticipants", participants,
                            "activeParticipants", activeParticipants,
                            "totalCount", participants.size(),
                            "activeCount", activeParticipants.size())));
        } catch (Exception e) {
            log.error("Error getting meeting participants: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/{roomId}/messages")
    @Operation(summary = "Get meeting messages", description = "Retrieves all messages from a meeting room")
    public ResponseEntity<?> getMeetingMessages(
            @Parameter(description = "Room ID") @PathVariable String roomId) {
        try {
            List<MeetingMessage> messages = meetingRoomService.getMeetingMessages(roomId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", messages,
                    "count", messages.size()));
        } catch (Exception e) {
            log.error("Error getting meeting messages: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @GetMapping("/{roomId}/validate")
    @Operation(summary = "Validate meeting room", description = "Checks if a meeting room is valid and accessible")
    public ResponseEntity<?> validateMeetingRoom(
            @Parameter(description = "Room ID") @PathVariable String roomId) {
        try {
            boolean isValid = meetingRoomService.isValidMeetingRoom(roomId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isValid", isValid,
                    "message", isValid ? "Meeting room is valid" : "Meeting room is not accessible"));
        } catch (Exception e) {
            log.error("Error validating meeting room: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }

    @PostMapping("/cleanup")
    @Operation(summary = "Cleanup expired meetings", description = "Manually triggers cleanup of expired meeting rooms")
    public ResponseEntity<?> cleanupExpiredMeetings() {
        try {
            meetingRoomService.cleanupExpiredMeetings();
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Expired meetings cleaned up successfully"));
        } catch (Exception e) {
            log.error("Error cleaning up expired meetings: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "success", false,
                    "message", e.getMessage()));
        }
    }
}
