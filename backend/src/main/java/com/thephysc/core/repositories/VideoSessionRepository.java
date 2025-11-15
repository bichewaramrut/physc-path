package com.thephysc.core.repositories;

import com.thephysc.core.entities.VideoSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VideoSessionRepository extends JpaRepository<VideoSession, Long> {

    Optional<VideoSession> findBySessionId(String sessionId);
    
    Optional<VideoSession> findByConsultation_Id(Long consultationId);
    
    Optional<VideoSession> findBySessionToken(String sessionToken);
}
