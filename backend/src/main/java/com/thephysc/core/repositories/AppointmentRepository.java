package com.thephysc.core.repositories;

import com.thephysc.core.entities.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Page<Appointment> findByPatient_Id(Long patientId, Pageable pageable);
    
    Page<Appointment> findByDoctor_Id(Long doctorId, Pageable pageable);
    
    Page<Appointment> findByPatient_IdAndStatus(Long patientId, Appointment.AppointmentStatus status, Pageable pageable);
    
    Page<Appointment> findByDoctor_IdAndStatus(Long doctorId, Appointment.AppointmentStatus status, Pageable pageable);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate BETWEEN :start AND :end")
    List<Appointment> findDoctorAppointmentsInTimeRange(
            @Param("doctorId") Long doctorId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
    
    List<Appointment> findByDoctor_IdAndAppointmentDateBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND " +
           "((a.appointmentDate < :endTime AND a.endTime > :startTime) OR " +
           "(a.appointmentDate = :startTime))")
    List<Appointment> findOverlappingAppointments(
            @Param("doctorId") Long doctorId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
            
    List<Appointment> findByPatient_IdAndAppointmentDateGreaterThanAndStatus(
            Long patientId, 
            LocalDateTime date, 
            Appointment.AppointmentStatus status);
            
    List<Appointment> findByDoctor_IdAndAppointmentDateGreaterThanAndStatus(
            Long doctorId, 
            LocalDateTime date, 
            Appointment.AppointmentStatus status);
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate BETWEEN :start AND :end AND a.status <> 'CANCELLED'")
    long countDoctorAppointmentsInTimeRange(
            @Param("doctorId") Long doctorId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);
    
    List<Appointment> findByAppointmentDateBetweenAndStatus(
            LocalDateTime startDateTime, 
            LocalDateTime endDateTime, 
            Appointment.AppointmentStatus status);
}
