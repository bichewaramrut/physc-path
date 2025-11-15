package com.thephysc.modules.appointments.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityDto {

    private Long doctorId;
    private String doctorName;
    private Map<LocalDate, List<TimeSlotDto>> availability;
}
