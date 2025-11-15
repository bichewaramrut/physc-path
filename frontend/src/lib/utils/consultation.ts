/**
 * Utility functions for video consultation management
 */

/**
 * Format time duration in HH:MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Generate a unique session ID
 */
export const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `session_${timestamp}_${randomStr}`;
};

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Validate file type for upload
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return file.type.startsWith(category + '/');
    }
    return file.type === type;
  });
};

/**
 * Get file type category
 */
export const getFileTypeCategory = (mimeType: string): 'image' | 'video' | 'audio' | 'document' | 'other' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('text/') || 
      mimeType.includes('pdf') || 
      mimeType.includes('document') || 
      mimeType.includes('sheet') || 
      mimeType.includes('presentation')) {
    return 'document';
  }
  return 'other';
};

/**
 * Generate session folder path based on patient phone, doctor ID, and date
 */
export const generateSessionFolder = (patientPhone: string, doctorId: string, date: Date): string => {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const timestamp = date.toISOString().replace(/[:.]/g, '-');
  
  // Clean phone number (remove special characters)
  const cleanPhone = patientPhone.replace(/[^0-9]/g, '');
  
  return `consultations/${cleanPhone}/${dateStr}/${doctorId}/${timestamp}`;
};

/**
 * Parse session folder path to extract information
 */
export const parseSessionFolder = (folderPath: string): {
  patientPhone: string;
  date: string;
  doctorId: string;
  timestamp: string;
} | null => {
  const parts = folderPath.split('/');
  if (parts.length !== 5 || parts[0] !== 'consultations') {
    return null;
  }
  
  return {
    patientPhone: parts[1],
    date: parts[2],
    doctorId: parts[3],
    timestamp: parts[4]
  };
};

/**
 * Validate bandwidth and suggest video quality
 */
export const suggestVideoQuality = (bandwidthKbps: number): 'low' | 'medium' | 'high' => {
  if (bandwidthKbps < 300) return 'low';
  if (bandwidthKbps < 800) return 'medium';
  return 'high';
};

/**
 * Check if connection quality is acceptable
 */
export const isConnectionQualityAcceptable = (
  bandwidthKbps: number, 
  packetLossRate: number,
  roundTripTime: number
): boolean => {
  return bandwidthKbps >= 200 && packetLossRate <= 0.1 && roundTripTime <= 300;
};

/**
 * Get connection quality status
 */
export const getConnectionQualityStatus = (
  bandwidthKbps: number,
  packetLossRate: number,
  roundTripTime: number
): {
  status: 'excellent' | 'good' | 'poor' | 'disconnected';
  message: string;
  color: string;
} => {
  if (bandwidthKbps === 0) {
    return {
      status: 'disconnected',
      message: 'Connection lost',
      color: 'red'
    };
  }
  
  if (bandwidthKbps >= 1000 && packetLossRate <= 0.01 && roundTripTime <= 100) {
    return {
      status: 'excellent',
      message: 'Excellent connection',
      color: 'green'
    };
  }
  
  if (bandwidthKbps >= 500 && packetLossRate <= 0.05 && roundTripTime <= 200) {
    return {
      status: 'good',
      message: 'Good connection',
      color: 'yellow'
    };
  }
  
  return {
    status: 'poor',
    message: 'Poor connection - Consider reducing video quality',
    color: 'orange'
  };
};

/**
 * Compress image before upload
 */
export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Generate consultation report
 */
export const generateConsultationReport = (sessionData: {
  id: string;
  patientName: string;
  doctorName: string;
  startTime: Date;
  endTime?: Date;
  messages: Array<{
    sender: string;
    content: string;
    timestamp: Date;
    type: string;
  }>;
  attachments: string[];
}): string => {
  const duration = sessionData.endTime 
    ? sessionData.endTime.getTime() - sessionData.startTime.getTime()
    : 0;
    
  const durationMinutes = Math.floor(duration / (1000 * 60));
  
  return `
CONSULTATION REPORT
==================

Session ID: ${sessionData.id}
Patient: ${sessionData.patientName}
Doctor: ${sessionData.doctorName}
Date: ${sessionData.startTime.toLocaleDateString()}
Start Time: ${sessionData.startTime.toLocaleTimeString()}
End Time: ${sessionData.endTime?.toLocaleTimeString() || 'Ongoing'}
Duration: ${durationMinutes} minutes

SUMMARY
=======
Total Messages: ${sessionData.messages.length}
Attachments: ${sessionData.attachments.length}

CONVERSATION LOG
================
${sessionData.messages.map(msg => 
  `[${msg.timestamp.toLocaleTimeString()}] ${msg.sender}: ${msg.content}`
).join('\n')}

ATTACHMENTS
===========
${sessionData.attachments.map((url, index) => 
  `${index + 1}. ${url}`
).join('\n')}

Report generated on: ${new Date().toLocaleString()}
  `.trim();
};

/**
 * Sanitize filename for S3 storage
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

/**
 * Check if browser supports required features
 */
export const checkBrowserSupport = (): {
  webrtc: boolean;
  mediaDevices: boolean;
  dataChannel: boolean;
  screenShare: boolean;
  fullSupport: boolean;
} => {
  const support = {
    webrtc: !!window.RTCPeerConnection,
    mediaDevices: !!navigator.mediaDevices?.getUserMedia,
    dataChannel: !!window.RTCDataChannel,
    screenShare: !!navigator.mediaDevices?.getDisplayMedia,
    fullSupport: false
  };
  
  support.fullSupport = Object.values(support).every(Boolean);
  
  return support;
};

/**
 * Get minimum bandwidth requirements
 */
export const getMinimumBandwidthRequirements = (): {
  audio: number;
  videoLow: number;
  videoMedium: number;
  videoHigh: number;
  screenShare: number;
} => {
  return {
    audio: 50, // kbps
    videoLow: 200, // kbps
    videoMedium: 500, // kbps
    videoHigh: 1000, // kbps
    screenShare: 1500 // kbps
  };
};

/**
 * Validate session parameters
 */
export const validateSessionParams = (params: {
  sessionId?: string;
  patientId?: string;
  doctorId?: string;
  patientPhone?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!params.sessionId || params.sessionId.length < 5) {
    errors.push('Invalid session ID');
  }
  
  if (!params.patientId || params.patientId.length < 1) {
    errors.push('Patient ID is required');
  }
  
  if (!params.doctorId || params.doctorId.length < 1) {
    errors.push('Doctor ID is required');
  }
  
  if (!params.patientPhone || !/^\+?[\d\s-()]+$/.test(params.patientPhone)) {
    errors.push('Valid patient phone number is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
