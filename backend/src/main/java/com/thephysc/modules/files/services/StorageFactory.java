package com.thephysc.modules.files.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Factory for getting the appropriate storage service implementation
 * based on configuration.
 */
@Service
public class StorageFactory {

    @Value("${storage.type:local}")
    private String storageType;
    
    @Autowired(required = false)
    private FileStorageService fileStorageService;
    
    @Autowired(required = false)
    private S3StorageService s3StorageService;
    
    /**
     * Get the configured storage service implementation
     * 
     * @return The appropriate StorageService implementation
     */
    public StorageService getStorageService() {
        switch (storageType.toLowerCase()) {
            case "s3":
                if (s3StorageService == null) {
                    throw new IllegalStateException("S3 storage is configured but the service is not available");
                }
                return s3StorageService;
            case "local":
            default:
                if (fileStorageService == null) {
                    throw new IllegalStateException("Local storage is configured but the service is not available");
                }
                return fileStorageService;
        }
    }
}
