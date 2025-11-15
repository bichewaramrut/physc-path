package com.thephysc.modules.files.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;

/**
 * Implementation of file storage service using Amazon S3
 */
@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "s3")
public class S3StorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(S3StorageService.class);
    
    @Value("${storage.s3.bucket-name}")
    private String bucketName;
    
    @Value("${storage.s3.region}")
    private String region;
    
    @Value("${storage.s3.access-key}")
    private String accessKey;
    
    @Value("${storage.s3.secret-key}")
    private String secretKey;
    
    @Value("${file.base.url:}")
    private String fileBaseUrl;
    
    private S3Client s3Client;
    
    @PostConstruct
    public void init() {
        logger.info("Initializing S3 storage service with bucket: {}", bucketName);
        logger.info("Using AWS region: {}", region);
        logger.info("Using access key ID: {}", accessKey.substring(0, 5) + "...");
        
        try {
            // Create credentials
            AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
            StaticCredentialsProvider credentialsProvider = StaticCredentialsProvider.create(credentials);
            
            // Configure the client with some overrides to help with diagnostics
            s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(credentialsProvider)
                    .overrideConfiguration(b -> b
                        .retryPolicy(r -> r.numRetries(3))
                        .apiCallTimeout(java.time.Duration.ofSeconds(30))
                    )
                    .build();
                    
            logger.info("S3 client initialized successfully");
        } catch (Exception e) {
            logger.error("Failed to initialize S3 client: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initialize S3 client", e);
        }
        
        // Test S3 connectivity first
        boolean connectionSuccessful = testConnection();
        
        if (!connectionSuccessful) {
            logger.warn("S3 connection test failed. Will still attempt specific bucket operations.");
        }
        
        // Check if the bucket exists, if not create it
        try {
            logger.info("Testing S3 connection by checking if bucket {} exists...", bucketName);
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
            logger.info("S3 bucket {} exists", bucketName);
        } catch (S3Exception e) {
            if (e.statusCode() == 404) {
                logger.info("Bucket {} does not exist. Attempting to create it...", bucketName);
                try {
                    s3Client.createBucket(CreateBucketRequest.builder()
                            .bucket(bucketName)
                            .build());
                    logger.info("S3 bucket {} created successfully", bucketName);
                } catch (S3Exception createException) {
                    logger.error("Failed to create S3 bucket {}: {}", bucketName, createException.getMessage());
                    logger.error("Error code: {}, Status code: {}", 
                            createException.awsErrorDetails().errorCode(), 
                            createException.statusCode());
                    
                    // Provide specific guidance based on the error
                    if (createException.statusCode() == 403) {
                        logger.error("ACCESS DENIED: Your IAM user/role doesn't have permission to create buckets.");
                        logger.error("You need the 's3:CreateBucket' permission for this operation.");
                    } else if ("BucketAlreadyExists".equals(createException.awsErrorDetails().errorCode())) {
                        logger.error("The bucket name '{}' is already taken by another AWS account.", bucketName);
                        logger.error("S3 bucket names must be globally unique across all AWS accounts.");
                        logger.error("Please choose a different bucket name in your configuration.");
                    }
                    throw createException;
                }
            } else {
                logger.error("Error checking S3 bucket {}: {}", bucketName, e.getMessage());
                logger.error("Error code: {}, Status code: {}", 
                        e.awsErrorDetails().errorCode(), 
                        e.statusCode());
                logger.error("Access denied errors typically mean your IAM permissions are insufficient");
                
                // Check if this is an authentication/authorization issue
                if (e.statusCode() == 403) {
                    logger.error("STATUS CODE 403: This is an access denied error.");
                    logger.error("Your IAM user/role needs the following permissions:");
                    logger.error("- s3:HeadBucket");
                    logger.error("- s3:CreateBucket");
                    logger.error("- s3:PutObject");
                    logger.error("- s3:GetObject");
                    logger.error("- s3:ListBucket");
                    
                    // Provide guidance on how to fix it
                    logger.error("To fix this issue:");
                    logger.error("1. Go to the AWS IAM console");
                    logger.error("2. Find the user associated with the access key you're using");
                    logger.error("3. Either attach the AmazonS3FullAccess policy or create a custom policy with the necessary permissions");
                    logger.error("4. Make sure the bucket doesn't have a bucket policy restricting access");
                }
                throw e;
            }
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subdirectory, String fileName) throws IOException {
        // Normalize file name and subdirectory
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown");
        subdirectory = StringUtils.cleanPath(subdirectory != null ? subdirectory : "");
        
        // Check if the file's name contains invalid characters
        if (originalFileName.contains("..")) {
            throw new IllegalArgumentException("Sorry! Filename contains invalid path sequence " + originalFileName);
        }
        
        // Create the S3 key (path)
        String key = subdirectory.isEmpty() ? fileName : subdirectory + "/" + fileName;
        
        logger.info("Uploading file to S3: {}", key);
        
        // Upload the file to S3
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();
        
        InputStream inputStream = null;
        try {
            inputStream = file.getInputStream();
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));

            // Generate and return the URL
            return generateFileUrl(key);
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    logger.warn("Failed to close input stream in storeFile: {}", e.getMessage());
                }
            }
        }
    }

    @Override
    public byte[] getFile(String filePath) throws IOException {
        logger.info("Getting file from S3: {}", filePath);
        
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(filePath)
                    .build();
            
            ResponseInputStream<GetObjectResponse> response = s3Client.getObject(getObjectRequest);
            
            // Read the content into a byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = response.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            
            return outputStream.toByteArray();
        } catch (S3Exception e) {
            logger.error("Error retrieving file from S3: {}", e.getMessage());
            throw new IOException("Failed to retrieve file from S3: " + e.getMessage(), e);
        }
    }

    @Override
    public String getContentType(String filePath) throws IOException {
        logger.info("Getting content type for file: {}", filePath);
        
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(filePath)
                    .build();
            
            HeadObjectResponse response = s3Client.headObject(headObjectRequest);
            String contentType = response.contentType();
            
            return contentType != null ? contentType : "application/octet-stream";
        } catch (S3Exception e) {
            logger.error("Error getting content type from S3: {}", e.getMessage());
            throw new IOException("Failed to get content type from S3: " + e.getMessage(), e);
        }
    }

    @Override
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
     */
    private String processAndStoreImage(MultipartFile file, String subdirectory, String fileName, String fileType) throws IOException {
        BufferedImage originalImage = null;
        InputStream inputStream = null;
        ByteArrayOutputStream baos = null;
        InputStream processedImageStream = null;

        try {
            inputStream = file.getInputStream();
            originalImage = ImageIO.read(inputStream);

            if (originalImage == null) {
                // If the image can't be read, store the original file
                logger.warn("Failed to read image for processing. Storing original file.");
                return storeFile(file, subdirectory, fileName);
            }

            // Get image format (jpg, png, etc.)
            String format = getImageFormat(file.getOriginalFilename());

            // Process based on file type
            if ("profile".equalsIgnoreCase(fileType)) {
                // Profile images get higher quality but are resized if too large
                processedImageStream = compressAndResizeImage(originalImage, format, 0.85f, 1000, 1000);
            } else {
                // Document images get more compression to save space
                processedImageStream = compressAndResizeImage(originalImage, format, 0.7f, 1500, 1500);
            }

            // Create the S3 key (path)
            String key = subdirectory.isEmpty() ? fileName : subdirectory + "/" + fileName;

            // Read the processed image stream to determine its size
            baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = processedImageStream.read(buffer)) != -1) {
                baos.write(buffer, 0, bytesRead);
            }
            byte[] processedImageBytes = baos.toByteArray();

            // Upload the processed image to S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(getContentTypeFromFormat(format))
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(processedImageBytes));

            // Generate and return the URL
            return generateFileUrl(key);
        } finally {
            // Close all resources
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    logger.warn("Failed to close original input stream: {}", e.getMessage());
                }
            }

            if (processedImageStream != null) {
                try {
                    processedImageStream.close();
                } catch (IOException e) {
                    logger.warn("Failed to close processed image stream: {}", e.getMessage());
                }
            }

            if (baos != null) {
                try {
                    baos.close();
                } catch (IOException e) {
                    logger.warn("Failed to close output stream: {}", e.getMessage());
                }
            }
        }
    }
    
    /**
     * Compress and resize an image if needed
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
    
    /**
     * Get content type from image format
     */
    private String getContentTypeFromFormat(String format) {
        switch (format.toLowerCase()) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            default:
                return "image/jpeg";
        }
    }
    
    /**
     * Generate a URL for accessing the file
     */
    private String generateFileUrl(String key) {
        if (fileBaseUrl != null && !fileBaseUrl.isEmpty()) {
            // Use custom base URL if specified
            return fileBaseUrl + "/" + key;
        } else {
            // Use S3 URL format
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
        }
    }
    
    /**
     * Tests the AWS S3 connection and prints diagnostic information
     * @return true if the connection is successful, false otherwise
     */
    private boolean testConnection() {
        try {
            // Test listing buckets - should work if credentials have ListAllMyBuckets permission
            logger.info("Testing S3 connection by listing all buckets...");
            ListBucketsResponse listBucketsResponse = s3Client.listBuckets();
            logger.info("Successfully listed {} buckets", listBucketsResponse.buckets().size());
            
            // Check if our target bucket is in the list
            boolean bucketExists = listBucketsResponse.buckets().stream()
                    .anyMatch(b -> b.name().equals(bucketName));
                    
            if (bucketExists) {
                logger.info("Found target bucket '{}' in bucket list", bucketName);
            } else {
                logger.info("Target bucket '{}' was not found in bucket list, will attempt to create it", bucketName);
            }
            
            return true;
        } catch (S3Exception e) {
            logger.error("Error testing S3 connection: {}", e.getMessage());
            logger.error("Error code: {}, Status code: {}", 
                    e.awsErrorDetails().errorCode(), 
                    e.statusCode());
                    
            if (e.statusCode() == 403) {
                logger.error("STATUS CODE 403: This indicates an access denied error.");
                logger.error("Your IAM user/role needs the 's3:ListAllMyBuckets' permission");
            }
            
            return false;
        }
    }
}
