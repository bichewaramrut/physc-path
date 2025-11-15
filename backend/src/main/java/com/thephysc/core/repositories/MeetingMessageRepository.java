package com.thephysc.core.repositories;

import com.thephysc.core.entities.MeetingMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeetingMessageRepository extends JpaRepository<MeetingMessage, Long> {

    List<MeetingMessage> findByMeetingRoomRoomIdOrderByCreatedAtAsc(String roomId);

    List<MeetingMessage> findByMeetingRoomRoomIdAndMessageType(String roomId, MeetingMessage.MessageType messageType);

    @Query("SELECT m FROM MeetingMessage m WHERE m.meetingRoom.roomId = :roomId AND m.createdAt BETWEEN :startTime AND :endTime ORDER BY m.createdAt ASC")
    List<MeetingMessage> findByRoomIdAndTimeRange(
            @Param("roomId") String roomId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT COUNT(m) FROM MeetingMessage m WHERE m.meetingRoom.roomId = :roomId")
    Long countMessagesByRoomId(@Param("roomId") String roomId);

    @Query("SELECT m FROM MeetingMessage m WHERE m.meetingRoom.roomId = :roomId AND m.messageType IN ('FILE', 'IMAGE') ORDER BY m.createdAt DESC")
    List<MeetingMessage> findFileMessages(@Param("roomId") String roomId);
}
