package com.thephysc.modules.files.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "local", matchIfMissing = true)
public class FileStorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);
    
    private final Path fileStorageLocation;
    private final String fileBaseUrl;

    public FileStorageService(
            @Value("${file.storage.location:uploads}") String fileStorageLocation,
            @Value("${file.base.url:http://localhost:8080/api/files}") String fileBaseUrl) {
        this.fileStorageLocation = Paths.get(fileStorageLocation).toAbsolutePath().normalize();
        this.fileBaseUrl = fileBaseUrl;
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Store a file in the default storage location
     * @param file The file to store
     * @param fileName The name to save the file as
     * @return The URL to access the file
     */
    public String storeFile(MultipartFile file, String fileName) throws IOException {
        return storeFile(file, "", fileName);
    }
    
    /**
     * Store a file in a subdirectory of the storage location
     * @param file The file to store
     * @param subdirectory The subdirectory within the storage location
     * @param fileName The name to save the file as
     * @return The URL to access the file
     */
    public String storeFile(MultipartFile file, String subdirectory, String fileName) throws IOException {
        // Normalize file name and subdirectory
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Failed to store empty file " + fileName);
        }
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        subdirectory = StringUtils.cleanPath(subdirectory);
        
        // Check if the file's name contains invalid characters
        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException("Sorry! Filename contains invalid path sequence " + originalFileName);
        }
        
        // Create the target directory if it doesn't exist
        Path targetDir;
        if (subdirectory.isEmpty()) {
            targetDir = this.fileStorageLocation;
        } else {
            targetDir = this.fileStorageLocation.resolve(subdirectory);
            Files.createDirectories(targetDir);
        }
        
        // Copy file to the target location
        Path targetLocation = targetDir.resolve(fileName);
        logger.info("Storing file at: {}", targetLocation);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        // Return the file URL
        if (subdirectory.isEmpty()) {
            return fileBaseUrl + "/" + fileName;
        } else {
            return fileBaseUrl + "/" + subdirectory + "/" + fileName;
        }
    }
    
    /**
     * Retrieve a file from storage
     * @param filePath The path to the file (can include subdirectories)
     * @return The file contents as a byte array
     */
    public byte[] getFile(String filePath) throws IOException {
        Path targetPath = this.fileStorageLocation.resolve(filePath).normalize();
        
        // Security check
        if (!targetPath.startsWith(this.fileStorageLocation)) {
            throw new IOException("Cannot access file outside of the storage location");
        }
        
        return Files.readAllBytes(targetPath);
    }
    
    /**
     * Get the content type of a file
     * @param filePath The path to the file (can include subdirectories)
     * @return The content type of the file
     */
    public String getContentType(String filePath) throws IOException {
        Path targetPath = this.fileStorageLocation.resolve(filePath).normalize();
        
        // Security check
        if (!targetPath.startsWith(this.fileStorageLocation)) {
            throw new IOException("Cannot access file outside of the storage location");
        }
        
        String contentType = Files.probeContentType(targetPath);
        return contentType != null ? contentType : "application/octet-stream";
    }
    
    /**
     * Process and store a file with appropriate compression if needed
     * @param file The file to process and store
     * @param subdirectory The subdirectory to store the file in
     * @param fileName The name to save the file as
     * @param fileType The type of file (profile, document, etc.)
     * @return The URL to access the file
     */
    public String processAndStoreFile(MultipartFile file, String subdirectory, String fileName, String fileType) throws IOException {
        String contentType = file.getContentType();
        
        // If it's an image, process it based on type
        if (contentType != null && contentType.startsWith("image/")) {
            return processAndStoreImage(file, subdirectory, fileName, fileType);
        }
        
        // For non-image files, just store them normally
        return storeFile(file, subdirectory, fileName);
    }
    
    /**
     * Process and store an image file, with compression if needed
     * @param file The image file to process and store
     * @param subdirectory The subdirectory to store the file in
     * @param fileName The name to save the file as
     * @param fileType The type of image (profile, document, etc.)
     * @return The URL to access the image
     */
    private String processAndStoreImage(MultipartFile file, String subdirectory, String fileName, String fileType) throws IOException {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        if (originalImage == null) {
            // If the image can't be read, store the original file
            logger.warn("Failed to read image for processing. Storing original file.");
            return storeFile(file, subdirectory, fileName);
        }
        
        // Get image format (jpg, png, etc.)
        String format = getImageFormat(file.getOriginalFilename());
        InputStream processedImageStream;
        
        // Process based on file type
        if ("profile".equalsIgnoreCase(fileType)) {
            // Profile images get higher quality but are resized if too large
            processedImageStream = compressAndResizeImage(originalImage, format, 0.85f, 1000, 1000);
        } else {
            // Document images get more compression to save space
            processedImageStream = compressAndResizeImage(originalImage, format, 0.7f, 1500, 1500);
        }
        
        // Create the target directory if it doesn't exist
        Path targetDir;
        if (subdirectory.isEmpty()) {
            targetDir = this.fileStorageLocation;
        } else {
            targetDir = this.fileStorageLocation.resolve(subdirectory);
            Files.createDirectories(targetDir);
        }
        
        // Store the processed image
        Path targetLocation = targetDir.resolve(fileName);
        logger.info("Storing processed image at: {}", targetLocation);
        Files.copy(processedImageStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        // Return the file URL
        if (subdirectory.isEmpty()) {
            return fileBaseUrl + "/" + fileName;
        } else {
            return fileBaseUrl + "/" + subdirectory + "/" + fileName;
        }
    }
    
    /**
     * Compress and resize an image if needed
     * @param originalImage The original image
     * @param format The image format (jpg, png, etc.)
     * @param quality The quality factor (0.0 to 1.0)
     * @param maxWidth The maximum width
     * @param maxHeight The maximum height
     * @return An input stream of the processed image
     */
    private InputStream compressAndResizeImage(BufferedImage originalImage, String format, float quality, int maxWidth, int maxHeight) throws IOException {
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();
        
        // Check if resizing is needed
        if (width > maxWidth || height > maxHeight) {
            // Calculate new dimensions while maintaining aspect ratio
            float aspectRatio = (float) width / height;
            if (width > height) {
                width = maxWidth;
                height = Math.round(width / aspectRatio);
            } else {
                height = maxHeight;
                width = Math.round(height * aspectRatio);
            }
            
            // Create a new buffered image with the new dimensions
            BufferedImage resizedImage = new BufferedImage(width, height, originalImage.getType());
            resizedImage.getGraphics().drawImage(originalImage.getScaledInstance(width, height, java.awt.Image.SCALE_SMOOTH), 0, 0, null);
            originalImage = resizedImage;
        }
        
        // Compress the image
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        
        // For JPEG images, use JPEG compression
        if ("jpg".equals(format) || "jpeg".equals(format)) {
            ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
            ImageWriteParam writeParam = writer.getDefaultWriteParam();
            writeParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            writeParam.setCompressionQuality(quality);
            
            try (ImageOutputStream imageOutputStream = ImageIO.createImageOutputStream(outputStream)) {
                writer.setOutput(imageOutputStream);
                writer.write(null, new IIOImage(originalImage, null, null), writeParam);
                writer.dispose();
            }
        } else {
            // For other formats (PNG, etc.), just write the image normally
            ImageIO.write(originalImage, format, outputStream);
        }
        
        return new ByteArrayInputStream(outputStream.toByteArray());
    }
    
    /**
     * Get the image format from a filename
     * @param filename The filename
     * @return The image format (jpg, png, etc.)
     */
    private String getImageFormat(String filename) {
        if (filename == null) {
            return "jpg"; // Default format
        }
        
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "jpg";
            case "png":
                return "png";
            case "gif":
                return "gif";
            default:
                return "jpg"; // Default format
        }
    }
}
