package com.thephysc.modules.consultations.controllers;

import com.thephysc.modules.consultations.dto.ConsultationDto;
import com.thephysc.modules.consultations.dto.ConsultationNotes;
import com.thephysc.modules.consultations.dto.StartConsultationRequest;
import com.thephysc.modules.consultations.services.ConsultationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @PostMapping("/start")
    public ResponseEntity<ConsultationDto> startConsultation(@Valid @RequestBody StartConsultationRequest request) {
        ConsultationDto consultationDto = consultationService.startConsultation(request.getAppointmentId());
        return new ResponseEntity<>(consultationDto, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<ConsultationDto> endConsultation(
            @PathVariable Long id, 
            @Valid @RequestBody ConsultationNotes notes) {
        ConsultationDto consultationDto = consultationService.endConsultation(id, notes);
        return ResponseEntity.ok(consultationDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultationDto> getConsultation(@PathVariable Long id) {
        ConsultationDto consultationDto = consultationService.getConsultation(id);
        return ResponseEntity.ok(consultationDto);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<Page<ConsultationDto>> getDoctorConsultations(
            @PathVariable Long doctorId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ConsultationDto> consultations = consultationService.getDoctorConsultations(doctorId, status, pageable);
        return ResponseEntity.ok(consultations);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Page<ConsultationDto>> getPatientConsultations(
            @PathVariable Long patientId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<ConsultationDto> consultations = consultationService.getPatientConsultations(patientId, status, pageable);
        return ResponseEntity.ok(consultations);
    }

    @PutMapping("/{id}/notes")
    public ResponseEntity<ConsultationDto> updateConsultationNotes(
            @PathVariable Long id, 
            @Valid @RequestBody ConsultationNotes notes) {
        ConsultationDto consultationDto = consultationService.updateConsultationNotes(id, notes);
        return ResponseEntity.ok(consultationDto);
    }
}
