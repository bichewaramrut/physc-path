package com.thephysc.modules.auth.security;

import com.thephysc.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private final JwtConfig jwtConfig;

    public JwtTokenProvider(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return generateToken(userDetails.getUsername(), authorities);
    }

    public String generateToken(String email, String authorities) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("authorities", authorities);
        return createToken(claims, email);
    }

    public String generateRefreshToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("refreshToken", true);
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfig.getExpiration());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    private Key getSigningKey() {
        // Get the configured secret from properties
        String configuredSecret = jwtConfig.getSecret();
        byte[] keyBytes = configuredSecret.getBytes(StandardCharsets.UTF_8);
        
        // If the key is already 512 bits or larger, use it directly
        if (keyBytes.length >= 64) { // 64 bytes = 512 bits
            return Keys.hmacShaKeyFor(keyBytes);
        } 
        
        // Otherwise, derive a secure 512-bit key using PBKDF2
        try {
            // Use PBKDF2 to derive a key of the correct size
            javax.crypto.SecretKeyFactory factory = javax.crypto.SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512");
            javax.crypto.spec.PBEKeySpec spec = new javax.crypto.spec.PBEKeySpec(
                configuredSecret.toCharArray(), 
                "ThePhyscJwtSalt".getBytes(StandardCharsets.UTF_8), // Use a fixed salt
                10000,  // Number of iterations
                512     // Key length in bits
            );
            javax.crypto.SecretKey secretKey = factory.generateSecret(spec);
            return new javax.crypto.spec.SecretKeySpec(secretKey.getEncoded(), "HmacSHA512");
        } catch (Exception e) {
            // Fallback to simple key derivation if PBKDF2 fails
            // This is less secure but better than nothing
            byte[] paddedKey = new byte[64]; // 512 bits = 64 bytes
            System.arraycopy(keyBytes, 0, paddedKey, 0, Math.min(keyBytes.length, paddedKey.length));
            // Fill the rest with a repeating pattern based on the secret
            for (int i = keyBytes.length; i < paddedKey.length; i++) {
                paddedKey[i] = keyBytes[i % keyBytes.length];
            }
            return Keys.hmacShaKeyFor(paddedKey);
        }
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String extractAuthorities(String token) {
        return (String) extractAllClaims(token).get("authorities");
    }

    public boolean isRefreshToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.containsKey("refreshToken") && (boolean) claims.get("refreshToken");
    }
    
    /**
     * Extract username (email) from token
     * @param token JWT token
     * @return username/email extracted from token
     */
    public String getUserNameFromToken(String token) {
        return extractEmail(token);
    }
}
