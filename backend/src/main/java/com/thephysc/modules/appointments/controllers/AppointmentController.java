package com.thephysc.modules.appointments.controllers;

import com.thephysc.modules.appointments.dto.AppointmentDto;
import com.thephysc.modules.appointments.dto.AvailabilityDto;
import com.thephysc.modules.appointments.dto.CreateAppointmentRequest;
import com.thephysc.modules.appointments.dto.TimeSlotDto;
import com.thephysc.modules.appointments.services.AppointmentService;
import com.thephysc.modules.appointments.services.AvailabilityService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AvailabilityService availabilityService;

    public AppointmentController(AppointmentService appointmentService, AvailabilityService availabilityService) {
        this.appointmentService = appointmentService;
        this.availabilityService = availabilityService;
    }

    @PostMapping
    public ResponseEntity<AppointmentDto> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentDto appointmentDto = appointmentService.createAppointment(request);
        return new ResponseEntity<>(appointmentDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDto> getAppointment(@PathVariable Long id) {
        AppointmentDto appointmentDto = appointmentService.getAppointment(id);
        return ResponseEntity.ok(appointmentDto);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentDto> updateAppointmentStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        AppointmentDto appointmentDto = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(appointmentDto);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Page<AppointmentDto>> getPatientAppointments(
            @PathVariable Long patientId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<AppointmentDto> appointments = appointmentService.getPatientAppointments(patientId, status, pageable);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<Page<AppointmentDto>> getDoctorAppointments(
            @PathVariable Long doctorId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<AppointmentDto> appointments = appointmentService.getDoctorAppointments(doctorId, status, pageable);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}/availability")
    public ResponseEntity<AvailabilityDto> getDoctorAvailability(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        AvailabilityDto availability = availabilityService.getDoctorAvailabilityForDate(doctorId, date);
        return ResponseEntity.ok(availability);
    }

    @GetMapping("/doctor/{doctorId}/available-slots")
    public ResponseEntity<List<TimeSlotDto>> getAvailableTimeSlots(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TimeSlotDto> availableSlots = availabilityService.getAvailableTimeSlots(doctorId, date);
        return ResponseEntity.ok(availableSlots);
    }

    @PostMapping("/{id}/reschedule")
    public ResponseEntity<AppointmentDto> rescheduleAppointment(
            @PathVariable Long id,
            @Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentDto appointmentDto = appointmentService.rescheduleAppointment(id, request);
        return ResponseEntity.ok(appointmentDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
