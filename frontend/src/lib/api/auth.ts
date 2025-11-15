import apiClient from './client';

// Get the API base URL from the same place the client uses
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

/**
 * Helper function to upload files with progress tracking
 * @param endpoint The API endpoint path (without base URL)
 * @param formData The form data with files to upload
 * @param onProgress Optional callback for upload progress (0-100)
 * @param isMultipleFiles Whether the upload contains multiple files and expects an array response
 * @returns Promise with the upload response (single or array)
 */
const uploadFileWithProgress = (
  endpoint: string, 
  formData: FormData, 
  onProgress?: (progress: number) => void,
  isMultipleFiles: boolean = false
): Promise<FileUploadResponse | FileUploadResponse[]> => {
  return new Promise((resolve, reject) => {
    // Create XMLHttpRequest to track progress
    const xhr = new XMLHttpRequest();
    
    // Set up progress tracking
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      });
    }
    
    // Handle response
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            
            // Handle array response for multiple files or single response
            if (isMultipleFiles) {
              // Make sure we always return an array
              const responseArray = Array.isArray(response) ? response : [response];
              resolve(responseArray);
            } else {
              // For single file uploads, return the first item if it's an array
              if (Array.isArray(response) && response.length > 0) {
                resolve(response[0]);
              } else {
                resolve(response);
              }
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.message || `Error: ${xhr.status}`));
          } catch (error) {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        }
      }
    };
    
    // Ensure endpoint starts with a slash if not provided
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Combine base URL with endpoint for full URL
    const fullUrl = `${API_BASE_URL}${normalizedEndpoint}`;
    console.log(`Uploading to: ${fullUrl}`);
    
    // Open and send the request
    xhr.open('POST', fullUrl, true);
    
    // Add authorization header if available
    const token = localStorage.getItem('token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    
    xhr.send(formData);
  });
};

// Types
export interface RegisterRequest {
  // Basic user info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string; // 'ROLE_PATIENT' or 'ROLE_DOCTOR'
  
  // Provider-specific fields
  specialty?: string;
  license?: string;
  yearsOfExperience?: number;
  bio?: string;
  consultationFee?: number;
  
  // Patient-specific fields
  dateOfBirth?: string;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;

  // Profile photo and identity documents
  profilePhotoUrl?: string | null; // Optional profile photo file
  identityDocsUrls?: string[]; // Array of identity document files
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  token: string;
  refreshToken: string;
  profileType: string;
  profileId: number | null;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface FileUploadResponse {
  fileId: string;
  url: string;
  success: boolean;
  message?: string;
  contentType?: string;
  originalName?: string;
  fileSize?: number;
}

// Auth service functions
export const AuthService = {
  // Register a new user
  register: (userData: RegisterRequest) => {
    return apiClient.post<LoginResponse>('auth/register', userData);
  },
  
  // User login
  login: (credentials: LoginRequest) => {
    return apiClient.post<LoginResponse>('auth/login', credentials);
  },
  
  // Refresh authentication token
  refreshToken: (refreshToken: string) => {
    return apiClient.post<TokenResponse>('auth/refresh-token', { refreshToken });
  },
  
  // Send OTP for phone verification
  sendOtp: (phone: string) => {
    console.log('Sending OTP to:', phone);
    // Since baseURL is http://localhost:8080/api, we should match the controller mapping
    return apiClient.post<OtpResponse>('/auth/send-otp', { phone });
  },
  
  // Verify OTP code
  verifyOtp: (data: VerifyOtpRequest) => {
    return apiClient.post<OtpResponse>('/auth/verify-otp', data);
  },
  
  /**
   * Upload profile photo with progress tracking
   * @param file The profile photo file to upload
   * @param onProgress Optional callback for upload progress (0-100)
   * @returns Promise with the upload response
   */
  uploadProfilePhoto: (file: File, onProgress?: (progress: number) => void): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use custom upload function with progress tracking (false = single file response)
    return uploadFileWithProgress('files/upload/profile', formData, onProgress, false) as Promise<FileUploadResponse>;
  },
  
  /**
   * Upload identity documents for providers with progress tracking
   * @param files The document files to upload
   * @param onProgress Optional callback for upload progress (0-100)
   * @returns Promise with an array of upload responses
   */
  uploadDocuments: (files: File[], onProgress?: (progress: number) => void): Promise<FileUploadResponse[]> => {
    // Create form data with multiple files
    const formData = new FormData();
    
    // Add files to the form data using the 'files' parameter name
    // This matches the @RequestParam("files") in the backend controller
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    // Use custom upload function with progress tracking (true = multiple files response)
    return uploadFileWithProgress('files/upload-multiple/provider-docs', formData, onProgress, true) as Promise<FileUploadResponse[]>;
  },
  
  /**
   * Upload a single document with specific type
   * @param file The document file to upload
   * @param documentType The type of document (aadhar, pan, medical, etc.)
   * @param onProgress Optional callback for upload progress (0-100)
   * @returns Promise with the upload response
   */
  uploadSingleDocument: (file: File, documentType: string, onProgress?: (progress: number) => void): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    // Use custom upload function with progress tracking - for single files use the /upload/ endpoint
    return uploadFileWithProgress('files/upload/document', formData, onProgress, false) as Promise<FileUploadResponse>;
  },
  
  // Complete provider profile
  completeProviderProfile: (profileData: any) => {
    return apiClient.post('/auth/complete-provider-profile', profileData);
  },

  // Update profile information
  updateProfile: (userId: number, profileData: any) => {
    return apiClient.put(`/users/${userId}/profile`, profileData);
  },

  /**
   * Helper function to extract URLs from file upload responses
   * @param responses Array of file upload responses
   * @returns Array of URLs
   */
  getFileUrls: (responses: FileUploadResponse[]): string[] => {
    return responses.filter(response => response.success).map(response => response.url);
  },
  
  /**
   * Helper function to extract a specific document URL by type from responses
   * @param responses Array of file upload responses
   * @param docType The type of document to find
   * @returns URL if found, empty string otherwise
   */
  getDocumentUrlByType: (responses: FileUploadResponse[], docType: string): string => {
    const doc = responses.find(response => 
      response.success && 
      response.originalName?.toLowerCase().includes(docType.toLowerCase())
    );
    return doc ? doc.url : '';
  },
};

export default AuthService;
