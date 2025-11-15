"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, MapPin, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Mock data for appointments
const mockAppointments = [
  {
    id: 'APT12345',
    doctor: 'Dr. Sarah Wilson',
    specialty: 'Psychiatrist',
    date: 'March 15, 2023',
    time: '10:00 AM',
    type: 'video',
    status: 'upcoming',
  },
  {
    id: 'APT12346',
    doctor: 'Dr. Michael Chen',
    specialty: 'Psychologist',
    date: 'March 22, 2023',
    time: '2:30 PM',
    type: 'in-person',
    status: 'upcoming',
  },
  {
    id: 'APT12347',
    doctor: 'Dr. Sarah Wilson',
    specialty: 'Psychiatrist',
    date: 'February 28, 2023',
    time: '11:00 AM',
    type: 'video',
    status: 'completed',
  },
  {
    id: 'APT12348',
    doctor: 'Dr. James Taylor',
    specialty: 'Psychologist',
    date: 'February 15, 2023',
    time: '3:00 PM',
    type: 'in-person',
    status: 'cancelled',
  },
];

type AppointmentStatus = 'all' | 'upcoming' | 'completed' | 'cancelled';
type AppointmentType = 'all' | 'video' | 'in-person';

export default function AppointmentsList() {
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus>('all');
  const [filterType, setFilterType] = useState<AppointmentType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAppointments = mockAppointments.filter(appointment => {
    // Filter by status
    if (filterStatus !== 'all' && appointment.status !== filterStatus) {
      return false;
    }
    
    // Filter by type
    if (filterType !== 'all' && appointment.type !== filterType) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
        <div className="mt-4 md:mt-0">
          <Button className="bg-[#F26E5C] hover:bg-[#e05a47] text-white" asChild>
            <Link href="/dashboard/appointments/new">
              Book New Appointment
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Status filter */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as AppointmentStatus)}
                  className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-[#F26E5C] focus:ring-[#F26E5C] sm:text-sm"
                >
                  <option value="all">All</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              {/* Type filter */}
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  id="type-filter"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as AppointmentType)}
                  className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-[#F26E5C] focus:ring-[#F26E5C] sm:text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="video">Video</option>
                  <option value="in-person">In Person</option>
                </select>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pl-10 py-2 shadow-sm focus:border-[#F26E5C] focus:ring-[#F26E5C] sm:text-sm"
                placeholder="Search by doctor name"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointments list */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        {filteredAppointments.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAppointments.map((appointment) => (
              <li key={appointment.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="ml-1 capitalize">{appointment.status}</span>
                      </span>
                      <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {appointment.type === 'video' ? (
                          <>
                            <Video className="mr-1 h-3 w-3" />
                            Video
                          </>
                        ) : (
                          <>
                            <MapPin className="mr-1 h-3 w-3" />
                            In-person
                          </>
                        )}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {appointment.doctor}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.specialty}</p>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      {appointment.date}
                      <span className="mx-2">•</span>
                      <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      {appointment.time}
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center">
                    {appointment.status === 'upcoming' && (
                      <div className="flex space-x-3">
                        {appointment.type === 'video' && (
                          <Button className="bg-[#F26E5C] hover:bg-[#e05a47] text-white" asChild>
                            <Link href={`/dashboard/video-call/${appointment.id}`}>
                              <Video className="mr-2 h-4 w-4" />
                              Join Call
                            </Link>
                          </Button>
                        )}
                        
                        <Button variant="outline">
                          Reschedule
                        </Button>
                        
                        <Button variant="outline" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-900 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                          Cancel
                        </Button>
                      </div>
                    )}
                    
                    {appointment.status === 'completed' && (
                      <div className="flex space-x-3">
                        <Button variant="outline">
                          View Summary
                        </Button>
                        
                        <Button className="bg-[#F26E5C] hover:bg-[#e05a47] text-white">
                          Book Follow-up
                        </Button>
                      </div>
                    )}
                    
                    {appointment.status === 'cancelled' && (
                      <Button className="bg-[#F26E5C] hover:bg-[#e05a47] text-white">
                        Rebook
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No appointments found</p>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your filters or search term</p>
            <Button className="mt-6 bg-[#F26E5C] hover:bg-[#e05a47] text-white" asChild>
              <Link href="/dashboard/appointments/new">
                Book New Appointment
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
