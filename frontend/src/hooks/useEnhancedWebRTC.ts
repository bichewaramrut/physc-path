'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize?: number;
  bundlePolicy?: RTCBundlePolicy;
  rtcpMuxPolicy?: RTCRtcpMuxPolicy;
  iceTransportPolicy?: RTCIceTransportPolicy;
}

interface SignalingMessage {
  type: string;
  from?: string;
  to?: string;
  sessionId?: string;
  data?: any;
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

interface FileData {
  id: string;
  file: File;
  url: string;
  sessionId: string;
}

interface RemoteStreamsMap {
  [participantId: string]: MediaStream;
}

interface PeerConnectionsMap {
  [participantId: string]: RTCPeerConnection;
}

interface ConnectionStats {
  bandwidth: number;
  packetLossRate: number;
  roundTripTime: number;
  jitter: number;
}

interface UseEnhancedWebRTCProps {
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
  onMessageReceived: (message: Message) => void;
  onFileReceived: (file: { id: string; url: string; name: string; type: string; size: number; sender: string }) => void;
  onConnectionQualityChange: (quality: 'excellent' | 'good' | 'poor' | 'disconnected', stats: ConnectionStats) => void;
}

interface UseEnhancedWebRTCReturn {
  localStream: MediaStream | null;
  remoteStreams: RemoteStreamsMap;
  isConnected: boolean;
  connectionStats: ConnectionStats | null;
  error: string | null;
  initWebRTC: () => Promise<MediaStream | null>;
  toggleVideo: () => boolean;
  toggleAudio: () => boolean;
  shareScreen: () => Promise<boolean>;
  sendMessage: (message: Message) => Promise<void>;
  sendFile: (fileData: FileData) => Promise<void>;
  captureImage: () => Promise<string>;
  getConnectionStats: () => Promise<ConnectionStats>;
  changeVideoQuality: (quality: 'low' | 'medium' | 'high') => void;
  disconnect: () => void;
}

const useEnhancedWebRTC = ({
  sessionId,
  patientInfo,
  doctorInfo,
  onMessageReceived,
  onFileReceived,
  onConnectionQualityChange
}: UseEnhancedWebRTCProps): UseEnhancedWebRTCReturn => {
  // State for managing local and remote streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreamsMap>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStats, setConnectionStats] = useState<ConnectionStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoQuality, setCurrentVideoQuality] = useState<'low' | 'medium' | 'high'>('high');

  // Refs for WebRTC connections
  const peerConnections = useRef<PeerConnectionsMap>({});
  const socketRef = useRef<WebSocket | null>(null);
  const webRTCConfigRef = useRef<WebRTCConfig | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);

  // Video quality constraints
  const getVideoConstraints = useCallback((quality: 'low' | 'medium' | 'high') => {
    switch (quality) {
      case 'low':
        return {
          width: { ideal: 320 },
          height: { ideal: 240 },
          frameRate: { ideal: 15, max: 15 },
          bitrate: 150000
        };
      case 'medium':
        return {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24, max: 30 },
          bitrate: 500000
        };
      case 'high':
        return {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 30 },
          bitrate: 1500000
        };
    }
  }, []);

  // Send a signaling message through the WebSocket
  const sendSignalingMessage = useCallback((message: Partial<SignalingMessage>) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }
    
    const fullMessage = {
      sessionId,
      ...message
    };
    
    socketRef.current.send(JSON.stringify(fullMessage));
  }, [sessionId]);

  // Close a specific peer connection
  const closePeerConnection = useCallback((participantId: string) => {
    const peerConnection = peerConnections.current[participantId];
    
    if (peerConnection) {
      peerConnection.close();
      delete peerConnections.current[participantId];
      
      setRemoteStreams(prev => {
        const newStreams = { ...prev };
        delete newStreams[participantId];
        return newStreams;
      });
    }
  }, []);

  // Create a peer connection to a participant
  const createPeerConnection = useCallback(async (participantId: string) => {
    if (!webRTCConfigRef.current) {
      throw new Error('WebRTC configuration not loaded');
    }

    const peerConnection = new RTCPeerConnection(webRTCConfigRef.current);
    peerConnections.current[participantId] = peerConnection;

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Create data channel for messaging and file sharing
    const dataChannel = peerConnection.createDataChannel('messages', {
      ordered: true
    });
    
    dataChannel.onopen = () => {
      console.log('Data channel opened with', participantId);
      dataChannelRef.current = dataChannel;
    };

    dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          onMessageReceived(data.payload);
        } else if (data.type === 'file') {
          onFileReceived(data.payload);
        }
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };

    // Handle incoming data channel
    peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'message') {
            onMessageReceived(data.payload);
          } else if (data.type === 'file') {
            onFileReceived(data.payload);
          }
        } catch (error) {
          console.error('Error parsing data channel message:', error);
        }
      };
    };

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => ({
        ...prev,
        [participantId]: remoteStream
      }));
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignalingMessage({
          type: 'ice-candidate',
          to: participantId,
          data: event.candidate
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      console.log(`Connection state with ${participantId}:`, state);
      
      if (state === 'connected') {
        setIsConnected(true);
      } else if (state === 'disconnected' || state === 'failed') {
        setIsConnected(false);
        closePeerConnection(participantId);
      }
    };

    return peerConnection;
  }, [localStream, sendSignalingMessage, closePeerConnection, onMessageReceived, onFileReceived]);

  // Create and send an offer
  const createOffer = useCallback(async (participantId: string) => {
    const peerConnection = await createPeerConnection(participantId);
    
    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    
    await peerConnection.setLocalDescription(offer);
    
    sendSignalingMessage({
      type: 'offer',
      to: participantId,
      data: offer
    });
  }, [createPeerConnection, sendSignalingMessage]);

  // Handle incoming offer
  const handleOffer = useCallback(async (from: string, offer: RTCSessionDescriptionInit) => {
    const peerConnection = await createPeerConnection(from);
    
    await peerConnection.setRemoteDescription(offer);
    
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    sendSignalingMessage({
      type: 'answer',
      to: from,
      data: answer
    });
  }, [createPeerConnection, sendSignalingMessage]);

  // Handle incoming answer
  const handleAnswer = useCallback(async (from: string, answer: RTCSessionDescriptionInit) => {
    const peerConnection = peerConnections.current[from];
    
    if (peerConnection) {
      await peerConnection.setRemoteDescription(answer);
    }
  }, []);

  // Handle incoming ICE candidate
  const handleIceCandidate = useCallback(async (from: string, candidate: RTCIceCandidateInit) => {
    const peerConnection = peerConnections.current[from];
    
    if (peerConnection) {
      await peerConnection.addIceCandidate(candidate);
    }
  }, []);

  // Handle signaling messages
  const handleSignalingMessage = useCallback(async (message: SignalingMessage) => {
    const { type, from, data } = message;
    
    if (!from) return;
    
    switch (type) {
      case 'user-joined':
        // Create offer for new user
        await createOffer(from);
        break;
        
      case 'offer':
        // Received an offer from another user
        await handleOffer(from, data);
        break;
        
      case 'answer':
        // Received an answer to our offer
        await handleAnswer(from, data);
        break;
        
      case 'ice-candidate':
        // Received ICE candidate
        await handleIceCandidate(from, data);
        break;
        
      case 'user-left':
        // User left the session
        closePeerConnection(from);
        break;
        
      default:
        console.warn('Unknown message type:', type);
    }
  }, [createOffer, handleOffer, handleAnswer, handleIceCandidate, closePeerConnection]);

  // Connect to signaling server via WebSocket
  const connectSignalingServer = useCallback(() => {
    // Don't create new connection if already connected or connecting
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected, skipping...');
      return;
    }
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket already connecting, skipping...');
      return;
    }

    // Clean up any existing socket in bad state
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch (error) {
        console.log('Error closing previous socket:', error);
      }
      socketRef.current = null;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Connect to backend WebSocket server
    const wsUrl = `${protocol}//localhost:8080/api/ws/rtc?sessionId=${sessionId}`;
    
    console.log('Attempting WebSocket connection to:', wsUrl);
    console.log('Session ID:', sessionId);
    console.log('Patient ID:', patientInfo.id);
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    socket.onopen = () => {
      console.log('✓ Connected to signaling server successfully');
      setIsConnected(true);
      setError(null);
      
      // Announce presence
      sendSignalingMessage({
        type: 'user-joined',
        from: patientInfo.id // This would be dynamic based on current user
      });
    };
    
    socket.onmessage = async (event) => {
      try {
        console.log('Received signaling message:', event.data);
        const message = JSON.parse(event.data) as SignalingMessage;
        await handleSignalingMessage(message);
      } catch (err) {
        console.error('Error parsing signaling message:', err);
      }
    };
    
    socket.onclose = (event) => {
      console.log('Disconnected from signaling server. Code:', event.code, 'Reason:', event.reason, 'Clean:', event.wasClean);
      setIsConnected(false);
      
      // Clear the socket reference if this is the current socket
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
      
      // Disable automatic reconnection to prevent rapid connection cycles
      // Let the user manually reconnect if needed
      console.log('WebSocket disconnected. Manual reconnection required.');
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error details:', error);
      console.error('WebSocket state:', socket.readyState);
      console.error('WebSocket URL was:', wsUrl);
      setError('WebSocket connection error - proceeding without real-time signaling');
      // Don't let WebSocket errors completely block video functionality
    };
  }, [sessionId, handleSignalingMessage, sendSignalingMessage, patientInfo.id]);

  // Initialize WebRTC
  const initWebRTC = useCallback(async () => {
    try {
      // Get WebRTC config from server (STUN/TURN servers)
      console.log('Fetching WebRTC configuration...');
      const configResponse = await fetch('/api/video/webrtc-config');
      if (!configResponse.ok) {
        console.warn('Failed to fetch WebRTC config from server, using fallback');
        // Use fallback config if server is unavailable
        webRTCConfigRef.current = {
          iceServers: [
            { urls: ['stun:stun.l.google.com:19302'] },
            { urls: ['stun:stun1.l.google.com:19302'] }
          ]
        };
      } else {
        const response = await configResponse.json();
        console.log('WebRTC config response:', response);
        // Extract the actual config from the response data
        webRTCConfigRef.current = response.success ? response.data : response;
        console.log('WebRTC config loaded:', webRTCConfigRef.current);
      }
      
      // Get media stream with current quality settings
      const videoConstraints = getVideoConstraints(currentVideoQuality);
      console.log('Requesting user media with constraints:', { audio: true, video: videoConstraints });
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: videoConstraints
      });
      
      console.log('Local stream acquired:', stream);
      setLocalStream(stream);
      
      // Try to connect to signaling server
      try {
        connectSignalingServer();
      } catch (wsError) {
        console.warn('WebSocket connection failed, continuing without signaling:', wsError);
        // Continue without WebSocket for now
      }
      
      return stream;
    } catch (err) {
      console.error('WebRTC initialization error:', err);
      setError(err instanceof Error ? err.message : 'Unknown WebRTC initialization error');
      return null;
    }
  }, [currentVideoQuality, getVideoConstraints, connectSignalingServer]);

  // Toggle video
  const toggleVideo = useCallback((): boolean => {
    if (!localStream) return false;
    
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      return videoTrack.enabled;
    }
    
    return false;
  }, [localStream]);

  // Toggle audio
  const toggleAudio = useCallback((): boolean => {
    if (!localStream) return false;
    
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      return audioTrack.enabled;
    }
    
    return false;
  }, [localStream]);

  // Share screen
  const shareScreen = useCallback(async (): Promise<boolean> => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      
      Object.values(peerConnections.current).forEach((pc) => {
        const sender = pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });
      
      // Handle when user stops sharing screen
      videoTrack.addEventListener('ended', () => {
        // Restore camera video
        if (localStream) {
          const cameraTrack = localStream.getVideoTracks()[0];
          
          Object.values(peerConnections.current).forEach((pc) => {
            const sender = pc.getSenders().find(s => 
              s.track && s.track.kind === 'video'
            );
            
            if (sender && cameraTrack) {
              sender.replaceTrack(cameraTrack);
            }
          });
        }
      });
      
      return true;
    } catch (error) {
      console.error('Screen sharing failed:', error);
      return false;
    }
  }, [localStream]);

  // Send message via data channel
  const sendMessage = useCallback(async (message: Message): Promise<void> => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      const data = {
        type: 'message',
        payload: message
      };
      
      dataChannelRef.current.send(JSON.stringify(data));
    } else {
      console.error('Data channel not open');
      throw new Error('Data channel not available');
    }
  }, []);

  // Send file via data channel
  const sendFile = useCallback(async (fileData: FileData): Promise<void> => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      const data = {
        type: 'file',
        payload: {
          id: fileData.id,
          url: fileData.url,
          name: fileData.file.name,
          type: fileData.file.type,
          size: fileData.file.size,
          sender: patientInfo.id // This would be dynamic based on current user
        }
      };
      
      dataChannelRef.current.send(JSON.stringify(data));
    } else {
      console.error('Data channel not open');
      throw new Error('Data channel not available');
    }
  }, [patientInfo.id]);

  // Capture image from video stream
  const captureImage = useCallback(async (): Promise<string> => {
    if (!localStream) {
      throw new Error('No local stream available');
    }

    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) {
      throw new Error('No video track available');
    }

    // Create a canvas to capture the frame
    const canvas = document.createElement('canvas');
    const video = document.createElement('video');
    
    return new Promise((resolve, reject) => {
      video.srcObject = new MediaStream([videoTrack]);
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        ctx.drawImage(video, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      });
    });
  }, [localStream]);

  // Get connection statistics
  const getConnectionStats = useCallback(async (): Promise<ConnectionStats> => {
    const connections = Object.values(peerConnections.current);
    if (connections.length === 0) {
      return {
        bandwidth: 0,
        packetLossRate: 0,
        roundTripTime: 0,
        jitter: 0
      };
    }

    const stats = await connections[0].getStats();
    let bandwidth = 0;
    let packetLossRate = 0;
    let roundTripTime = 0;
    let jitter = 0;

    stats.forEach((report) => {
      if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
        bandwidth = report.bytesReceived * 8 / 1000; // Convert to kbps
        packetLossRate = report.packetsLost / (report.packetsLost + report.packetsReceived) || 0;
      }
      
      if (report.type === 'candidate-pair' && report.state === 'succeeded') {
        roundTripTime = report.currentRoundTripTime || 0;
      }
      
      if (report.type === 'inbound-rtp' && report.mediaType === 'audio') {
        jitter = report.jitter || 0;
      }
    });

    const connectionStats = {
      bandwidth,
      packetLossRate,
      roundTripTime,
      jitter
    };

    setConnectionStats(connectionStats);
    
    // Determine connection quality
    let quality: 'excellent' | 'good' | 'poor' | 'disconnected' = 'excellent';
    if (bandwidth === 0) {
      quality = 'disconnected';
    } else if (bandwidth < 200 || packetLossRate > 0.1) {
      quality = 'poor';
    } else if (bandwidth < 500 || packetLossRate > 0.05) {
      quality = 'good';
    }
    
    onConnectionQualityChange(quality, connectionStats);
    
    return connectionStats;
  }, [onConnectionQualityChange]);

  // Change video quality
  const changeVideoQuality = useCallback((quality: 'low' | 'medium' | 'high') => {
    setCurrentVideoQuality(quality);
    
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        const constraints = getVideoConstraints(quality);
        videoTrack.applyConstraints(constraints).catch(console.error);
      }
    }
  }, [localStream, getVideoConstraints]);

  // Disconnect from session
  const disconnect = useCallback(() => {
    console.log('Disconnecting from session...');
    
    // Close all peer connections
    Object.keys(peerConnections.current).forEach(participantId => {
      closePeerConnection(participantId);
    });
    
    // Close WebSocket with clean close code
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('Closing WebSocket connection...');
      socketRef.current.close(1000, 'User disconnected'); // Clean close
      socketRef.current = null;
    }
    
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Reset state
    setIsConnected(false);
    setRemoteStreams({});
    setError(null);
  }, [localStream, closePeerConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    localStream,
    remoteStreams,
    isConnected,
    connectionStats,
    error,
    initWebRTC,
    toggleVideo,
    toggleAudio,
    shareScreen,
    sendMessage,
    sendFile,
    captureImage,
    getConnectionStats,
    changeVideoQuality,
    disconnect
  };
};

export default useEnhancedWebRTC;
