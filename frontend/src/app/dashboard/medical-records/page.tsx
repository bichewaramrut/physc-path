"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, FileText, Download, Lock, Calendar, Eye } from 'lucide-react';

// Mock data for medical records
const mockMedicalRecords = [
  {
    id: 'MR12345',
    title: 'Initial Psychiatric Assessment',
    doctor: 'Dr. Sarah Wilson',
    date: 'February 15, 2023',
    type: 'assessment',
    size: '1.2 MB',
  },
  {
    id: 'MR12346',
    title: 'Therapy Session Notes',
    doctor: 'Dr. Michael Chen',
    date: 'February 28, 2023',
    type: 'notes',
    size: '0.8 MB',
  },
  {
    id: 'MR12347',
    title: 'Medication Prescription',
    doctor: 'Dr. Sarah Wilson',
    date: 'March 1, 2023',
    type: 'prescription',
    size: '0.5 MB',
  }
];

type RecordType = 'all' | 'assessment' | 'notes' | 'prescription' | 'report';

export default function MedicalRecords() {
  const [filterType, setFilterType] = useState<RecordType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRecords = mockMedicalRecords.filter(record => {
    // Filter by type
    if (filterType !== 'all' && record.type !== filterType) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !record.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return (
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-blue-700 dark:text-blue-300" />
          </div>
        );
      case 'notes':
        return (
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-green-700 dark:text-green-300" />
          </div>
        );
      case 'prescription':
        return (
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-orange-700 dark:text-orange-300" />
          </div>
        );
      case 'report':
        return (
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-purple-700 dark:text-purple-300" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </div>
        );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Medical Records</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Access and download your medical documents securely</p>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Document Type
              </label>
              <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as RecordType)}
                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-[#F26E5C] focus:ring-[#F26E5C] sm:text-sm"
              >
                <option value="all">All Documents</option>
                <option value="assessment">Assessments</option>
                <option value="notes">Session Notes</option>
                <option value="prescription">Prescriptions</option>
                <option value="report">Reports</option>
              </select>
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
                placeholder="Search by document title"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Security notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-700 p-4 mb-6 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your medical records are encrypted and protected according to HIPAA regulations. Only you and your authorized healthcare providers can access these documents.
            </p>
          </div>
        </div>
      </div>
      
      {/* Medical records list */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        {filteredRecords.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRecords.map((record) => (
              <li key={record.id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center">
                  {/* Document icon */}
                  <div className="flex-shrink-0">
                    {getDocumentIcon(record.type)}
                  </div>
                  
                  {/* Document details */}
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {record.title}
                    </h3>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {record.date}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {record.doctor}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {record.size}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No records found</p>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
      
      {/* Information section */}
      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          About Your Medical Records
        </h2>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Your medical records contain important information about your health and treatment history. These documents are maintained securely in compliance with healthcare privacy laws.
          </p>
          <p>
            If you need additional records that are not displayed here, or if you notice any inaccuracies, please contact your healthcare provider directly or our support team.
          </p>
          <h3>Record Types Explained</h3>
          <ul>
            <li><strong>Assessments</strong> - Initial and ongoing psychiatric or psychological evaluations</li>
            <li><strong>Session Notes</strong> - Therapist notes from your consultation sessions</li>
            <li><strong>Prescriptions</strong> - Medication details and instructions prescribed by your doctor</li>
            <li><strong>Reports</strong> - Comprehensive health reports and test results</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
