"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Video,
  Users,
  Calendar,
  Clock,
  Settings,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';

export default function DemoPage() {
  const router = useRouter();
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<any>(null);

  const createDemoRoom = async () => {
    setCreatingRoom(true);
    try {
      const roomId = 'room123'; // Fixed room ID as requested
      const response = await fetch(`http://localhost:8080/api/v1/meetings/quick-create/${roomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setCreatedRoom(data.data);
      } else {
        alert('Error creating room: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating demo room:', error);
      alert('Failed to create demo room');
    } finally {
      setCreatingRoom(false);
    }
  };

  const joinRoom = () => {
    if (createdRoom) {
      router.push(`/dashboard/meeting/${createdRoom.roomId}`);
    }
  };

  const copyJoinLink = () => {
    if (createdRoom) {
      const link = `${window.location.origin}/dashboard/meeting/${createdRoom.roomId}`;
      navigator.clipboard.writeText(link);
      alert('Join link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Video Call Demo</h1>
          <p className="text-gray-600 text-lg">
            Test our enhanced video calling system with WebRTC, messaging, file sharing, and more!
          </p>
        </div>

        {!createdRoom ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Video className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Create Demo Meeting Room
            </h2>
            <p className="text-gray-600 mb-6">
              Click the button below to create a demo meeting room with ID <strong>"room123"</strong>.
              <br />
              The room will be active for 15 minutes with all features enabled.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Chat Messages</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">File Sharing</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Screen Sharing</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Recording</span>
              </div>
            </div>

            <Button
              onClick={createDemoRoom}
              disabled={creatingRoom}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              {creatingRoom ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Room...
                </>
              ) : (
                <>
                  <Video className="h-5 w-5 mr-2" />
                  Create Demo Room (room123)
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
              Demo Room Created Successfully!
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Room ID</p>
                    <p className="font-mono font-medium">{createdRoom.roomId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Room Name</p>
                    <p className="font-medium">{createdRoom.roomName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{createdRoom.durationMinutes} minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-green-600">{createdRoom.status}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Test Instructions:</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Open the join link in multiple browser tabs/windows to simulate different participants</li>
                <li>• Test video, audio, chat messaging, file sharing, and screen sharing features</li>
                <li>• Try camera capture functionality and drag-and-drop file uploads</li>
                <li>• Session recording and bandwidth monitoring are also enabled</li>
                <li>• Meeting will automatically end after 15 minutes</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={joinRoom}
                className="bg-green-600 hover:bg-green-700 px-6 py-3"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Join Meeting Room
              </Button>
              
              <Button
                onClick={copyJoinLink}
                variant="outline"
                className="px-6 py-3"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copy Join Link
              </Button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Join Link:</strong> <br />
                <code className="bg-white px-2 py-1 rounded text-xs">
                  {window.location.origin}/dashboard/meeting/{createdRoom.roomId}
                </code>
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This is a demonstration of the enhanced video calling system.</p>
          <p>Backend: Spring Boot with WebRTC signaling • Frontend: Next.js with React</p>
        </div>
      </div>
    </div>
  );
}
