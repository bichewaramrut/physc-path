package com.thephysc.modules.auth.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service to handle OTP generation, verification and storage
 */
@Service
public class OtpService {
    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    
    // In-memory OTP storage: {phone -> {otp, expiryTime}}
    private final Map<String, Map<String, Object>> otpMap = new ConcurrentHashMap<>();
    
    // OTP validity period in minutes
    private static final int OTP_VALIDITY_MINUTES = 5;
    
    // SecureRandom for OTP generation
    private final SecureRandom random = new SecureRandom();
    
    /**
     * Generate a new OTP for the given phone number
     * 
     * @param phone Phone number
     * @return Generated OTP
     */
    public String generateOtp(String phone) {
        // Generate a 6-digit OTP
        int otpValue = 100000 + random.nextInt(900000);
        String otp = String.valueOf(otpValue);
        
        // Store the OTP with its expiry time
        Map<String, Object> otpData = new HashMap<>();
        otpData.put("otp", otp);
        otpData.put("expiryTime", LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
        
        otpMap.put(phone, otpData);
        
        logger.info("Generated OTP for phone: {}", phone);
        
        // TODO: Integrate with actual SMS service (Twilio, etc.)
        logger.info("Would send OTP {} to phone {}", otp, phone);
        
        return otp;
    }
    
    /**
     * Verify if the provided OTP is valid for the phone number
     * 
     * @param phone Phone number
     * @param otp OTP to verify
     * @return true if valid, false otherwise
     */
    public boolean verifyOtp(String phone, String otp) {
        Map<String, Object> otpData = otpMap.get(phone);
        
        if (otpData == null) {
            logger.warn("No OTP found for phone: {}", phone);
            return false;
        }
        
        String storedOtp = (String) otpData.get("otp");
        LocalDateTime expiryTime = (LocalDateTime) otpData.get("expiryTime");
        
        if (storedOtp == null || expiryTime == null) {
            logger.warn("Invalid OTP data for phone: {}", phone);
            return false;
        }
        
        if (LocalDateTime.now().isAfter(expiryTime)) {
            logger.warn("OTP expired for phone: {}", phone);
            otpMap.remove(phone);
            return false;
        }
        
        boolean isValid = storedOtp.equals(otp);
        
        if (isValid) {
            // Remove OTP after successful verification
            otpMap.remove(phone);
            logger.info("OTP verified successfully for phone: {}", phone);
        } else {
            logger.warn("Invalid OTP provided for phone: {}", phone);
        }
        
        return isValid;
    }
    
    /**
     * Clear expired OTPs from the cache
     * Can be scheduled to run periodically
     */
    public void clearExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();
        
        otpMap.entrySet().removeIf(entry -> {
            Map<String, Object> otpData = entry.getValue();
            LocalDateTime expiryTime = (LocalDateTime) otpData.get("expiryTime");
            return expiryTime != null && now.isAfter(expiryTime);
        });
        
        logger.info("Cleared expired OTPs");
    }
}
