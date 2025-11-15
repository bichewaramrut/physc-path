import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';

interface ProfilePhotoProps {
  profilePhotoUrl: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
  onPrevious: () => void;
  loading: boolean;
  error: string | null;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  profilePhotoUrl,
  onFileChange,
  onNext,
  onPrevious,
  loading,
  error,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Handle starting camera capture
  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access your camera. Please check your permissions or use the upload option.');
    }
  };
  
  // Handle taking a photo from the camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob and create a file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            
            // Create a synthetic event to pass to onFileChange
            const event = {
              target: {
                files: [file],
                name: 'profilePhoto',
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            
            onFileChange(event);
            stopCapture();
          }
        }, 'image/jpeg', 0.9); // 90% quality JPEG
      }
    }
  };
  
  // Stop the camera stream
  const stopCapture = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCapturing(false);
    }
  };
  
  // Handle file upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle clearing the photo
  const handleClearPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Create a synthetic event to clear the file
    const event = {
      target: {
        files: null,
        name: 'profilePhoto',
        value: '',
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onFileChange(event);
  };

  const [useFileUpload, setUseFileUpload] = useState(false);

  // Handle file change from FileUpload component
  const handleFileUploadChange = async (file: File | null) => {
    if (file) {
      const event = {
        target: {
          files: [file],
          name: 'profilePhoto',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileChange(event);
    } else {
      handleClearPhoto();
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Photo</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Choose how you'd like to add your profile picture
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-4">
        <Button
          type="button"
          variant={!useFileUpload ? "default" : "outline"}
          onClick={() => setUseFileUpload(false)}
          className={!useFileUpload ? "bg-[#F26E5C] hover:bg-[#e05a47] text-white" : ""}
        >
          <Camera size={16} className="mr-2" /> Take Selfie
        </Button>
        <Button
          type="button"
          variant={useFileUpload ? "default" : "outline"}
          onClick={() => setUseFileUpload(true)}
          className={useFileUpload ? "bg-[#F26E5C] hover:bg-[#e05a47] text-white" : ""}
        >
          <Upload size={16} className="mr-2" /> Upload Photo
        </Button>
      </div>

      {useFileUpload ? (
        <FileUpload
          accept="image/*"
          maxFileSize={5 * 1024 * 1024} // 5MB
          label="Profile Photo"
          description="Upload a clear, recent photo of your face"
          onFileChange={handleFileUploadChange}
          fileUrl={profilePhotoUrl}
          fileName={profilePhotoUrl ? "Profile photo" : ""}
          error={error || ""}
        />
      ) : (
        <div className="flex flex-col items-center">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
          
          {/* Camera canvas (hidden) */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Image preview or video display */}
          <div className="relative w-48 h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg mb-4 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            {isCapturing ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : profilePhotoUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={profilePhotoUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleClearPhoto}
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
                  aria-label="Remove photo"
                >
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            ) : (
              <div className="text-gray-400 text-center">
                <div className="flex justify-center">
                  <Camera size={48} />
                </div>
                <p className="mt-2 text-sm">No photo selected</p>
              </div>
            )}
          </div>
          
          {/* Camera controls */}
          {isCapturing ? (
            <div className="space-x-2 mb-4">
              <Button
                type="button"
                onClick={capturePhoto}
                className="bg-[#F26E5C] hover:bg-[#e05a47] text-white py-2 px-4"
              >
                Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={stopCapture}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 mb-4">
              <Button
                type="button"
                onClick={startCapture}
                className="bg-[#F26E5C] hover:bg-[#e05a47] text-white py-2 px-4"
              >
                Start Camera
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadClick}
                className="flex items-center"
              >
                <Upload size={16} className="mr-2" /> Upload Photo
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="pt-4 flex flex-col space-y-3">
        <Button
          type="button"
          className="w-full bg-[#F26E5C] hover:bg-[#e05a47] text-white py-2 px-4"
          onClick={onNext}
          disabled={loading || (!profilePhotoUrl && !isCapturing)}
        >
          Continue
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onPrevious}
          disabled={loading}
        >
          Back
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Your profile photo helps build trust. It should clearly show your face and be a recent photo.
        </p>
      </div>
    </div>
  );
};

export default ProfilePhoto;
