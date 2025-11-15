"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Users,
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Share,
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Copy,
  ExternalLink
} from 'lucide-react';
import EnhancedVideoCallInterface from '@/components/organisms/EnhancedVideoCall/EnhancedVideoCallInterface';

interface MeetingRoom {
  id: number;
  roomId: string;
  roomName: string;
  description: string;
  hostId: number;
  hostName: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  durationMinutes: number;
  maxParticipants: number;
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
  isRecordingEnabled: boolean;
  isChatEnabled: boolean;
  isFileSharingEnabled: boolean;
  isScreenSharingEnabled: boolean;
  isCameraEnabled: boolean;
  activeParticipantsCount: number;
  joinUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Participant {
  id: number;
  participantId: string;
  participantName: string;
  participantEmail?: string;
  role: 'HOST' | 'MODERATOR' | 'PARTICIPANT' | 'OBSERVER';
  status: 'INVITED' | 'CONNECTED' | 'DISCONNECTED' | 'LEFT';
  joinedAt?: string;
  leftAt?: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  connectionQuality?: string;
}

export default function MeetingRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [meetingRoom, setMeetingRoom] = useState<MeetingRoom | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [browserSupported, setBrowserSupported] = useState(true);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false
  });

  useEffect(() => {
    if (roomId) {
      fetchMeetingRoom();
      checkBrowserSupport();
      checkDevicePermissions();
    }
  }, [roomId]);

  const fetchMeetingRoom = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/v1/meetings/${roomId}`);
      const data = await response.json();

      if (data.success) {
        setMeetingRoom(data.data);
        await fetchParticipants();
      } else {
        setError(data.message || 'Meeting room not found');
      }
    } catch (err) {
      setError('Failed to load meeting room');
      console.error('Error fetching meeting room:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/meetings/${roomId}/participants`);
      const data = await response.json();

      if (data.success) {
        setParticipants(data.data.allParticipants || []);
      }
    } catch (err) {
      console.error('Error fetching participants:', err);
    }
  };

  const checkBrowserSupport = () => {
    const isSupported = !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      typeof window !== 'undefined' &&
      window.RTCPeerConnection
    );
    setBrowserSupported(isSupported);
  };

  const checkDevicePermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setDevicePermissions({
        camera: true,
        microphone: true
      });
      
      // Stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.warn('Device permissions check failed:', err);
      setDevicePermissions({
        camera: false,
        microphone: false
      });
    }
  };

  const joinMeeting = async () => {
    if (!participantName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      const participantId = `participant_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      const response = await fetch(`http://localhost:8080/api/v1/meetings/${roomId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          participantName: participantName.trim(),
          participantEmail: participantEmail.trim() || undefined,
          role: 'PARTICIPANT',
          isAudioEnabled: true,
          isVideoEnabled: true
        }),
      });

      const data = await response.json();

      if (data.success) {
        setHasJoined(true);
        await fetchParticipants();
      } else {
        setError(data.message || 'Failed to join meeting');
      }
    } catch (err) {
      setError('Failed to join meeting');
      console.error('Error joining meeting:', err);
    }
  };

  const copyJoinLink = () => {
    const joinLink = `${window.location.origin}/dashboard/meeting/${roomId}`;
    navigator.clipboard.writeText(joinLink);
    // Could add a toast notification here
  };

  const handleSessionEnd = (sessionData: any) => {
    setHasJoined(false);
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meeting room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Meeting Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!meetingRoom) {
    return null;
  }

  // If user has joined, show the video call interface
  if (hasJoined) {
    return (
      <EnhancedVideoCallInterface
        sessionId={roomId}
        patientInfo={{
          id: `participant_${Date.now()}`,
          name: participantName,
          phone: participantEmail || 'demo@example.com'
        }}
        doctorInfo={{
          id: meetingRoom.hostId.toString(),
          name: meetingRoom.hostName,
          specialty: 'Video Conference Host'
        }}
        onSessionEnd={handleSessionEnd}
      />
    );
  }

  // Pre-call lobby
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{meetingRoom.roomName}</h1>
              <p className="text-gray-600 mt-1">{meetingRoom.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                meetingRoom.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800'
                  : meetingRoom.status === 'SCHEDULED'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {meetingRoom.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meeting Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Meeting Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Start Time</p>
                    <p className="font-medium">
                      {new Date(meetingRoom.scheduledStartTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{meetingRoom.durationMinutes} minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium">
                      {meetingRoom.activeParticipantsCount} / {meetingRoom.maxParticipants}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Video className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Host</p>
                    <p className="font-medium">{meetingRoom.hostName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Features</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`h-5 w-5 ${meetingRoom.isRecordingEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={meetingRoom.isRecordingEnabled ? 'text-green-700' : 'text-gray-500'}>
                    Recording
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`h-5 w-5 ${meetingRoom.isChatEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={meetingRoom.isChatEnabled ? 'text-green-700' : 'text-gray-500'}>
                    Chat Messages
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`h-5 w-5 ${meetingRoom.isFileSharingEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={meetingRoom.isFileSharingEnabled ? 'text-green-700' : 'text-gray-500'}>
                    File Sharing
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`h-5 w-5 ${meetingRoom.isScreenSharingEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={meetingRoom.isScreenSharingEnabled ? 'text-green-700' : 'text-gray-500'}>
                    Screen Sharing
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`h-5 w-5 ${meetingRoom.isCameraEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={meetingRoom.isCameraEnabled ? 'text-green-700' : 'text-gray-500'}>
                    Camera Access
                  </span>
                </div>
              </div>
            </div>

            {/* System Check */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Check</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Browser Support</span>
                  <div className="flex items-center space-x-2">
                    {browserSupported ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className={browserSupported ? 'text-green-700' : 'text-red-700'}>
                      {browserSupported ? 'Supported' : 'Not Supported'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Camera Access</span>
                  <div className="flex items-center space-x-2">
                    {devicePermissions.camera ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className={devicePermissions.camera ? 'text-green-700' : 'text-yellow-700'}>
                      {devicePermissions.camera ? 'Granted' : 'Permission Needed'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Microphone Access</span>
                  <div className="flex items-center space-x-2">
                    {devicePermissions.microphone ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className={devicePermissions.microphone ? 'text-green-700' : 'text-yellow-700'}>
                      {devicePermissions.microphone ? 'Granted' : 'Permission Needed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Join Meeting</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  onClick={joinMeeting}
                  disabled={!participantName.trim() || !browserSupported}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </Button>
              </div>
            </div>

            {/* Share Link */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Share Meeting</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/dashboard/meeting/${roomId}`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <Button
                    onClick={copyJoinLink}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Room ID: <span className="font-mono font-medium">{roomId}</span>
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Participants ({participants.length})
              </h2>
              <div className="space-y-2">
                {participants.length === 0 ? (
                  <p className="text-gray-500 text-sm">No participants yet</p>
                ) : (
                  participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{participant.participantName}</p>
                        <p className="text-xs text-gray-500">
                          {participant.role} • {participant.status}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {participant.isAudioEnabled ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ) : (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                        {participant.isVideoEnabled ? (
                          <Video className="h-3 w-3 text-green-500" />
                        ) : (
                          <Video className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
