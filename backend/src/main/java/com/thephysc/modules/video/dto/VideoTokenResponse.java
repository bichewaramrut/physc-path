package com.thephysc.modules.video.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoTokenResponse {
    private String token;
    private String sessionId;
    private String identity;
    private String provider;
}
