'use client';

import { useEffect, useState } from 'react';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import Link from 'next/link';
import { 
  Calendar, 
  FileText, 
  Plus, 
  Search,
  Pill
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function PrescriptionsPage() {
  const { prescriptions, fetchPrescriptions, loading, error } = usePrescriptions();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const medicationNames = prescription.medications?.map(med => med.name.toLowerCase()).join(' ') || '';
    return medicationNames.includes(searchTerm.toLowerCase()) ||
           prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1V8a1 1 0 112 0v6a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Prescriptions</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search prescriptions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
        </div>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No prescriptions found</h3>
          <p className="mt-2 text-gray-500">
            You don't have any prescriptions yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrescriptions.map((prescription) => (
            <Link 
              href={`/dashboard/prescriptions/${prescription.id}`} 
              key={prescription.id}
              className="block"
            >
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="p-5 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">                    <Pill className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium text-gray-900">
                      {prescription.medications && prescription.medications.length > 0 
                        ? prescription.medications[0].name 
                        : 'Prescription'}
                    </h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      {prescription.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="h-4 w-4 mr-2" />
                    <span>Dr. {prescription.doctorName}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Issued: {format(new Date(prescription.issueDate), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Medications: {prescription.medications?.length || 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
