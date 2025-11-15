package com.thephysc.core.repositories;

import com.thephysc.core.entities.MeetingParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingParticipantRepository extends JpaRepository<MeetingParticipant, Long> {

    List<MeetingParticipant> findByMeetingRoomRoomId(String roomId);

    Optional<MeetingParticipant> findByMeetingRoomRoomIdAndParticipantId(String roomId, String participantId);

    List<MeetingParticipant> findByMeetingRoomRoomIdAndStatus(String roomId, MeetingParticipant.ParticipantStatus status);

    @Query("SELECT p FROM MeetingParticipant p WHERE p.meetingRoom.roomId = :roomId AND p.status = 'CONNECTED'")
    List<MeetingParticipant> findActiveParticipants(@Param("roomId") String roomId);

    @Query("SELECT COUNT(p) FROM MeetingParticipant p WHERE p.meetingRoom.roomId = :roomId AND p.status = 'CONNECTED'")
    Long countActiveParticipants(@Param("roomId") String roomId);

    boolean existsByMeetingRoomRoomIdAndParticipantId(String roomId, String participantId);
}
