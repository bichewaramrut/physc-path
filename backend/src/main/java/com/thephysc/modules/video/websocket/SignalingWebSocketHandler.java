package com.thephysc.modules.video.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class SignalingWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Store sessions by sessionId
    private final Map<String, Map<String, WebSocketSession>> sessionRooms = new ConcurrentHashMap<>();
    
    // Store session to room mapping
    private final Map<String, String> sessionToRoom = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(@NonNull WebSocketSession session) throws Exception {
        String sessionId = getSessionId(session);
        if (sessionId == null) {
            session.close(CloseStatus.BAD_DATA.withReason("Missing sessionId parameter"));
            return;
        }

        log.info("WebSocket connection established for session: {}, websocket session: {}", 
                sessionId, session.getId());

        // Add session to room
        sessionRooms.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>())
                   .put(session.getId(), session);
        sessionToRoom.put(session.getId(), sessionId);

        // Send connection confirmation
        sendMessage(session, Map.of(
            "type", "connected",
            "sessionId", sessionId,
            "message", "Connected to signaling server"
        ));
    }

    @Override
    protected void handleTextMessage(@NonNull WebSocketSession session, @NonNull TextMessage message) throws Exception {
        String sessionId = sessionToRoom.get(session.getId());
        if (sessionId == null) {
            log.error("Session not found for websocket: {}", session.getId());
            return;
        }

        try {
            // Parse the message
            @SuppressWarnings("unchecked")
            Map<String, Object> messageData = objectMapper.readValue(message.getPayload(), Map.class);
            String messageType = (String) messageData.get("type");
            
            log.info("Received message type: {} for session: {}", messageType, sessionId);

            // Broadcast to all other participants in the same room
            Map<String, WebSocketSession> roomSessions = sessionRooms.get(sessionId);
            if (roomSessions != null) {
                for (Map.Entry<String, WebSocketSession> entry : roomSessions.entrySet()) {
                    WebSocketSession targetSession = entry.getValue();
                    
                    // Don't send back to the sender
                    if (!targetSession.getId().equals(session.getId()) && targetSession.isOpen()) {
                        sendMessage(targetSession, messageData);
                    }
                }
            }

        } catch (Exception e) {
            log.error("Error handling message: {}", e.getMessage());
            sendMessage(session, Map.of(
                "type", "error",
                "message", "Failed to process message: " + e.getMessage()
            ));
        }
    }

    @Override
    public void afterConnectionClosed(@NonNull WebSocketSession session, @NonNull CloseStatus status) throws Exception {
        String sessionId = sessionToRoom.remove(session.getId());
        if (sessionId != null) {
            Map<String, WebSocketSession> roomSessions = sessionRooms.get(sessionId);
            if (roomSessions != null) {
                roomSessions.remove(session.getId());
                
                // Notify other participants that someone left
                for (WebSocketSession otherSession : roomSessions.values()) {
                    if (otherSession.isOpen()) {
                        sendMessage(otherSession, Map.of(
                            "type", "participant-left",
                            "sessionId", session.getId()
                        ));
                    }
                }
                
                // Clean up empty rooms
                if (roomSessions.isEmpty()) {
                    sessionRooms.remove(sessionId);
                }
            }
        }
        
        log.info("WebSocket connection closed for session: {}, reason: {}", sessionId, status.getReason());
    }

    @Override
    public void handleTransportError(@NonNull WebSocketSession session, @NonNull Throwable exception) throws Exception {
        log.error("WebSocket transport error for session: {}", session.getId(), exception);
        if (session.isOpen()) {
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    private String getSessionId(WebSocketSession session) {
        if (session.getUri() == null) {
            return null;
        }
        String query = session.getUri().getQuery();
        if (query != null) {
            for (String param : query.split("&")) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2 && "sessionId".equals(keyValue[0])) {
                    return keyValue[1];
                }
            }
        }
        return null;
    }

    private void sendMessage(WebSocketSession session, Object message) {
        try {
            if (session.isOpen()) {
                String jsonMessage = objectMapper.writeValueAsString(message);
                session.sendMessage(new TextMessage(jsonMessage));
            }
        } catch (IOException e) {
            log.error("Failed to send message to session: {}", session.getId(), e);
        }
    }

    public int getActiveParticipants(String sessionId) {
        Map<String, WebSocketSession> roomSessions = sessionRooms.get(sessionId);
        return roomSessions != null ? roomSessions.size() : 0;
    }

    public void broadcastToSession(String sessionId, Object message) {
        Map<String, WebSocketSession> roomSessions = sessionRooms.get(sessionId);
        if (roomSessions != null) {
            for (WebSocketSession session : roomSessions.values()) {
                sendMessage(session, message);
            }
        }
    }
}
