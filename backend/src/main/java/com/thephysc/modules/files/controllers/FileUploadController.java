package com.thephysc.modules.files.controllers;

import com.thephysc.modules.files.dto.FileUploadResponse;
import com.thephysc.modules.files.services.StorageFactory;
import com.thephysc.modules.files.services.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/files")
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    private final StorageFactory storageFactory;

    // Define allowed file types for different categories
    private static final List<String> ALLOWED_PROFILE_TYPES = Arrays.asList("image/jpeg", "image/png", "image/jpg");
    private static final List<String> ALLOWED_DOCUMENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/jpg", "application/pdf");
    
    // Define max file sizes (in bytes)
    private static final long MAX_PROFILE_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_DOCUMENT_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public FileUploadController(StorageFactory storageFactory) {
        this.storageFactory = storageFactory;
    }

    /**
     * Upload a file with a specific type (profile, document, etc.)
     */
    @PostMapping(value = "/upload/{fileType}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileUploadResponse> uploadFileByType(
            @PathVariable String fileType,
            @RequestParam("file") MultipartFile file) {
        
        logger.info("File upload request received for type: {}, size: {} bytes", fileType, file.getSize());
        
        InputStream inputStream = null;
        try {
            // Validate file
            FileValidationResult validationResult = validateFile(file, fileType);
            if (!validationResult.isValid()) {
                return ResponseEntity.badRequest().body(
                    FileUploadResponse.builder()
                        .success(false)
                        .message(validationResult.getMessage())
                        .build()
                );
            }

            // Get authenticated user (if any)
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth != null ? auth.getName() : "anonymous";
            
            // Store file in a subdirectory based on type
            String subdirectory = fileType + "/" + username;
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            
            // Get input stream before processing to ensure proper resource handling
            inputStream = file.getInputStream();

            // Process and store file (compression will be done if needed)
            String fileUrl = storageFactory.getStorageService().processAndStoreFile(file, subdirectory, fileName, fileType);
            
            // Return successful response
            FileUploadResponse response = FileUploadResponse.builder()
                    .fileId(fileName)
                    .url(fileUrl)
                    .success(true)
                    .contentType(file.getContentType())
                    .originalName(file.getOriginalFilename())
                    .fileSize(file.getSize())
                    .build();
                    
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Failed to upload file: {}", e.getMessage());
            FileUploadResponse response = FileUploadResponse.builder()
                    .success(false)
                    .message("Failed to upload file: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    logger.warn("Failed to close input stream: {}", e.getMessage());
                }
            }
        }
    }

    /**
     * Upload multiple files of a specific type
     */
    @PostMapping(value = "/upload-multiple/{fileType}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<FileUploadResponse>> uploadMultipleFilesByType(
            @PathVariable String fileType,
            @RequestParam("files") MultipartFile[] files) {
        
        List<FileUploadResponse> responses = new ArrayList<>();
        
        // Get authenticated user (if any)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "anonymous";
        String subdirectory = fileType + "/" + username;
        
        for (MultipartFile file : files) {
            InputStream inputStream = null;
            try {
                // Validate file
                FileValidationResult validationResult = validateFile(file, fileType);
                if (!validationResult.isValid()) {
                    responses.add(FileUploadResponse.builder()
                        .success(false)
                        .message(validationResult.getMessage())
                        .originalName(file.getOriginalFilename())
                        .build());
                    continue;
                }
                
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                
                // Get input stream before processing to ensure proper resource handling
                inputStream = file.getInputStream();

                // Process and store file (compression will be done if needed)
                String fileUrl = storageFactory.getStorageService().processAndStoreFile(file, subdirectory, fileName, fileType);
                
                FileUploadResponse response = FileUploadResponse.builder()
                        .fileId(fileName)
                        .url(fileUrl)
                        .success(true)
                        .contentType(file.getContentType())
                        .originalName(file.getOriginalFilename())
                        .fileSize(file.getSize())
                        .build();
                        
                responses.add(response);
            } catch (IOException e) {
                logger.error("Failed to upload file {}: {}", file.getOriginalFilename(), e.getMessage());
                FileUploadResponse response = FileUploadResponse.builder()
                        .success(false)
                        .message("Failed to upload file: " + e.getMessage())
                        .originalName(file.getOriginalFilename())
                        .build();
                responses.add(response);
            } finally {
                if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException e) {
                        logger.warn("Failed to close input stream: {}", e.getMessage());
                    }
                }
            }
        }
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{fileType}/{username}/{fileId}")
    public ResponseEntity<byte[]> getFile(
            @PathVariable String fileType,
            @PathVariable String username,
            @PathVariable String fileId) {
        try {
            String filePath = fileType + "/" + username + "/" + fileId;
            byte[] fileContent = storageFactory.getStorageService().getFile(filePath);
            String contentType = storageFactory.getStorageService().getContentType(filePath);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(fileContent);
        } catch (IOException e) {
            logger.error("Failed to retrieve file: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Validate file based on category (type and size)
     * @param file The file to validate
     * @param fileType The type of file (profile, document, etc.)
     * @return A validation result with success flag and error message
     */
    private FileValidationResult validateFile(MultipartFile file, String fileType) {
        FileValidationResult result = new FileValidationResult();
        String contentType = file.getContentType();
        long fileSize = file.getSize();
        String fileName = file.getOriginalFilename();
        
        if (contentType == null) {
            return result.setInvalid("File type cannot be determined");
        }
        
        // Check if file is empty
        if (fileSize == 0) {
            return result.setInvalid("File is empty");
        }
        
        // Check file extension
        if (fileName != null && !validateFileExtension(fileName, fileType)) {
            return result.setInvalid("File extension not allowed for " + fileType);
        }
        
        switch (fileType.toLowerCase()) {
            case "profile":
                // Check file type
                if (!ALLOWED_PROFILE_TYPES.contains(contentType)) {
                    return result.setInvalid("File type not allowed. Please upload a JPEG or PNG image");
                }
                
                // Check file size
                if (fileSize > MAX_PROFILE_FILE_SIZE) {
                    return result.setInvalid("File size exceeds the maximum allowed size (5MB)");
                }
                break;
                
            case "document":
                // Check file type
                if (!ALLOWED_DOCUMENT_TYPES.contains(contentType)) {
                    return result.setInvalid("File type not allowed. Please upload a JPEG, PNG or PDF file");
                }
                
                // Check file size
                if (fileSize > MAX_DOCUMENT_FILE_SIZE) {
                    return result.setInvalid("File size exceeds the maximum allowed size (10MB)");
                }
                break;
                
            default:
                // For any other types, use document validation rules
                if (!ALLOWED_DOCUMENT_TYPES.contains(contentType)) {
                    return result.setInvalid("File type not allowed. Please upload a JPEG, PNG or PDF file");
                }
                
                if (fileSize > MAX_DOCUMENT_FILE_SIZE) {
                    return result.setInvalid("File size exceeds the maximum allowed size (10MB)");
                }
        }
        
        return result; // valid by default
    }
    
    /**
     * Validate file extension based on category
     * @param fileName The name of the file
     * @param fileType The type of file (profile, document, etc.)
     * @return True if the file extension is valid for the category
     */
    private boolean validateFileExtension(String fileName, String fileType) {
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        
        switch (fileType.toLowerCase()) {
            case "profile":
                return Arrays.asList("jpg", "jpeg", "png").contains(extension);
            case "document":
                return Arrays.asList("jpg", "jpeg", "png", "pdf").contains(extension);
            default:
                return Arrays.asList("jpg", "jpeg", "png", "pdf").contains(extension);
        }
    }
    
    /**
     * Helper class for file validation results
     */
    private static class FileValidationResult {
        private boolean valid = true;
        private String message = "";
        
        public boolean isValid() {
            return valid;
        }
        
        public String getMessage() {
            return message;
        }
        
        public FileValidationResult setInvalid(String message) {
            this.valid = false;
            this.message = message;
            return this;
        }
    }
}
