"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  nextAvailable: string;
  consultationFee: number;
  availability: 'Available' | 'Unavailable';
  location: string;
}

interface Clinic {
  id: string;
  name: string;
  location: string;
  address: string;
  doctorCount: number;
  image?: string;
}

export default function ClinicDetails({ params }: { params: { clinicId: string } }) {
  const router = useRouter();
  const { clinicId } = params;
  
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    // Mock data for clinic
    const mockClinic: Clinic = {
      id: clinicId,
      name: 'Berkshire Medical Clinic',
      location: 'Bengaluru',
      address: 'Koramangala, Bengaluru',
      doctorCount: 120,
      image: '/images/clinics/clinic-2.jpg'
    };
    
    // Mock data for doctors
    const mockDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. Leslie',
        specialty: 'Clinical Psychologist',
        image: '/images/doctors/doctor-1.jpg',
        rating: 4.8,
        reviewCount: 124,
        nextAvailable: '23 Mar 2025',
        consultationFee: 1150,
        availability: 'Available',
        location: 'Bengaluru, Karnataka'
      },
      {
        id: '2',
        name: 'Dr. Cameron Williamson',
        specialty: 'Clinical Psychologist',
        image: '/images/doctors/doctor-2.jpg',
        rating: 4.6,
        reviewCount: 98,
        nextAvailable: '23 Mar 2025',
        consultationFee: 1700,
        availability: 'Unavailable',
        location: 'Bengaluru, Karnataka'
      },
      {
        id: '3',
        name: 'Dr. Jane Cooper',
        specialty: 'Clinical Psychologist',
        image: '/images/doctors/doctor-3.jpg',
        rating: 4.9,
        reviewCount: 156,
        nextAvailable: '23 Mar 2025',
        consultationFee: 1650,
        availability: 'Available',
        location: 'Bengaluru, Karnataka'
      },
      {
        id: '4',
        name: 'Dr. Robert Fox',
        specialty: 'Clinical Psychologist',
        image: '/images/doctors/doctor-4.jpg',
        rating: 4.7,
        reviewCount: 135,
        nextAvailable: '23 Mar 2025',
        consultationFee: 1450,
        availability: 'Available',
        location: 'Bengaluru, Karnataka'
      }
    ];
    
    setClinic(mockClinic);
    setDoctors(mockDoctors);
    setLoading(false);
  }, [clinicId]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm ? 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) : 
      true;
    
    const matchesSpecialty = selectedSpecialty !== 'All' ? 
      doctor.specialty === selectedSpecialty : 
      true;
      
    return matchesSearch && matchesSpecialty;
  });
  
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'price_low') {
      return a.consultationFee - b.consultationFee;
    } else if (sortBy === 'price_high') {
      return b.consultationFee - a.consultationFee;
    }
    return 0;
  });
  
  const handleDoctorSelect = (doctorId: string) => {
    router.push(`/dashboard/book-appointment/${doctorId}`);
  };
  
  const specialties = [
    'All',
    'Clinical Psychologist',
    'Psychiatrist',
    'Therapist',
    'Mental Health Counselor',
    'Child Psychologist'
  ];

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 p-4 rounded-lg text-red-800 dark:text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mr-4"
        >
          &larr; Back
        </Button>
        <h1 className="text-2xl font-bold">
          {clinic?.name}
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center border rounded-lg p-2 bg-gray-50 dark:bg-gray-700 md:col-span-2">
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
          </div>
          
          <div className="relative">
            <select
              className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 appearance-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Sort by: Rating</option>
              <option value="price_low">Sort by: Price (Low to High)</option>
              <option value="price_high">Sort by: Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <p className="text-gray-600 dark:text-gray-300">
          {`Showing ${sortedDoctors.length} Doctors From ${clinic?.name}`}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedDoctors.map((doctor) => (
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
    </div>
  );
}
