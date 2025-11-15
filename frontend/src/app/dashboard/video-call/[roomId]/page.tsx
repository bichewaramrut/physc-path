"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  MonitorUp, 
  MessageSquare, 
  Phone, 
  Settings, 
  Users,
  AlertTriangle 
} from 'lucide-react';
import Image from 'next/image';
import useWebRTC from '@/hooks/useWebRTC';

interface VideoConsultationProps {
  params: {
    roomId: string;
  };
}

export default function VideoConsultation({ params }: VideoConsultationProps) {
  const { roomId } = params;
  
  // Replace state variables with WebRTC hook
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [participantCount, setParticipantCount] = useState(2);
  const [doctorInfo, setDoctorInfo] = useState({
    name: 'Dr. Sarah Wilson',
    specialty: 'Psychiatrist',
    initials: 'SW'
  });
  
  // Use the WebRTC hook
  // In a real implementation, you would get the token from your auth context
  const token = "sample-token";
  const {
    localStream,
    remoteStreams,
    localVideoRef,
    isConnected,
    error,
    initWebRTC,
    toggleVideo,
    toggleAudio,
    shareScreen
  } = useWebRTC({ sessionId: roomId, token });
  
  // Track video/audio state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Set up remote video ref
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Mock messages for the chat
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Sarah Wilson', text: 'Hello John, how are you feeling today?', time: '10:02 AM' },
    { id: 2, sender: 'You', text: 'I\'m feeling better than last week. The new techniques are helping with my anxiety.', time: '10:03 AM' },
    { id: 3, sender: 'Dr. Sarah Wilson', text: 'That\'s great to hear! Let\'s discuss how we can build on that progress.', time: '10:04 AM' },
  ]);
  
  const [newMessage, setNewMessage] = useState('');

  // Initialize WebRTC when component mounts
  useEffect(() => {
    const initialize = async () => {
      const stream = await initWebRTC();
      if (stream && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    };
    
    initialize();
    
    return () => {
      // Cleanup handled by the hook
    };
  }, [initWebRTC]);

  // Update remote stream when it changes
  useEffect(() => {
    const streams = Object.values(remoteStreams);
    if (streams.length > 0 && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = streams[0];
      setParticipantCount(streams.length + 1); // +1 for local participant
    }
  }, [remoteStreams]);

  // Handle toggling video
  const handleToggleVideo = () => {
    const isEnabled = toggleVideo();
    setIsVideoEnabled(isEnabled);
  };

  // Handle toggling audio
  const handleToggleAudio = () => {
    const isEnabled = toggleAudio();
    setIsAudioEnabled(isEnabled);
  };

  // Handle screen sharing
  const handleToggleScreenShare = async () => {
    const isSharing = await shareScreen();
    setIsScreenSharing(isSharing);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const endCall = () => {
    // Cleanup handled by the hook
    window.location.href = '/dashboard';
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'You',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {error ? 'Connection Error' : 'Call ended'}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {error ? error : 'Redirecting to dashboard...'}
          </p>
          {error && (
            <Button onClick={() => window.location.href = '/dashboard'} className="mt-4 bg-[#F26E5C]">
              Return to Dashboard
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Video area */}
      <div className="flex-1 flex">
        {/* Main video content area */}
        <div className="flex-1 relative overflow-hidden bg-black">
          {/* Doctor's video (remote view) */}
          <div className="w-full h-full flex items-center justify-center">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              style={{ display: Object.keys(remoteStreams).length > 0 ? 'block' : 'none' }}
            />
            
            {Object.keys(remoteStreams).length === 0 && (
              <div className="flex flex-col items-center justify-center text-white">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Waiting for doctor to join</h2>
                <p className="text-gray-300">Your camera and microphone are active</p>
              </div>
            )}
            
            {/* Status badges */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                Live
              </div>
              <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {participantCount}
              </div>
            </div>
            
            {/* Patient's video (self view) */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: isVideoEnabled ? 'block' : 'none' }}
              />
              
              {!isVideoEnabled && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-500 mx-auto mb-1 flex items-center justify-center">
                      <span>JD</span>
                    </div>
                    <div className="text-sm">Camera Off</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat sidebar (conditionally rendered) */}
        {isChatOpen && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-medium text-gray-900 dark:text-white">Chat</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="sr-only">Close chat</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6l12 12"></path>
                </svg>
              </Button>
            </div>
            
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'You' 
                      ? 'bg-[#F26E5C] text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    {message.sender !== 'You' && (
                      <div className="font-medium text-xs mb-1">{message.sender}</div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'You' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-300 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 rounded-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 py-2 text-sm focus:ring-[#F26E5C] focus:border-[#F26E5C]"
                  placeholder="Type your message..."
                />
                <Button type="submit" size="icon" className="rounded-full bg-[#F26E5C] hover:bg-[#e05a47]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 2L11 13"></path>
                    <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                  </svg>
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Video controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
        <Button
          onClick={handleToggleAudio}
          variant={isAudioEnabled ? "default" : "destructive"}
          size="icon"
          className={isAudioEnabled ? "bg-gray-700 hover:bg-gray-600" : ""}
        >
          {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button
          onClick={handleToggleVideo}
          variant={isVideoEnabled ? "default" : "destructive"}
          size="icon"
          className={isVideoEnabled ? "bg-gray-700 hover:bg-gray-600" : ""}
        >
          {isVideoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button
          onClick={handleToggleScreenShare}
          variant={isScreenSharing ? "default" : "outline"}
          size="icon"
          className={isScreenSharing ? "bg-[#F26E5C] hover:bg-[#e05a47]" : "border-gray-600 text-gray-300"}
        >
          <MonitorUp className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={toggleChat}
          variant={isChatOpen ? "default" : "outline"}
          size="icon"
          className={isChatOpen ? "bg-[#F26E5C] hover:bg-[#e05a47]" : "border-gray-600 text-gray-300"}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="border-gray-600 text-gray-300"
        >
          <Settings className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={endCall}
          variant="destructive"
          size="icon"
          className="bg-red-600 hover:bg-red-700 px-6"
        >
          <Phone className="h-5 w-5 rotate-225" />
        </Button>
      </div>
    </div>
  );
}
