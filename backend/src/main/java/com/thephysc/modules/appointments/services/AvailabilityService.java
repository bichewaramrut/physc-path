package com.thephysc.modules.appointments.services;

import com.thephysc.core.entities.Appointment;
import com.thephysc.core.entities.Doctor;
import com.thephysc.core.repositories.AppointmentRepository;
import com.thephysc.core.repositories.DoctorRepository;
import com.thephysc.modules.appointments.dto.AvailabilityDto;
import com.thephysc.modules.appointments.dto.TimeSlotDto;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public AvailabilityService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public AvailabilityDto getDoctorAvailabilityForDate(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));

        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);

        List<Appointment> existingAppointments = appointmentRepository.findByDoctor_IdAndAppointmentDateBetween(
                doctorId, startOfDay, endOfDay);

        // Get doctor's working hours (assuming 9 AM to 5 PM by default)
        // In a real application, this would come from the doctor's profile or schedule
        LocalTime workStartTime = LocalTime.of(9, 0);
        LocalTime workEndTime = LocalTime.of(17, 0);

        // Generate all possible time slots (assuming 1-hour slots)
        List<TimeSlotDto> allTimeSlots = generateTimeSlots(date, workStartTime, workEndTime);

        // Remove booked slots
        List<TimeSlotDto> availableSlots = filterAvailableSlots(allTimeSlots, existingAppointments);

        AvailabilityDto availabilityDto = new AvailabilityDto();
        availabilityDto.setDoctorId(doctorId);
        availabilityDto.setDoctorName(doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName());
        availabilityDto.setAvailability(new java.util.HashMap<>());
        availabilityDto.getAvailability().put(date, availableSlots);
        
        return availabilityDto;
    }

    public List<TimeSlotDto> getAvailableTimeSlots(Long doctorId, LocalDate date) {
        return getDoctorAvailabilityForDate(doctorId, date).getAvailability().get(date);
    }

    public boolean isTimeSlotAvailable(Long doctorId, LocalDateTime startTime, LocalDateTime endTime) {
        // Check if there are any overlapping appointments
        List<Appointment> overlappingAppointments = appointmentRepository.findOverlappingAppointments(
                doctorId, startTime, endTime);
        
        return overlappingAppointments.isEmpty();
    }

    private List<TimeSlotDto> generateTimeSlots(LocalDate date, LocalTime startTime, LocalTime endTime) {
        List<TimeSlotDto> slots = new ArrayList<>();
        LocalTime currentTime = startTime;

        while (currentTime.plusHours(1).isBefore(endTime) || currentTime.plusHours(1).equals(endTime)) {
            LocalDateTime slotStart = LocalDateTime.of(date, currentTime);
            LocalDateTime slotEnd = slotStart.plusHours(1);
            
            TimeSlotDto timeSlot = new TimeSlotDto();
            timeSlot.setStartTime(slotStart);
            timeSlot.setEndTime(slotEnd);
            timeSlot.setAvailable(true);
            
            slots.add(timeSlot);
            currentTime = currentTime.plusHours(1);
        }

        return slots;
    }

    private List<TimeSlotDto> filterAvailableSlots(List<TimeSlotDto> allSlots, List<Appointment> bookedAppointments) {
        // Create a list of booked time ranges
        List<TimeSlotDto> bookedSlots = bookedAppointments.stream()
                .map(appointment -> {
                    TimeSlotDto timeSlot = new TimeSlotDto();
                    timeSlot.setStartTime(appointment.getAppointmentDate());
                    timeSlot.setEndTime(appointment.getEndTime());
                    timeSlot.setAvailable(false);
                    return timeSlot;
                })
                .collect(Collectors.toList());

        // Filter out slots that overlap with booked appointments
        return allSlots.stream()
                .filter(slot -> !isSlotOverlapping(slot, bookedSlots))
                .collect(Collectors.toList());
    }

    private boolean isSlotOverlapping(TimeSlotDto slot, List<TimeSlotDto> bookedSlots) {
        return bookedSlots.stream().anyMatch(bookedSlot ->
                (slot.getStartTime().isBefore(bookedSlot.getEndTime()) &&
                        slot.getEndTime().isAfter(bookedSlot.getStartTime())));
    }
}
