package com.thephysc.modules.video.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignalingMessageDto {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    private String sessionId;
    private String from;
    private String to;
    private String type; // "offer", "answer", "ice-candidate", "new-participant", "participant-left"
    private Object data;
    
    public String toJson() {
        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            return "{}";
        }
    }
    
    public static SignalingMessageDto fromJson(String json) {
        try {
            return objectMapper.readValue(json, SignalingMessageDto.class);
        } catch (JsonProcessingException e) {
            return new SignalingMessageDto();
        }
    }
}
