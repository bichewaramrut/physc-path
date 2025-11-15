"use client";

import { useEffect, useRef, useState } from 'react';

export default function SimpleWebSocketTest() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const connect = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('Already connected');
      return;
    }

    console.log('Connecting to WebSocket...');
    const socket = new WebSocket('ws://localhost:8080/api/ws/rtc?sessionId=simple-test');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✓ Connected successfully');
      setConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      console.log('Received:', event.data);
      setMessages(prev => [...prev, event.data]);
    };

    socket.onclose = (event) => {
      console.log('Disconnected. Code:', event.code, 'Reason:', event.reason);
      setConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection failed');
    };
  };

  const disconnect = () => {
    if (socketRef.current) {
      console.log('Disconnecting...');
      socketRef.current.close(1000, 'User disconnected');
      socketRef.current = null;
      setConnected(false);
    }
  };

  const sendMessage = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: 'user-joined',
        from: 'test-user'
      });
      socketRef.current.send(message);
      console.log('Sent message:', message);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Simple WebSocket Test</h1>
        
        <div className="mb-4">
          <p>Status: <span className={connected ? 'text-green-600' : 'text-red-600'}>
            {connected ? 'Connected' : 'Disconnected'}
          </span></p>
          {error && <p className="text-red-600">{error}</p>}
        </div>

        <div className="space-y-2 mb-4">
          <button 
            onClick={connect}
            disabled={connected}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Connect
          </button>
          <button 
            onClick={disconnect}
            disabled={!connected}
            className="w-full bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Disconnect
          </button>
          <button 
            onClick={sendMessage}
            disabled={!connected}
            className="w-full bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Send Test Message
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Messages:</h3>
          <div className="max-h-32 overflow-y-auto text-sm">
            {messages.map((msg, i) => (
              <div key={i} className="p-1 border-b">{msg}</div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>Check browser console for detailed logs</p>
        </div>
      </div>
    </div>
  );
}
