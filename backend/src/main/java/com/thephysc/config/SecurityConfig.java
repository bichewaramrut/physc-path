package com.thephysc.config;

import com.thephysc.modules.auth.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().configurationSource(corsConfigurationSource())
            .and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                // Public endpoints
                .antMatchers("/api/auth/**", "/auth/**").permitAll()
                .antMatchers("/api/public/**", "/public/**").permitAll()
                .antMatchers("/actuator/health").permitAll()
                .antMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()   ;
//                .antMatchers("/camunda/**").hasRole("ADMIN")
//                // Role-based endpoints
//                .antMatchers("/api/doctors/**").hasAnyRole("ADMIN", "DOCTOR")
//                .antMatchers("/api/patients/**").hasAnyRole("ADMIN", "DOCTOR", "PATIENT")
//                .antMatchers(HttpMethod.GET, "/api/appointments/**").hasAnyRole("ADMIN", "DOCTOR", "PATIENT")
//                .antMatchers(HttpMethod.POST, "/api/appointments/**").hasAnyRole("ADMIN", "PATIENT")
//                .antMatchers(HttpMethod.PUT, "/api/appointments/**").hasAnyRole("ADMIN", "DOCTOR")
//                .antMatchers(HttpMethod.DELETE, "/api/appointments/**").hasAnyRole("ADMIN")
//                .antMatchers("/api/consultations/**").hasAnyRole("ADMIN", "DOCTOR", "PATIENT")
//                .antMatchers("/api/video/**").hasAnyRole("ADMIN", "DOCTOR", "PATIENT")
//                // Secured by default
//                .anyRequest().authenticated()
//            .and()
//            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://thephysc.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
