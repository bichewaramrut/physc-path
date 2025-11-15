package com.thephysc.config;

import com.thephysc.modules.video.websocket.WebRTCSignalingHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebRTCSignalingHandler webRTCSignalingHandler;

    @Autowired
    public WebSocketConfig(WebRTCSignalingHandler webRTCSignalingHandler) {
        this.webRTCSignalingHandler = webRTCSignalingHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webRTCSignalingHandler, "/api/ws/rtc")
                .setAllowedOrigins("*"); // In production, restrict to specific origins
    }
}
