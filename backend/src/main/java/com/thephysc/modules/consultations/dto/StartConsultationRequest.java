package com.thephysc.modules.consultations.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartConsultationRequest {
    @NotNull
    private Long appointmentId;
}
