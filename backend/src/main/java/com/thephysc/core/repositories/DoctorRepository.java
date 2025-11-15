package com.thephysc.core.repositories;

import com.thephysc.core.entities.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    Optional<Doctor> findByUser_Id(Long userId);
    
    Optional<Doctor> findByUser_Email(String email);
    
    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.specialty) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.user.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.user.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Doctor> searchDoctors(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT DISTINCT d FROM Doctor d JOIN d.specializations s WHERE s = :specialization")
    List<Doctor> findBySpecialization(@Param("specialization") String specialization);
    
    @Query("SELECT d FROM Doctor d ORDER BY d.averageRating DESC")
    Page<Doctor> findTopRatedDoctors(Pageable pageable);
}
