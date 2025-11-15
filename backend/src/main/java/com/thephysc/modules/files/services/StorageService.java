package com.thephysc.modules.files.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Interface for file storage operations
 */
public interface StorageService {
    /**
     * Store a file in a subdirectory
     * @param file The file to store
     * @param subdirectory The subdirectory within the storage location
     * @param fileName The name to save the file as
     * @return The URL to access the file
     */
    String storeFile(MultipartFile file, String subdirectory, String fileName) throws IOException;
    
    /**
     * Retrieve a file from storage
     * @param filePath The path to the file (can include subdirectories)
     * @return The file contents as a byte array
     */
    byte[] getFile(String filePath) throws IOException;
    
    /**
     * Get the content type of a file
     * @param filePath The path to the file (can include subdirectories)
     * @return The content type of the file
     */
    String getContentType(String filePath) throws IOException;
    
    /**
     * Process and store a file with appropriate compression if needed
     * @param file The file to process and store
     * @param subdirectory The subdirectory to store the file in
     * @param fileName The name to save the file as
     * @param fileType The type of file (profile, document, etc.)
     * @return The URL to access the file
     */
    String processAndStoreFile(MultipartFile file, String subdirectory, String fileName, String fileType) throws IOException;
}
