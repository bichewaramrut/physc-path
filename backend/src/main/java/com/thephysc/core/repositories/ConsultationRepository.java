package com.thephysc.core.repositories;

import com.thephysc.core.entities.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    Page<Consultation> findByAppointment_Patient_Id(Long patientId, Pageable pageable);
    
    Page<Consultation> findByAppointment_Doctor_Id(Long doctorId, Pageable pageable);
    
    Page<Consultation> findByAppointment_Patient_IdAndStatus(
            Long patientId, 
            Consultation.ConsultationStatus status, 
            Pageable pageable);
    
    Page<Consultation> findByAppointment_Doctor_IdAndStatus(
            Long doctorId, 
            Consultation.ConsultationStatus status, 
            Pageable pageable);
            
    Consultation findByAppointment_Id(Long appointmentId);
}
