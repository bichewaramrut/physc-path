package com.thephysc.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private List<String> roles;
    private String token;
    private String refreshToken;
    private String profileType; // DOCTOR, PATIENT, ADMIN
    private Long profileId; // doctorId or patientId if applicable
}
