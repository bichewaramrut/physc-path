package com.thephysc.core.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String specialty;

    @Column(nullable = false)
    private String license;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "consultation_fee")
    private Double consultationFee;
    
    @ElementCollection
    @CollectionTable(name = "doctor_specializations", joinColumns = @JoinColumn(name = "doctor_id"))
    @Column(name = "specialization")
    private Set<String> specializations = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "doctor_education", joinColumns = @JoinColumn(name = "doctor_id"))
    private Set<Education> education = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "doctor_certifications", joinColumns = @JoinColumn(name = "doctor_id"))
    private Set<Certification> certifications = new HashSet<>();

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "rating_count")
    private Integer ratingCount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Embedded class for education details
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Education {
        private String degree;
        private String institution;
        private Integer year;
    }

    // Embedded class for certifications
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Certification {
        private String name;
        private String issuingAuthority;
        private Integer year;
    }
}
