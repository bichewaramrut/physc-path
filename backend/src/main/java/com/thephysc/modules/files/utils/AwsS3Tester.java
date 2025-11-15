package com.thephysc.modules.files.utils;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.util.List;

/**
 * Utility class to test AWS S3 credentials and permissions
 * Uncomment the @Component annotation to enable this as a command line runner
 */
//@Component
public class AwsS3Tester implements CommandLineRunner {

    private final String accessKey;
    private final String secretKey;
    private final String region;
    private final String bucketName;

    public AwsS3Tester(
            @org.springframework.beans.factory.annotation.Value("${storage.s3.access-key}") String accessKey,
            @org.springframework.beans.factory.annotation.Value("${storage.s3.secret-key}") String secretKey,
            @org.springframework.beans.factory.annotation.Value("${storage.s3.region}") String region,
            @org.springframework.beans.factory.annotation.Value("${storage.s3.bucket-name}") String bucketName) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.region = region;
        this.bucketName = bucketName;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== AWS S3 Credential Tester ===");
        System.out.println("Testing AWS S3 credentials and permissions...");

        try {
            System.out.println("Creating S3 client...");
            AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
            S3Client s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(credentials))
                    .build();

            System.out.println("Attempting to list all buckets...");
            ListBucketsResponse listBucketsResponse = s3Client.listBuckets();
            List<Bucket> buckets = listBucketsResponse.buckets();
            
            System.out.println("Success! Found " + buckets.size() + " buckets:");
            buckets.forEach(bucket -> System.out.println("- " + bucket.name()));
            
            // Check if our target bucket exists
            boolean bucketExists = buckets.stream()
                    .anyMatch(b -> b.name().equals(bucketName));
                    
            if (bucketExists) {
                System.out.println("\nTarget bucket '" + bucketName + "' exists!");
                
                // Test head bucket operation
                System.out.println("Testing headBucket operation...");
                s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
                System.out.println("Success! headBucket operation worked.");
                
                // Test listing objects
                System.out.println("Testing listObjects operation...");
                ListObjectsV2Response listObjectsResponse = s3Client.listObjectsV2(
                        ListObjectsV2Request.builder().bucket(bucketName).build());
                System.out.println("Success! Found " + listObjectsResponse.contents().size() + " objects in the bucket.");
            } else {
                System.out.println("\nTarget bucket '" + bucketName + "' does not exist.");
                System.out.println("Attempting to create it...");
                
                try {
                    s3Client.createBucket(CreateBucketRequest.builder()
                            .bucket(bucketName)
                            .build());
                    System.out.println("Success! Created bucket '" + bucketName + "'");
                } catch (Exception e) {
                    System.out.println("Failed to create bucket: " + e.getMessage());
                    System.out.println("This might indicate missing 's3:CreateBucket' permission.");
                }
            }
            
            System.out.println("\nAll tests completed. Your S3 credentials work!");
            
        } catch (S3Exception e) {
            System.out.println("AWS S3 Error: " + e.getMessage());
            System.out.println("Error code: " + e.awsErrorDetails().errorCode());
            System.out.println("Status code: " + e.statusCode());
            
            if (e.statusCode() == 403) {
                System.out.println("\n=== ACCESS DENIED ERROR ===");
                System.out.println("Your AWS credentials are valid but don't have the necessary permissions.");
                System.out.println("Please ensure your IAM user/role has at least these permissions:");
                System.out.println("- s3:ListAllMyBuckets");
                System.out.println("- s3:HeadBucket");
                System.out.println("- s3:CreateBucket");
                System.out.println("- s3:ListBucket");
                System.out.println("- s3:GetObject");
                System.out.println("- s3:PutObject");
                System.out.println("\nYou can attach the AmazonS3FullAccess managed policy in the AWS console.");
            } else if (e.statusCode() == 401) {
                System.out.println("\n=== AUTHENTICATION ERROR ===");
                System.out.println("Your AWS credentials are invalid.");
                System.out.println("Please check that you're using the correct access key and secret key.");
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
