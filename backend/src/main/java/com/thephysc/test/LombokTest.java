package com.thephysc.test;

import com.thephysc.core.entities.MeetingRoom;
import com.thephysc.modules.video.dto.JoinMeetingRequest;

public class LombokTest {
    
    public void testLombok() {
        // Test @Data annotation - should generate getters/setters
        MeetingRoom room = new MeetingRoom();
        room.setRoomName("Test Room");  // This should work if Lombok is generating setters
        String name = room.getRoomName(); // This should work if Lombok is generating getters
        
        // Test @Builder annotation
        JoinMeetingRequest request = JoinMeetingRequest.builder()
            .roomId("room123")
            .participantId("user123")
            .participantName("John Doe")
            .build();
            
        String roomId = request.getRoomId(); // This should work if Lombok is generating getters
    }
}
