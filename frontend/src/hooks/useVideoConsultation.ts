'use client';

import { useCallback, useRef, useState } from 'react';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface S3UploadOptions {
  onProgress?: (progress: number) => void;
  metadata?: Record<string, string>;
}

interface S3UploadResult {
  url: string;
  key: string;
  bucket: string;
}

interface ConsultationSession {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime?: Date;
  sessionFolder: string;
  messages: Message[];
  attachments: string[];
}

interface Message {
  id: string;
  sender: string;
  senderType: 'patient' | 'doctor';
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface UseVideoConsultationProps {
  sessionId: string;
  patientPhone: string;
  doctorId: string;
  startTime: Date;
}

interface UseVideoConsultationReturn {
  uploadToS3: (file: File, options?: S3UploadOptions) => Promise<S3UploadResult>;
  generateSessionFolder: (patientPhone: string, doctorId: string, startTime: Date) => string;
  saveSessionData: (sessionData: ConsultationSession, transcript: string) => Promise<void>;
  getChatTranscript: (messages: Message[]) => string;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
  getSessionHistory: (patientId: string, doctorId: string) => Promise<ConsultationSession[]>;
  downloadSessionData: (sessionId: string) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export const useVideoConsultation = ({
  sessionId,
  patientPhone,
  doctorId,
  startTime
}: UseVideoConsultationProps): UseVideoConsultationReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Generate unique session folder path
  const generateSessionFolder = useCallback((patientPhone: string, doctorId: string, startTime: Date): string => {
    const date = startTime.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = startTime.toISOString().replace(/[:.]/g, '-');
    
    // Clean phone number (remove special characters)
    const cleanPhone = patientPhone.replace(/[^0-9]/g, '');
    
    return `consultations/${cleanPhone}/${date}/${doctorId}/${timestamp}`;
  }, []);

  // Upload file to S3
  const uploadToS3 = useCallback(async (
    file: File, 
    options: S3UploadOptions = {}
  ): Promise<S3UploadResult> => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Generate session folder
      const sessionFolder = generateSessionFolder(patientPhone, doctorId, startTime);
      const fileName = `${Date.now()}-${file.name}`;
      const key = `${sessionFolder}/${fileName}`;

      // Get presigned URL from backend
      const presignedResponse = await fetch('/api/video/s3/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          contentType: file.type,
          metadata: {
            sessionId,
            patientPhone,
            doctorId,
            originalName: file.name,
            uploadTime: new Date().toISOString(),
            ...options.metadata
          }
        })
      });

      if (!presignedResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }

      const { uploadUrl, fileUrl, bucket } = await presignedResponse.json();

      // Upload file to S3 using presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
        // Track upload progress
        onprogress: (event: ProgressEvent) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(progress);
            options.onProgress?.(progress);
          }
        }
      } as any);

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // Save file metadata to database
      await fetch('/api/video/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          s3Key: key,
          s3Url: fileUrl,
          s3Bucket: bucket,
          uploadedAt: new Date().toISOString()
        })
      });

      setIsUploading(false);
      setUploadProgress(100);

      return {
        url: fileUrl,
        key,
        bucket
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown upload error';
      setError(errorMessage);
      setIsUploading(false);
      throw new Error(errorMessage);
    }
  }, [sessionId, patientPhone, doctorId, startTime, generateSessionFolder]);

  // Generate chat transcript
  const getChatTranscript = useCallback((messages: Message[]): string => {
    const transcript = messages.map(message => {
      const timestamp = message.timestamp.toLocaleString();
      const sender = message.sender;
      
      if (message.type === 'text') {
        return `[${timestamp}] ${sender}: ${message.content}`;
      } else if (message.type === 'file' || message.type === 'image') {
        return `[${timestamp}] ${sender}: [${message.type.toUpperCase()}] ${message.fileName} (${message.fileUrl})`;
      }
      
      return `[${timestamp}] ${sender}: [UNKNOWN MESSAGE TYPE]`;
    }).join('\n');

    return `Chat Transcript - Session ${sessionId}\n` +
           `Generated: ${new Date().toLocaleString()}\n` +
           `Session Duration: ${startTime.toLocaleString()} - ${new Date().toLocaleString()}\n` +
           `=====================================\n\n${transcript}`;
  }, [sessionId, startTime]);

  // Save session data to S3 and database
  const saveSessionData = useCallback(async (
    sessionData: ConsultationSession, 
    transcript: string
  ): Promise<void> => {
    try {
      // Create transcript file
      const transcriptBlob = new Blob([transcript], { type: 'text/plain' });
      const transcriptFile = new File([transcriptBlob], `transcript-${sessionId}.txt`, { 
        type: 'text/plain' 
      });

      // Upload transcript to S3
      const transcriptUpload = await uploadToS3(transcriptFile, {
        metadata: {
          type: 'transcript',
          sessionId: sessionData.id,
          generatedAt: new Date().toISOString()
        }
      });

      // Create session summary JSON
      const sessionSummary = {
        ...sessionData,
        transcriptUrl: transcriptUpload.url,
        totalMessages: sessionData.messages.length,
        totalAttachments: sessionData.attachments.length,
        sessionDuration: sessionData.endTime 
          ? sessionData.endTime.getTime() - sessionData.startTime.getTime()
          : 0
      };

      const summaryBlob = new Blob([JSON.stringify(sessionSummary, null, 2)], { 
        type: 'application/json' 
      });
      const summaryFile = new File([summaryBlob], `session-summary-${sessionId}.json`, { 
        type: 'application/json' 
      });

      // Upload session summary to S3
      const summaryUpload = await uploadToS3(summaryFile, {
        metadata: {
          type: 'session-summary',
          sessionId: sessionData.id,
          generatedAt: new Date().toISOString()
        }
      });

      // Save session metadata to database
      await fetch('/api/video/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sessionData,
          transcriptUrl: transcriptUpload.url,
          summaryUrl: summaryUpload.url,
          s3Folder: sessionData.sessionFolder
        })
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save session data';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [uploadToS3, sessionId]);

  // Start recording session
  const startRecording = useCallback(async (): Promise<void> => {
    try {
      // Get the display media (screen + audio)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      recordingChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Recording will be handled in stopRecording
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Stop recording and upload to S3
  const stopRecording = useCallback(async (): Promise<string> => {
    if (!mediaRecorderRef.current) {
      throw new Error('No active recording');
    }

    return new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current!;
      
      mediaRecorder.onstop = async () => {
        try {
          const recordingBlob = new Blob(recordingChunksRef.current, { 
            type: 'video/webm' 
          });
          
          const recordingFile = new File([recordingBlob], `recording-${sessionId}.webm`, { 
            type: 'video/webm' 
          });

          // Upload recording to S3
          const uploadResult = await uploadToS3(recordingFile, {
            metadata: {
              type: 'session-recording',
              sessionId,
              recordedAt: new Date().toISOString(),
              duration: (Date.now() - startTime.getTime()).toString()
            }
          });

          setIsRecording(false);
          recordingChunksRef.current = [];
          mediaRecorderRef.current = null;

          resolve(uploadResult.url);

        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to save recording';
          setError(errorMessage);
          reject(new Error(errorMessage));
        }
      };

      mediaRecorder.stop();
      
      // Stop all tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }, [uploadToS3, sessionId, startTime]);

  // Get session history for a patient-doctor pair
  const getSessionHistory = useCallback(async (
    patientId: string, 
    doctorId: string
  ): Promise<ConsultationSession[]> => {
    try {
      const response = await fetch(
        `/api/video/sessions/history?patientId=${patientId}&doctorId=${doctorId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch session history');
      }

      return await response.json();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch session history';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Download session data as ZIP
  const downloadSessionData = useCallback(async (sessionId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/video/sessions/${sessionId}/download`);

      if (!response.ok) {
        throw new Error('Failed to download session data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `session-${sessionId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download session data';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    uploadToS3,
    generateSessionFolder,
    saveSessionData,
    getChatTranscript,
    startRecording,
    stopRecording,
    getSessionHistory,
    downloadSessionData,
    isUploading,
    uploadProgress,
    error
  };
};
