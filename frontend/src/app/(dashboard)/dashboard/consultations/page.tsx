'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useConsultations } from '@/hooks/useConsultations';
import { Consultation } from '@/lib/api/consultations';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  User,
  FileText,
  Video,
  Filter,
  Search
} from 'lucide-react';

export default function ConsultationsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { consultations, loading, error, fetchConsultations } = useConsultations();
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  
  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);
  
  useEffect(() => {
    if (consultations) {
      let filtered = [...consultations];
      
      // Filter by status
      if (selectedStatus !== 'all') {
        filtered = filtered.filter(consultation => consultation.status === selectedStatus);
      }
      
      // Filter by search term (doctor name or patient name)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(consultation => 
          consultation.doctorName.toLowerCase().includes(term) ||
          consultation.patientName.toLowerCase().includes(term)
        );
      }
      
      // Sort by date (most recent first)
      filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      
      setFilteredConsultations(filtered);
    }
  }, [consultations, selectedStatus, searchTerm]);
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading && !consultations.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Consultations</h1>
          <p className="text-gray-600 mt-1">View and manage your medical consultations</p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by doctor or patient name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative inline-block w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        {error ? (
          <div className="p-6 text-center">
            <p className="text-red-600">
              {error}. Please try again later.
            </p>
            <Button 
              onClick={() => fetchConsultations()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No consultations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor/Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConsultations.map(consultation => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {consultation.doctorName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {consultation.patientName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(consultation.startTime)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          {formatTime(consultation.startTime)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(consultation.status)}`}>
                        {consultation.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {consultation.duration ? `${consultation.duration} minutes` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/dashboard/consultations/${consultation.id}`} className="text-primary hover:text-primary-dark">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        {consultation.status === 'IN_PROGRESS' && consultation.videoSessionId && (
                          <Link href={`/video-call/${consultation.videoSessionId}`} className="text-green-600 hover:text-green-800">
                            <Button size="sm" variant="default">
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
