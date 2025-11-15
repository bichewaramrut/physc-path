package com.thephysc.modules.video.websocket;

import com.thephysc.modules.auth.security.JwtTokenProvider;
import com.thephysc.modules.video.dto.SignalingMessageDto;
import com.thephysc.modules.video.services.WebRTCService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebRTCSignalingHandler extends TextWebSocketHandler {

    private final WebRTCService webRTCService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final Map<String, SessionInfo> sessionMap = new ConcurrentHashMap<>();

    public WebRTCSignalingHandler(
            WebRTCService webRTCService,
            JwtTokenProvider jwtTokenProvider,
            UserDetailsService userDetailsService) {
        this.webRTCService = webRTCService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String sessionId = extractSessionId(session);
        String token = extractToken(session);
        
        if (sessionId != null && validateToken(token)) {
            String participantId = jwtTokenProvider.extractEmail(token);
            sessionMap.put(session.getId(), new SessionInfo(sessionId, participantId));
            webRTCService.registerSession(sessionId, participantId, session);
        } else {
            try {
                session.close(CloseStatus.POLICY_VIOLATION);
            } catch (IOException e) {
                // Log error
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        SessionInfo info = sessionMap.get(session.getId());
        if (info != null) {
            SignalingMessageDto signalingMessage = SignalingMessageDto.fromJson(message.getPayload());
            // Validate that the message is for the correct session
            if (info.getSessionId().equals(signalingMessage.getSessionId())) {
                // Set the sender ID to ensure security
                signalingMessage.setFrom(info.getParticipantId());
                webRTCService.handleSignalingMessage(signalingMessage);
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        SessionInfo info = sessionMap.remove(session.getId());
        if (info != null) {
            webRTCService.handleSessionClosed(info.getSessionId(), info.getParticipantId(), status);
        }
    }

    private String extractSessionId(WebSocketSession session) {
        return UriComponentsBuilder.fromUri(session.getUri())
                .build()
                .getQueryParams()
                .getFirst("sessionId");
    }

    private String extractToken(WebSocketSession session) {
        return UriComponentsBuilder.fromUri(session.getUri())
                .build()
                .getQueryParams()
                .getFirst("token");
    }

    private boolean validateToken(String token) {
        if (token == null) {
            return false;
        }

        try {
            if (jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.extractEmail(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                
                // Create authentication token with the userDetails object (not a string)
                Authentication auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                
                return auth.isAuthenticated();
            }
        } catch (Exception e) {
          //  logger.error("Error validating WebRTC token", e);
        }

        return false;
    }

    private static class SessionInfo {
        private final String sessionId;
        private final String participantId;

        public SessionInfo(String sessionId, String participantId) {
            this.sessionId = sessionId;
            this.participantId = participantId;
        }

        public String getSessionId() {
            return sessionId;
        }

        public String getParticipantId() {
            return participantId;
        }
    }
}
