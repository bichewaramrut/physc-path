package com.thephysc.modules.video.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
@Tag(name = "Video Configuration", description = "APIs for video call configuration and WebRTC settings")
public class VideoController {

    @Value("${app.webrtc.stun.servers:stun:stun.l.google.com:19302}")
    private String stunServers;

    @Value("${app.webrtc.turn.servers:}")
    private String turnServers;

    @Value("${app.webrtc.turn.username:}")
    private String turnUsername;

    @Value("${app.webrtc.turn.credential:}")
    private String turnCredential;

    @GetMapping("/webrtc-config")
    @Operation(summary = "Get WebRTC configuration", description = "Returns STUN/TURN server configuration for WebRTC connections")
    public ResponseEntity<?> getWebRTCConfiguration() {
        try {
            log.info("Fetching WebRTC configuration");
            
            // Build ICE servers configuration
            List<Map<String, Object>> iceServers = new ArrayList<>();
            
            // Add STUN servers
            Map<String, Object> stunServer1 = new HashMap<>();
            stunServer1.put("urls", List.of("stun:stun.l.google.com:19302"));
            iceServers.add(stunServer1);
            
            Map<String, Object> stunServer2 = new HashMap<>();
            stunServer2.put("urls", List.of("stun:stun1.l.google.com:19302"));
            iceServers.add(stunServer2);
            
            Map<String, Object> stunServer3 = new HashMap<>();
            stunServer3.put("urls", List.of("stun:stun2.l.google.com:19302"));
            iceServers.add(stunServer3);

            // Add TURN servers if configured
            if (turnServers != null && !turnServers.isEmpty()) {
                Map<String, Object> turnServer = new HashMap<>();
                turnServer.put("urls", List.of(turnServers));
                turnServer.put("username", turnUsername != null ? turnUsername : "");
                turnServer.put("credential", turnCredential != null ? turnCredential : "");
                iceServers.add(turnServer);
            }

            Map<String, Object> webrtcConfig = new HashMap<>();
            webrtcConfig.put("iceServers", iceServers);
            webrtcConfig.put("iceCandidatePoolSize", 10);
            webrtcConfig.put("bundlePolicy", "max-bundle");
            webrtcConfig.put("rtcpMuxPolicy", "require");
            webrtcConfig.put("iceTransportPolicy", "all");

            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", webrtcConfig,
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            log.error("Error fetching WebRTC configuration: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to fetch WebRTC configuration",
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/health")
    @Operation(summary = "Video service health check", description = "Check if video service is running properly")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Video service is running",
            "timestamp", System.currentTimeMillis(),
            "version", "1.0.0"
        ));
    }

    @GetMapping("/supported-codecs")
    @Operation(summary = "Get supported video codecs", description = "Returns list of supported video/audio codecs")
    public ResponseEntity<?> getSupportedCodecs() {
        var codecs = Map.of(
            "video", List.of("VP8", "VP9", "H264", "AV1"),
            "audio", List.of("OPUS", "G722", "PCMU", "PCMA"),
            "preferredVideo", "VP8",
            "preferredAudio", "OPUS"
        );

        return ResponseEntity.ok(Map.of(
            "success", true,
            "data", codecs
        ));
    }
}
