package com.thephysc.modules.video.controllers;

import com.thephysc.modules.video.dto.VideoSessionDto;
import com.thephysc.modules.video.dto.VideoTokenResponse;
import com.thephysc.modules.video.dto.WebRTCConfigDto;
import com.thephysc.modules.video.services.VideoSessionService;
import com.thephysc.modules.video.services.WebRTCService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/video")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VideoSessionController {

    private final VideoSessionService videoSessionService;
    private final WebRTCService webRTCService;

    public VideoSessionController(VideoSessionService videoSessionService, WebRTCService webRTCService) {
        this.videoSessionService = videoSessionService;
        this.webRTCService = webRTCService;
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<VideoSessionDto> getVideoSession(@PathVariable String sessionId) {
        VideoSessionDto videoSessionDto = videoSessionService.getVideoSession(sessionId);
        return ResponseEntity.ok(videoSessionDto);
    }

    @GetMapping("/consultations/{consultationId}")
    public ResponseEntity<VideoSessionDto> getVideoSessionForConsultation(@PathVariable Long consultationId) {
        VideoSessionDto videoSessionDto = videoSessionService.getVideoSessionForConsultation(consultationId);
        return ResponseEntity.ok(videoSessionDto);
    }

    @GetMapping("/token/{sessionId}")
    public ResponseEntity<VideoTokenResponse> generateToken(
            @PathVariable String sessionId, 
            Authentication authentication) {
        String identity = authentication.getName();
        VideoTokenResponse tokenResponse = videoSessionService.generateToken(sessionId, identity);
        return ResponseEntity.ok(tokenResponse);
    }
    
    @GetMapping("/webrtc-config")
    public ResponseEntity<WebRTCConfigDto> getWebRTCConfig() {
        WebRTCConfigDto config = webRTCService.getWebRTCConfig();
        return ResponseEntity.ok(config);
    }
    
    @GetMapping("/join/{sessionId}")
    public ResponseEntity<Map<String, String>> getJoinInfo(
            @PathVariable String sessionId,
            Authentication authentication) {
        // Get the session details and verify access
        VideoSessionDto sessionDto = videoSessionService.getVideoSession(sessionId);
        
        // Generate a token that will be used for WebSocket authentication
        String identity = authentication.getName();
        VideoTokenResponse tokenResponse = videoSessionService.generateToken(sessionId, identity);
        
        // Return information needed to join the call
        Map<String, String> joinInfo = Map.of(
            "sessionId", sessionId,
            "token", tokenResponse.getToken(),
            "wsUrl", "/api/ws/rtc?sessionId=" + sessionId + "&token=" + tokenResponse.getToken()
        );
        
        return ResponseEntity.ok(joinInfo);
    }
}
