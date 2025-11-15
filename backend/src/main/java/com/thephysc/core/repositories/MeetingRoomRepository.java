package com.thephysc.core.repositories;

import com.thephysc.core.entities.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {

    Optional<MeetingRoom> findByRoomId(String roomId);

    List<MeetingRoom> findByHostId(Long hostId);

    List<MeetingRoom> findByStatus(MeetingRoom.RoomStatus status);

    @Query("SELECT mr FROM MeetingRoom mr WHERE mr.status = :status AND mr.scheduledStartTime BETWEEN :startTime AND :endTime")
    List<MeetingRoom> findByStatusAndScheduledTimeBetween(
            @Param("status") MeetingRoom.RoomStatus status,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT mr FROM MeetingRoom mr WHERE mr.scheduledEndTime < :currentTime AND mr.status = 'ACTIVE'")
    List<MeetingRoom> findExpiredActiveMeetings(@Param("currentTime") LocalDateTime currentTime);

    @Query("SELECT COUNT(p) FROM MeetingParticipant p WHERE p.meetingRoom.roomId = :roomId AND p.status = 'CONNECTED'")
    Long countActiveParticipants(@Param("roomId") String roomId);

    boolean existsByRoomId(String roomId);
}
