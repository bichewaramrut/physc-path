package com.thephysc.modules.consultations.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationDto {
    private Long id;
    private Long appointmentId;
    private Long doctorId;
    private String doctorName;
    private Long patientId;
    private String patientName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String doctorNotes;
    private String recordingUrl;
    private String videoSessionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
