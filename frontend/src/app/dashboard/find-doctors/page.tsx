"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, MapPin, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppointments } from '@/hooks/useAppointments';

export default function FindDoctors() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  
  const { doctors, loading, error, fetchDoctors } = useAppointments();
  
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const specialties = [
    'All',
    'Clinical Psychologist',
    'Psychiatrist',
    'Therapist',
    'Mental Health Counselor',
    'Child Psychologist'
  ];
  
  const locations = [
    'Bengaluru',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai'
  ];
  
  const handleSearch = () => {
    fetchDoctors({
      specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
      location: selectedLocation || undefined,
      searchTerm: searchTerm || undefined,
      sortBy
    });
  };
  
  const handleDoctorSelect = (doctorId: string) => {
    router.push(`/dashboard/book-appointment/${doctorId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold">Find Doctors</h1>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard/find-clinics')}
          >
            View Clinics
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center border rounded-lg p-2 bg-gray-50 dark:bg-gray-700">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="bg-transparent border-none focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 appearance-none"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            <Filter className="h-4 w-4 absolute right-3 top-3 text-gray-500 dark:text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 appearance-none"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Any Location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <MapPin className="h-4 w-4 absolute right-3 top-3 text-gray-500 dark:text-gray-400" />
          </div>
          
          <Button onClick={handleSearch}>
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
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300">
              {doctors && doctors.length > 0 ? 
                `Showing ${doctors.length} doctors` : 
                'No doctors found'}
            </p>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
              <select
                className="p-1 text-sm border rounded bg-gray-50 dark:bg-gray-700"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  handleSearch();
                }}
              >
                <option value="rating">Rating (High to Low)</option>
                <option value="price_low">Price (Low to High)</option>
                <option value="price_high">Price (High to Low)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors && doctors.map((doctor) => (
              <div 
                key={doctor.id}
                className="bg-white dark:bg-gray-800 border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleDoctorSelect(doctor.id)}
              >
                {doctor.image && (
                  <div className="h-48 w-full relative">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                    {doctor.availability === 'Available' ? (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Available
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Unavailable
                      </span>
                    )}
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-bold text-lg">{doctor.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{doctor.specialty}</p>
                  
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(doctor.rating) ? 
                            'text-yellow-400 fill-yellow-400' : 
                            'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      {doctor.rating.toFixed(1)} ({doctor.reviewCount})
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{doctor.location}</span>
                  </div>
                  
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Next available: {doctor.nextAvailable}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Consultation Fees</p>
                      <p className="font-semibold">₹{doctor.consultationFee}</p>
                    </div>
                    
                    <Button size="sm">
                      Book now
                    </Button>
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
