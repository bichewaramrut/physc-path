"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  MonitorUp, 
  MessageSquare, 
  Phone, 
  Send,
  Paperclip,
  Camera,
  Download,
  FileText,
  X,
  Minimize2,
  Maximize2,
  Wifi,
  WifiOff,
  AlertTriangle,
  Circle,
  StopCircle
} from 'lucide-react';
import useEnhancedWebRTC from '../../../hooks/useEnhancedWebRTC';
import { useVideoConsultation } from '../../../hooks/useVideoConsultation';
import { formatTime } from '../../../lib/utils/consultation';

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

interface Participant {
  id: string;
  name: string;
  role: 'patient' | 'doctor';
  isConnected: boolean;
  stream?: MediaStream;
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

interface EnhancedVideoCallProps {
  sessionId: string;
  patientInfo: {
    id: string;
    name: string;
    phone: string;
  };
  doctorInfo: {
    id: string;
    name: string;
    specialty: string;
  };
  onSessionEnd: (sessionData: ConsultationSession) => void;
}

export default function EnhancedVideoCallInterface({
  sessionId,
  patientInfo,
  doctorInfo,
  onSessionEnd
}: EnhancedVideoCallProps) {
  // Video call state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('excellent');
  const [bandwidth, setBandwidth] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // File handling state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Session management
  const [sessionStartTime] = useState(new Date());
  const [participants, setParticipants] = useState<Participant[]>([
    { id: patientInfo.id, name: patientInfo.name, role: 'patient', isConnected: true },
    { id: doctorInfo.id, name: doctorInfo.name, role: 'doctor', isConnected: true }
  ]);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced WebRTC hook with messaging and file sharing
  const {
    localStream,
    remoteStreams,
    isConnected,
    connectionStats,
    error,
    initWebRTC,
    toggleVideo,
    toggleAudio,
    shareScreen,
    sendMessage: sendWebRTCMessage,
    sendFile,
    captureImage,
    getConnectionStats,
    changeVideoQuality,
    disconnect
  } = useEnhancedWebRTC({
    sessionId,
    patientInfo,
    doctorInfo,
    onMessageReceived: handleMessageReceived,
    onFileReceived: handleFileReceived,
    onConnectionQualityChange: handleConnectionQualityChange
  });

  // Video consultation management hook
  const {
    uploadToS3,
    generateSessionFolder,
    saveSessionData,
    getChatTranscript,
    startRecording,
    stopRecording
  } = useVideoConsultation({
    sessionId,
    patientPhone: patientInfo.phone,
    doctorId: doctorInfo.id,
    startTime: sessionStartTime
  });

  // Initialize WebRTC on component mount
  useEffect(() => {
    let initialized = false;
    
    const initialize = async () => {
      if (initialized) return;
      initialized = true;
      
      try {
        console.log('Initializing WebRTC for session:', sessionId);
        const stream = await initWebRTC();
        if (stream && localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Failed to initialize WebRTC:', err);
      }
    };
    
    initialize();
    
    // Start call timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Monitor connection quality
    const qualityMonitor = setInterval(async () => {
      try {
        const stats = await getConnectionStats();
        handleConnectionStats(stats);
      } catch (err) {
        console.error('Error getting connection stats:', err);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(qualityMonitor);
    };
  }, [sessionId]); // Only depend on sessionId to prevent re-initialization

  // Update remote video stream
  useEffect(() => {
    const streams = Object.values(remoteStreams);
    if (streams.length > 0 && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = streams[0] as MediaStream;
    }
  }, [remoteStreams]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle incoming messages
  function handleMessageReceived(message: Message) {
    setMessages(prev => [...prev, message]);
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
  }

  // Handle incoming files
  function handleFileReceived(file: { id: string; url: string; name: string; type: string; size: number; sender: string }) {
    const message: Message = {
      id: file.id,
      sender: file.sender,
      senderType: file.sender === patientInfo.id ? 'patient' : 'doctor',
      content: file.name,
      timestamp: new Date(),
      type: file.type.startsWith('image/') ? 'image' : 'file',
      fileUrl: file.url,
      fileName: file.name,
      fileSize: file.size
    };
    handleMessageReceived(message);
  }

  // Handle connection quality changes
  function handleConnectionQualityChange(quality: 'excellent' | 'good' | 'poor' | 'disconnected', stats: any) {
    setConnectionQuality(quality);
    setBandwidth(stats.bandwidth || 0);
    
    // Auto-adjust video quality based on connection
    if (quality === 'poor' && isVideoEnabled) {
      changeVideoQuality('low');
    } else if (quality === 'good' && isVideoEnabled) {
      changeVideoQuality('medium');
    } else if (quality === 'excellent' && isVideoEnabled) {
      changeVideoQuality('high');
    }
  }

  // Handle connection statistics
  function handleConnectionStats(stats: any) {
    if (stats.bandwidth) {
      setBandwidth(stats.bandwidth);
    }
    
    // Determine connection quality based on bandwidth and packet loss
    const { bandwidth: bw, packetLossRate } = stats;
    if (bw > 1000 && packetLossRate < 0.01) {
      setConnectionQuality('excellent');
    } else if (bw > 500 && packetLossRate < 0.05) {
      setConnectionQuality('good');
    } else if (bw > 200 && packetLossRate < 0.1) {
      setConnectionQuality('poor');
    } else {
      setConnectionQuality('disconnected');
    }
  }

  // Video controls
  const handleToggleVideo = useCallback(() => {
    const enabled = toggleVideo();
    setIsVideoEnabled(enabled);
  }, [toggleVideo]);

  const handleToggleAudio = useCallback(() => {
    const enabled = toggleAudio();
    setIsAudioEnabled(enabled);
  }, [toggleAudio]);

  const handleToggleScreenShare = useCallback(async () => {
    const sharing = await shareScreen();
    setIsScreenSharing(sharing);
  }, [shareScreen]);

  // Chat functions
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'You', // This would be dynamic based on user role
      senderType: 'patient', // This would be dynamic based on user role
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    // Add to local messages
    setMessages(prev => [...prev, message]);
    
    // Send via WebRTC
    await sendWebRTCMessage(message);
    
    setNewMessage('');
  }, [newMessage, sendWebRTCMessage]);

  // File handling functions
  const handleFileUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = Date.now().toString() + i;
      
      try {
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Upload to S3
        const uploadResult = await uploadToS3(file, {
          onProgress: (progress: number) => {
            setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
          }
        });
        
        // Send file via WebRTC
        await sendFile({
          id: fileId,
          file,
          url: uploadResult.url,
          sessionId
        });
        
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        
      } catch (error) {
        console.error('File upload failed:', error);
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }
    }
  }, [uploadToS3, sendFile, sessionId]);

  const handleCameraCapture = useCallback(async () => {
    try {
      const imageData = await captureImage();
      setCapturedImage(imageData);
      
      // Convert to file and upload
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
      
      // Create a FileList with the captured file
      const dt = new DataTransfer();
      dt.items.add(file);
      await handleFileUpload(dt.files);
    } catch (error) {
      console.error('Camera capture failed:', error);
    }
  }, [captureImage, handleFileUpload]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  // Recording functions
  const handleStartRecording = useCallback(async () => {
    try {
      await startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, [startRecording]);

  const handleStopRecording = useCallback(async () => {
    try {
      const recordingUrl = await stopRecording();
      setIsRecording(false);
      
      // Add recording to messages
      const message: Message = {
        id: Date.now().toString(),
        sender: 'System',
        senderType: 'doctor',
        content: 'Session recorded',
        timestamp: new Date(),
        type: 'file',
        fileUrl: recordingUrl,
        fileName: `session-recording-${sessionId}.webm`
      };
      handleMessageReceived(message);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
    }
  }, [stopRecording, sessionId]);

  // End call function
  const handleEndCall = useCallback(async () => {
    try {
      // Generate chat transcript
      const transcript = getChatTranscript(messages);
      
      // Save session data
      const sessionData: ConsultationSession = {
        id: sessionId,
        patientId: patientInfo.id,
        doctorId: doctorInfo.id,
        startTime: sessionStartTime,
        endTime: new Date(),
        sessionFolder: generateSessionFolder(patientInfo.phone, doctorInfo.id, sessionStartTime),
        messages,
        attachments: messages.filter(m => m.fileUrl).map(m => m.fileUrl!)
      };
      
      await saveSessionData(sessionData, transcript);
      
      // Disconnect WebRTC
      disconnect();
      
      // Notify parent component
      onSessionEnd(sessionData);
      
    } catch (error) {
      console.error('Failed to end session properly:', error);
    }
  }, [getChatTranscript, messages, saveSessionData, sessionId, patientInfo, doctorInfo, sessionStartTime, disconnect, onSessionEnd, generateSessionFolder]);

  // Connection quality indicator
  const getConnectionIndicator = () => {
    switch (connectionQuality) {
      case 'excellent':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'good':
        return <Wifi className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <WifiOff className="w-4 h-4 text-orange-500" />;
      case 'disconnected':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-900 relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-white font-semibold">Video Consultation</h1>
            <p className="text-gray-400 text-sm">
              {doctorInfo.name} • {formatTime(callDuration)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getConnectionIndicator()}
            <span className="text-gray-400 text-xs">
              {bandwidth > 0 ? `${bandwidth} kbps` : 'Connecting...'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
              <Circle className="w-3 h-3 text-white animate-pulse fill-current" />
              <span className="text-white text-xs">Recording</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-400 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Area */}
        <div 
          className={`flex-1 relative ${isDragging ? 'bg-blue-900/50' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            className="w-full h-full object-cover"
          />
          
          {/* Local Video */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
              You
            </div>
          </div>

          {/* Drag & Drop Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-blue-600/20 border-4 border-dashed border-blue-400 flex items-center justify-center">
              <div className="bg-blue-600 text-white p-6 rounded-lg text-center">
                <Paperclip className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Drop files to share</p>
                <p className="text-sm opacity-90">Images, documents, and other files</p>
              </div>
            </div>
          )}

          {/* Connection Warning */}
          {connectionQuality === 'poor' && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Poor connection - Video quality reduced</span>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full">
            {/* Audio Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleAudio}
              className={`w-12 h-12 rounded-full ${
                isAudioEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            {/* Video Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-full ${
                isVideoEnabled 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isVideoEnabled ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            {/* Screen Share */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleScreenShare}
              className={`w-12 h-12 rounded-full ${
                isScreenSharing 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <MonitorUp className="w-5 h-5" />
            </Button>

            {/* Chat Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`w-12 h-12 rounded-full relative ${
                isChatOpen 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {messages.length > 0 && !isChatOpen && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {messages.length > 9 ? '9+' : messages.length}
                </div>
              )}
            </Button>

            {/* File Upload */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            {/* Camera Capture */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCameraCapture}
              className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Camera className="w-5 h-5" />
            </Button>

            {/* Recording */}
            <Button
              variant="ghost"
              size="sm"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`w-12 h-12 rounded-full ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isRecording ? <StopCircle className="w-5 h-5" /> : <Circle className="w-5 h-5 fill-current" />}
            </Button>

            {/* End Call */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEndCall}
              className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Phone className="w-5 h-5 transform rotate-45" />
            </Button>
          </div>
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className={`w-80 bg-gray-800 border-l border-gray-700 flex flex-col ${isChatMinimized ? 'h-12' : ''}`}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Chat</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatMinimized(!isChatMinimized)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  {isChatMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isChatMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'patient' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-lg ${
                          message.senderType === 'patient'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        {message.type === 'text' && (
                          <p className="text-sm">{message.content}</p>
                        )}
                        
                        {message.type === 'image' && (
                          <div>
                            <img 
                              src={message.fileUrl} 
                              alt={message.fileName}
                              className="max-w-full h-auto rounded mb-2"
                            />
                            <p className="text-xs opacity-75">{message.fileName}</p>
                          </div>
                        )}
                        
                        {message.type === 'file' && (
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4" />
                            <div>
                              <p className="text-xs font-semibold">{message.fileName}</p>
                              <p className="text-xs opacity-75">
                                {message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : ''}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(message.fileUrl, '_blank')}
                              className="p-1"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        
                        <p className="text-xs opacity-75 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Upload Progress */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-700">
                    {Object.entries(uploadProgress).map(([fileId, progress]) => (
                      <div key={fileId} className="mb-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Uploading file...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-600 text-white p-4 rounded-lg max-w-sm">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
