"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Clinic {
  id: string;
  name: string;
  location: string;
  address: string;
  doctorCount: number;
  image?: string;
}

export default function FindClinics() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locations = [
    'Bengaluru',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai'
  ];

  useEffect(() => {
    // Mock data for clinics
    const mockClinics: Clinic[] = [
      {
        id: '1',
        name: 'Jamesburg Clinics',
        location: 'Bengaluru',
        address: 'Gandhi Nagar, Bengaluru',
        doctorCount: 120,
        image: '/images/clinics/clinic-1.jpg'
      },
      {
        id: '2',
        name: 'Berkshire Medical Clinic',
        location: 'Bengaluru',
        address: 'Koramangala, Bengaluru',
        doctorCount: 120,
        image: '/images/clinics/clinic-2.jpg'
      },
      {
        id: '3',
        name: 'First Priority Clinics',
        location: 'Bengaluru',
        address: 'Indiranagar, Bengaluru',
        doctorCount: 120,
        image: '/images/clinics/clinic-3.jpg'
      },
      {
        id: '4',
        name: 'Medical Zone',
        location: 'Bengaluru',
        address: 'Whitefield, Bengaluru',
        doctorCount: 120,
        image: '/images/clinics/clinic-4.jpg'
      },
      {
        id: '5',
        name: 'Healing Helpers Medical',
        location: 'Bengaluru',
        address: 'HSR Layout, Bengaluru',
        doctorCount: 120,
        image: '/images/clinics/clinic-5.jpg'
      },
      {
        id: '6',
        name: 'Body Regenerate',
        location: 'Bengaluru',
        address: 'Electronic City, Bengaluru',
        doctorCount: 120,
        image: '/images/clinics/clinic-6.jpg'
      }
    ];
    
    setClinics(mockClinics);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    
    // Filter based on search term and location
    try {
      const filtered = clinics.filter(clinic => {
        const matchesSearch = searchTerm ? 
          clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) : 
          true;
        
        const matchesLocation = selectedLocation ? 
          clinic.location === selectedLocation : 
          true;
          
        return matchesSearch && matchesLocation;
      });
      
      setClinics(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClinicSelect = (clinicId: string) => {
    router.push(`/dashboard/clinics/${clinicId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Hospitals & Clinics</h1>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard/find-doctors')}
          >
            View Doctors
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center border rounded-lg p-2 flex-1 bg-gray-50 dark:bg-gray-700">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search hospital & clinic..."
              className="bg-transparent border-none focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-1 md:flex-initial md:w-48">
            <select
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 appearance-none"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All facility types</option>
              <option value="Hospital">Hospitals</option>
              <option value="Clinic">Clinics</option>
              <option value="Medical Center">Medical Centers</option>
            </select>
          </div>
          
          <div className="flex-1 md:flex-initial md:w-48">
            <select
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 appearance-none"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          
          <Button onClick={handleSearch} className="md:w-32">
            Search
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 p-4 rounded-lg text-red-800 dark:text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div>
            <p className="text-gray-600 dark:text-gray-300">
              {clinics.length > 0 ? 
                `Showing ${clinics.length} Health Cares For You` : 
                'No clinics found'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clinics.map((clinic) => (
              <div 
                key={clinic.id}
                onClick={() => handleClinicSelect(clinic.id)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center p-4"
              >
                <div className="bg-blue-100 dark:bg-blue-800 rounded-lg h-16 w-16 flex items-center justify-center mr-4">
                  {clinic.image ? (
                    <img 
                      src={clinic.image} 
                      alt={clinic.name} 
                      className="h-12 w-12 object-contain" 
                    />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center text-blue-500 dark:text-blue-300 text-2xl font-bold">
                      {clinic.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold">{clinic.name}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{clinic.location}</span>
                    <span className="mx-2">•</span>
                    <span>{clinic.doctorCount} doctors</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
