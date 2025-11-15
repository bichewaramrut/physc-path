package com.thephysc.modules.appointments.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDto {

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean available;

    public static List<TimeSlotDto> generateTimeSlotsForDay(
            LocalDateTime day, int startHour, int endHour, int durationMinutes) {
        
        List<TimeSlotDto> slots = new ArrayList<>();
        LocalDateTime current = day.withHour(startHour).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime dayEnd = day.withHour(endHour).withMinute(0).withSecond(0).withNano(0);

        while (current.isBefore(dayEnd)) {
            LocalDateTime slotEnd = current.plusMinutes(durationMinutes);
            slots.add(new TimeSlotDto(current, slotEnd, true));
            current = slotEnd;
        }

        return slots;
    }
}
