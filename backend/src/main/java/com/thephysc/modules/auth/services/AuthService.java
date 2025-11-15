package com.thephysc.modules.auth.services;

import com.thephysc.core.entities.Doctor;
import com.thephysc.core.entities.Patient;
import com.thephysc.core.entities.User;
import com.thephysc.core.repositories.DoctorRepository;
import com.thephysc.core.repositories.PatientRepository;
import com.thephysc.core.repositories.UserRepository;
import com.thephysc.modules.auth.dto.LoginRequest;
import com.thephysc.modules.auth.dto.LoginResponse;
import com.thephysc.modules.auth.dto.RegisterRequest;
import com.thephysc.modules.auth.dto.TokenResponse;
import com.thephysc.modules.auth.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtTokenProvider jwtTokenProvider,
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Update last login timestamp
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Generate tokens
        String token = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        // Check if user is a doctor or patient
        String profileType = "ADMIN";
        Long profileId = null;
        
        if (user.getRoles().contains("ROLE_DOCTOR")) {
            profileType = "DOCTOR";
            Doctor doctor = doctorRepository.findByUser_Id(user.getId())
                    .orElse(null);
            if (doctor != null) {
                profileId = doctor.getId();
            }
        } else if (user.getRoles().contains("ROLE_PATIENT")) {
            profileType = "PATIENT";
            Patient patient = patientRepository.findByUser_Id(user.getId())
                    .orElse(null);
            if (patient != null) {
                profileId = patient.getId();
            }
        }

        return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(new ArrayList<>(user.getRoles()))
                .token(token)
                .refreshToken(refreshToken)
                .profileType(profileType)
                .profileId(profileId)
                .build();
    }

    @Transactional
    public LoginResponse register(RegisterRequest registerRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        // Create user entity
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPhone(registerRequest.getPhone());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        // Set roles
        Set<String> roles = new HashSet<>();
        roles.add(registerRequest.getRole());
        user.setRoles(roles);

        // Save user
        User savedUser = userRepository.save(user);

        // Create profile based on role
        Long profileId = null;
        if (registerRequest.getRole().equals("ROLE_DOCTOR")) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setSpecialty(registerRequest.getSpecialty());
            doctor.setLicense(registerRequest.getLicense());
            doctor.setYearsOfExperience(registerRequest.getYearsOfExperience());
            doctor.setBio(registerRequest.getBio());
            doctor.setConsultationFee(registerRequest.getConsultationFee());
            doctor.setCreatedAt(LocalDateTime.now());
            doctor.setSpecializations(new HashSet<>());
            doctor.setEducation(new HashSet<>());
            doctor.setCertifications(new HashSet<>());
            doctor.setAverageRating(0.0);
            doctor.setRatingCount(0);
            
            Doctor savedDoctor = doctorRepository.save(doctor);
            profileId = savedDoctor.getId();
        } else if (registerRequest.getRole().equals("ROLE_PATIENT")) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setGender(registerRequest.getGender());
            patient.setEmergencyContactName(registerRequest.getEmergencyContactName());
            patient.setEmergencyContactPhone(registerRequest.getEmergencyContactPhone());
            patient.setEmergencyContactRelationship(registerRequest.getEmergencyContactRelationship());
            patient.setCreatedAt(LocalDateTime.now());
            
            if (registerRequest.getDateOfBirth() != null && !registerRequest.getDateOfBirth().isEmpty()) {
                LocalDateTime dateOfBirth = LocalDateTime.parse(registerRequest.getDateOfBirth(), 
                        DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                patient.setDateOfBirth(dateOfBirth);
            }
            
            Patient savedPatient = patientRepository.save(patient);
            profileId = savedPatient.getId();
        }

        // Generate authentication for token creation
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        
        // Create a UserDetails object for the principal
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.isActive(),
                true,
                true,
                true,
                authorities
        );
        
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, authorities);

        // Generate tokens
        String token = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        return LoginResponse.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .roles(new ArrayList<>(savedUser.getRoles()))
                .token(token)
                .refreshToken(refreshToken)
                .profileType(registerRequest.getRole().replace("ROLE_", ""))
                .profileId(profileId)
                .build();
    }

    public TokenResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken) || !jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String email = jwtTokenProvider.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        String authorities = String.join(",", user.getRoles());
        String newAccessToken = jwtTokenProvider.generateToken(email, authorities);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

        return TokenResponse.builder()
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(3600) // 1 hour in seconds
                .build();
    }
}
