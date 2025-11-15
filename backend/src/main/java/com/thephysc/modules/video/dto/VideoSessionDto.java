package com.thephysc.modules.video.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoSessionDto {
    private Long id;
    private String sessionId;
    private String provider;
    private String status;
    private Long consultationId;
    private Long doctorId;
    private String doctorName;
    private Long patientId;
    private String patientName;
    private LocalDateTime createdAt;
    private LocalDateTime lastAccessedAt;
}
