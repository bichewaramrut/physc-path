package com.thephysc.modules.files.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileUploadResponse {
    private String fileId;
    private String url;
    private boolean success;
    private String message;
    
    // Additional fields for frontend display and validation
    private String contentType;
    private String originalName;
    private Long fileSize;
    private Integer width;
    private Integer height;
    private String thumbnailUrl;
}
