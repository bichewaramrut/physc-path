package com.thephysc.modules.appointments.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {

    private Long id;
    
    private Long patientId;
    private String patientName;
    private String patientEmail;
    
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialty;
    
    @NotNull(message = "Appointment date is required")
    @Future(message = "Appointment date must be in the future")
    private LocalDateTime appointmentDate;
    
    private LocalDateTime endTime;
    
    private String status;
    
    @Size(max = 500, message = "Reason must be less than 500 characters")
    private String reason;
    
    @NotNull(message = "Consultation type is required")
    private String consultationType; // VIDEO, CHAT, IN_PERSON
    
    private String cancellationReason;
    
    private Double consultationFee;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
