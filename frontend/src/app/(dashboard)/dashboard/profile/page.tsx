'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Save, User, Mail, Phone, Calendar, Home, Key, AlertOctagon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// This is a placeholder profile page
// You'll need to implement a real user profile API service and hook

export default function ProfilePage() {
  // Sample user data - replace with real user data from API
  const [user, setUser] = useState({
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    address: '123 Main St, Anytown, USA',
    profileImage: '/images/profile-placeholder.jpg',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch user profile data from API
    // const fetchUserProfile = async () => {
    //   try {
    //     const userData = await userApi.getUserProfile();
    //     setUser(userData);
    //     setFormData(userData);
    //   } catch (err) {
    //     setError('Failed to load user profile');
    //   }
    // };
    // 
    // fetchUserProfile();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      // Call API to update profile
      // await userApi.updateProfile(formData);
      
      // Update local state
      setUser(formData);
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <AlertOctagon className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                  <Image 
                    src={user.profileImage || "/images/profile-placeholder.jpg"}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button 
                    className="absolute bottom-0 right-0 bg-primary rounded-full p-2 text-white"
                    title="Upload new photo"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">Patient</p>
              </div>
            </div>
            
            <div>
              {isEditing ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}
                >
                  Cancel
                </Button>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-4">Personal Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{user.firstName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{user.lastName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{new Date(user.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Home className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
          
          {!isEditing && (
            <div className="mt-8 border-t pt-6">
              <h3 className="font-medium text-lg mb-4">Security</h3>
              
              <div>
                <Link 
                  href="/dashboard/change-password"
                  className="flex items-center text-primary hover:underline"
                >
                  <Key className="h-5 w-5 mr-2" />
                  Change Password
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
