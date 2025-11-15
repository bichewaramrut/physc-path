package com.thephysc.modules.video.services;

import com.thephysc.core.entities.VideoSession;
import com.thephysc.core.repositories.VideoSessionRepository;
import com.thephysc.modules.video.dto.WebRTCConfigDto;
import com.thephysc.modules.video.dto.SignalingMessageDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for handling WebRTC connections.
 * This service manages peer connections, ICE candidates, and signaling.
 */
@Service
public class WebRTCService {

    private final VideoSessionRepository videoSessionRepository;
    private final Map<String, Map<String, WebSocketSession>> sessions = new ConcurrentHashMap<>();
    
    @Value("${video.stun.urls:stun:stun.l.google.com:19302}")
    private String stunUrls;
    
    @Value("${video.turn.urls:}")
    private String turnUrls;
    
    @Value("${video.turn.username:}")
    private String turnUsername;
    
    @Value("${video.turn.credential:}")
    private String turnCredential;

    public WebRTCService(VideoSessionRepository videoSessionRepository) {
        this.videoSessionRepository = videoSessionRepository;
    }

    /**
     * Get WebRTC configuration including STUN/TURN servers
     */
    public WebRTCConfigDto getWebRTCConfig() {
        WebRTCConfigDto config = new WebRTCConfigDto();
        
        // Add STUN server
        if (stunUrls != null && !stunUrls.isEmpty()) {
            config.getIceServers().add(
                new WebRTCConfigDto.IceServer(stunUrls.split(","), null, null)
            );
        }
        
        // Add TURN server if configured
        if (turnUrls != null && !turnUrls.isEmpty()) {
            config.getIceServers().add(
                new WebRTCConfigDto.IceServer(turnUrls.split(","), turnUsername, turnCredential)
            );
        }
        
        return config;
    }

    /**
     * Register a new WebSocket session for a specific video session
     */
    public void registerSession(String sessionId, String participantId, WebSocketSession webSocketSession) {
        sessions.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                .put(participantId, webSocketSession);
        
        // Update video session last accessed time
        videoSessionRepository.findBySessionId(sessionId).ifPresent(videoSession -> {
            videoSession.setLastAccessedAt(LocalDateTime.now());
            videoSessionRepository.save(videoSession);
        });
        
        // Notify other participants about the new user
        notifyNewParticipant(sessionId, participantId);
    }

    /**
     * Handle WebRTC signaling message (offer, answer, ice candidate)
     */
    public void handleSignalingMessage(SignalingMessageDto message) throws IOException {
        Map<String, WebSocketSession> sessionParticipants = sessions.get(message.getSessionId());
        
        if (sessionParticipants != null && sessionParticipants.containsKey(message.getTo())) {
            WebSocketSession recipientSession = sessionParticipants.get(message.getTo());
            
            if (recipientSession.isOpen()) {
                recipientSession.sendMessage(new TextMessage(message.toJson()));
            }
        }
    }

    /**
     * Handle WebSocket session closed
     */
    public void handleSessionClosed(String sessionId, String participantId, CloseStatus status) {
        Map<String, WebSocketSession> sessionParticipants = sessions.get(sessionId);
        
        if (sessionParticipants != null) {
            sessionParticipants.remove(participantId);
            
            // If no participants left, remove the session
            if (sessionParticipants.isEmpty()) {
                sessions.remove(sessionId);
            } else {
                // Notify other participants that someone left
                notifyParticipantLeft(sessionId, participantId);
            }
        }
    }

    private void notifyNewParticipant(String sessionId, String participantId) {
        Map<String, WebSocketSession> sessionParticipants = sessions.get(sessionId);
        
        if (sessionParticipants != null) {
            SignalingMessageDto joinMessage = new SignalingMessageDto(
                    sessionId, 
                    "system", 
                    null, 
                    "new-participant", 
                    participantId);
            
            sessionParticipants.forEach((id, session) -> {
                if (!id.equals(participantId) && session.isOpen()) {
                    try {
                        joinMessage.setTo(id);
                        session.sendMessage(new TextMessage(joinMessage.toJson()));
                    } catch (IOException e) {
                        // Log error
                    }
                }
            });
        }
    }

    private void notifyParticipantLeft(String sessionId, String participantId) {
        Map<String, WebSocketSession> sessionParticipants = sessions.get(sessionId);
        
        if (sessionParticipants != null) {
            SignalingMessageDto leaveMessage = new SignalingMessageDto(
                    sessionId, 
                    "system", 
                    null, 
                    "participant-left", 
                    participantId);
            
            sessionParticipants.forEach((id, session) -> {
                if (session.isOpen()) {
                    try {
                        leaveMessage.setTo(id);
                        session.sendMessage(new TextMessage(leaveMessage.toJson()));
                    } catch (IOException e) {
                        // Log error
                    }
                }
            });
        }
    }
}
