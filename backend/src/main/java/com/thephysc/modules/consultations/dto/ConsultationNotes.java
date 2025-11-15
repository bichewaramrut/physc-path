package com.thephysc.modules.consultations.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationNotes {
    @NotNull
    @NotBlank
    @Size(min = 10)
    private String doctorNotes;
}
