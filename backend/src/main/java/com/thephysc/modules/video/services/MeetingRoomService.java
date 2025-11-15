package com.thephysc.modules.video.services;

import com.thephysc.core.entities.MeetingMessage;
import com.thephysc.core.entities.MeetingParticipant;
import com.thephysc.core.entities.MeetingRoom;
import com.thephysc.core.repositories.MeetingMessageRepository;
import com.thephysc.core.repositories.MeetingParticipantRepository;
import com.thephysc.core.repositories.MeetingRoomRepository;
import com.thephysc.modules.video.dto.CreateMeetingRoomRequest;
import com.thephysc.modules.video.dto.JoinMeetingRequest;
import com.thephysc.modules.video.dto.MeetingRoomResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MeetingRoomService {

    private final MeetingRoomRepository meetingRoomRepository;
    private final MeetingParticipantRepository participantRepository;
    private final MeetingMessageRepository messageRepository;

    @Transactional
    public MeetingRoomResponse createMeetingRoom(CreateMeetingRoomRequest request) {
        log.info("Creating meeting room with ID: {}", request.getRoomId());

        // Check if room already exists
        if (meetingRoomRepository.existsByRoomId(request.getRoomId())) {
            throw new RuntimeException("Meeting room with ID " + request.getRoomId() + " already exists");
        }

        // Create and save meeting room
        MeetingRoom meetingRoom = request.toEntity();
        meetingRoom = meetingRoomRepository.save(meetingRoom);

        // Create host participant
        MeetingParticipant hostParticipant = MeetingParticipant.builder()
                .meetingRoom(meetingRoom)
                .participantId(UUID.randomUUID().toString())
                .participantName(request.getHostName())
                .role(MeetingParticipant.ParticipantRole.HOST)
                .status(MeetingParticipant.ParticipantStatus.INVITED)
                .isAudioEnabled(true)
                .isVideoEnabled(true)
                .build();

        participantRepository.save(hostParticipant);

        log.info("Meeting room created successfully: {}", meetingRoom.getRoomId());
        return MeetingRoomResponse.fromEntity(meetingRoom);
    }

    public Optional<MeetingRoomResponse> getMeetingRoom(String roomId) {
        return meetingRoomRepository.findByRoomId(roomId)
                .map(MeetingRoomResponse::fromEntity);
    }

    public List<MeetingRoomResponse> getAllMeetingRooms() {
        return meetingRoomRepository.findAll().stream()
                .map(MeetingRoomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MeetingRoomResponse> getActiveMeetingRooms() {
        return meetingRoomRepository.findByStatus(MeetingRoom.RoomStatus.ACTIVE).stream()
                .map(MeetingRoomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public MeetingParticipant joinMeeting(JoinMeetingRequest request) {
        log.info("Participant {} joining meeting room: {}", request.getParticipantName(), request.getRoomId());

        // Find meeting room
        MeetingRoom meetingRoom = meetingRoomRepository.findByRoomId(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Meeting room not found: " + request.getRoomId()));

        // Check if meeting has expired - for demo purposes, extend meeting if it's expired
        if (meetingRoom.hasExpired()) {
            log.warn("Meeting {} has expired, extending duration for demo purposes", request.getRoomId());
            // Extend the meeting by 2 hours for demo purposes
            meetingRoom.setScheduledEndTime(LocalDateTime.now().plusMinutes(120));
            meetingRoom.setDurationMinutes(120);
            meetingRoomRepository.save(meetingRoom);
        }

        // Check password if required
        if (meetingRoom.getPassword() != null && !meetingRoom.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid meeting password");
        }

        // Check if participant already exists
        Optional<MeetingParticipant> existingParticipant = participantRepository
                .findByMeetingRoomRoomIdAndParticipantId(request.getRoomId(), request.getParticipantId());

        MeetingParticipant participant;
        if (existingParticipant.isPresent()) {
            // Update existing participant
            participant = existingParticipant.get();
            participant.setStatus(MeetingParticipant.ParticipantStatus.CONNECTED);
            participant.setJoinedAt(LocalDateTime.now());
            participant.setIsAudioEnabled(request.getIsAudioEnabled());
            participant.setIsVideoEnabled(request.getIsVideoEnabled());
        } else {
            // Check max participants limit
            long activeCount = participantRepository.countActiveParticipants(request.getRoomId());
            if (activeCount >= meetingRoom.getMaxParticipants()) {
                throw new RuntimeException("Meeting room is full");
            }

            // Create new participant
            participant = MeetingParticipant.builder()
                    .meetingRoom(meetingRoom)
                    .participantId(request.getParticipantId())
                    .participantName(request.getParticipantName())
                    .participantEmail(request.getParticipantEmail())
                    .role(request.getRole())
                    .status(MeetingParticipant.ParticipantStatus.CONNECTED)
                    .joinedAt(LocalDateTime.now())
                    .isAudioEnabled(request.getIsAudioEnabled())
                    .isVideoEnabled(request.getIsVideoEnabled())
                    .build();
        }

        // Start meeting if this is the first participant
        if (meetingRoom.getStatus() == MeetingRoom.RoomStatus.SCHEDULED) {
            meetingRoom.setStatus(MeetingRoom.RoomStatus.ACTIVE);
            meetingRoom.setActualStartTime(LocalDateTime.now());
            meetingRoomRepository.save(meetingRoom);
        }

        participant = participantRepository.save(participant);

        // Add system message for participant joining
        MeetingMessage joinMessage = MeetingMessage.builder()
                .meetingRoom(meetingRoom)
                .senderId("system")
                .senderName("System")
                .senderRole(MeetingParticipant.ParticipantRole.PARTICIPANT)
                .messageType(MeetingMessage.MessageType.SYSTEM)
                .content(request.getParticipantName() + " joined the meeting")
                .isSystemMessage(true)
                .build();

        messageRepository.save(joinMessage);

        log.info("Participant {} successfully joined meeting: {}", request.getParticipantName(), request.getRoomId());
        return participant;
    }

    @Transactional
    public void leaveMeeting(String roomId, String participantId) {
        log.info("Participant {} leaving meeting room: {}", participantId, roomId);

        MeetingParticipant participant = participantRepository
                .findByMeetingRoomRoomIdAndParticipantId(roomId, participantId)
                .orElseThrow(() -> new RuntimeException("Participant not found in meeting"));

        participant.setStatus(MeetingParticipant.ParticipantStatus.LEFT);
        participant.setLeftAt(LocalDateTime.now());
        participantRepository.save(participant);

        // Add system message for participant leaving
        MeetingMessage leaveMessage = MeetingMessage.builder()
                .meetingRoom(participant.getMeetingRoom())
                .senderId("system")
                .senderName("System")
                .senderRole(MeetingParticipant.ParticipantRole.PARTICIPANT)
                .messageType(MeetingMessage.MessageType.SYSTEM)
                .content(participant.getParticipantName() + " left the meeting")
                .isSystemMessage(true)
                .build();

        messageRepository.save(leaveMessage);

        // Check if meeting should be ended
        long activeParticipants = participantRepository.countActiveParticipants(roomId);
        if (activeParticipants == 0) {
            endMeeting(roomId);
        }

        log.info("Participant {} successfully left meeting: {}", participantId, roomId);
    }

    @Transactional
    public void endMeeting(String roomId) {
        log.info("Ending meeting room: {}", roomId);

        MeetingRoom meetingRoom = meetingRoomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Meeting room not found: " + roomId));

        meetingRoom.setStatus(MeetingRoom.RoomStatus.ENDED);
        meetingRoom.setActualEndTime(LocalDateTime.now());
        meetingRoomRepository.save(meetingRoom);

        // Update all connected participants to disconnected
        List<MeetingParticipant> activeParticipants = participantRepository
                .findActiveParticipants(roomId);

        for (MeetingParticipant participant : activeParticipants) {
            participant.setStatus(MeetingParticipant.ParticipantStatus.LEFT);
            participant.setLeftAt(LocalDateTime.now());
        }

        participantRepository.saveAll(activeParticipants);

        log.info("Meeting room ended successfully: {}", roomId);
    }

    public List<MeetingParticipant> getMeetingParticipants(String roomId) {
        return participantRepository.findByMeetingRoomRoomId(roomId);
    }

    public List<MeetingParticipant> getActiveParticipants(String roomId) {
        return participantRepository.findActiveParticipants(roomId);
    }

    public List<MeetingMessage> getMeetingMessages(String roomId) {
        return messageRepository.findByMeetingRoomRoomIdOrderByCreatedAtAsc(roomId);
    }

    @Transactional
    public MeetingMessage saveMessage(String roomId, String senderId, String senderName, 
                                    MeetingParticipant.ParticipantRole senderRole, String content, 
                                    MeetingMessage.MessageType messageType) {
        MeetingRoom meetingRoom = meetingRoomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("Meeting room not found: " + roomId));

        MeetingMessage message = MeetingMessage.builder()
                .meetingRoom(meetingRoom)
                .senderId(senderId)
                .senderName(senderName)
                .senderRole(senderRole)
                .messageType(messageType)
                .content(content)
                .isSystemMessage(false)
                .build();

        return messageRepository.save(message);
    }

    @Transactional
    public void cleanupExpiredMeetings() {
        log.info("Cleaning up expired meetings");
        
        List<MeetingRoom> expiredMeetings = meetingRoomRepository
                .findExpiredActiveMeetings(LocalDateTime.now());

        for (MeetingRoom meeting : expiredMeetings) {
            endMeeting(meeting.getRoomId());
        }

        log.info("Cleaned up {} expired meetings", expiredMeetings.size());
    }

    public boolean isValidMeetingRoom(String roomId) {
        return meetingRoomRepository.findByRoomId(roomId)
                .map(room -> !room.hasExpired() && room.getStatus() != MeetingRoom.RoomStatus.ENDED)
                .orElse(false);
    }
}
