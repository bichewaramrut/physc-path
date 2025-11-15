package com.thephysc.modules.auth.controllers;

import com.thephysc.modules.auth.dto.*;
import com.thephysc.modules.auth.services.AuthService;
import com.thephysc.modules.auth.services.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping({"/auth", "/api/auth"}) // Support both paths for flexibility
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;

    public AuthController(AuthService authService, OtpService otpService) {
        this.authService = authService;
        this.otpService = otpService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        LoginResponse response = authService.register(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        TokenResponse response = authService.refreshToken(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/send-otp")
    public ResponseEntity<OtpResponse> sendOtp(@Valid @RequestBody OtpRequest request) {
        try {
            String otp = otpService.generateOtp(request.getPhone());
            // In a real environment, OTP would be sent via SMS and not returned in the response
            return ResponseEntity.ok(OtpResponse.success("OTP sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(OtpResponse.failure("Failed to send OTP: " + e.getMessage()));
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<OtpResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.verifyOtp(request.getPhone(), request.getOtp());
        
        if (isValid) {
            return ResponseEntity.ok(OtpResponse.success("OTP verified successfully"));
        } else {
            return ResponseEntity.badRequest().body(OtpResponse.failure("Invalid or expired OTP"));
        }
    }
}
