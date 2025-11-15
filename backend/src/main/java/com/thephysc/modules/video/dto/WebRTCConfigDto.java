package com.thephysc.modules.video.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebRTCConfigDto {
    private List<IceServer> iceServers = new ArrayList<>();
    private boolean forceTurn = false;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IceServer {
        private String[] urls;
        private String username;
        private String credential;
    }
}
