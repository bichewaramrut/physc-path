'use client';

import { useEffect, useState } from 'react';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User,
  FileText, 
  ArrowLeft, 
  Pill,
  RefreshCw,
  Printer,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { prescriptionsApi } from '@/lib/api/prescriptions';

interface PrescriptionDetailParams {
  params: {
    id: string;
  };
}

export default function PrescriptionDetail({ params }: PrescriptionDetailParams) {
  const { id } = params;
  const { fetchPrescription, currentPrescription, loading, error } = usePrescriptions();
  const [isRefilling, setIsRefilling] = useState(false);
  
  useEffect(() => {
    fetchPrescription(id);
  }, [fetchPrescription, id]);

  const handleRefillRequest = async () => {
    setIsRefilling(true);
    try {
      await prescriptionsApi.requestRefill(id);
      // Show success message or update UI
      alert('Refill request sent successfully!');
    } catch (e) {
      console.error('Error requesting refill:', e);
    } finally {
      setIsRefilling(false);
    }
  };

  const handlePrintPrescription = () => {
    window.print();
  };

  // Add requestRefill function to the API service
  const requestRefill = async (id: string) => {
    try {
      // This is a placeholder - you'll need to implement this endpoint in the backend
      const response = await apiClient.post(`${PRESCRIPTION_ENDPOINTS.DETAILS(id)}/refill`);
      return response.data;
    } catch (error) {
      console.error('Error requesting refill:', error);
      throw error;
    }
  };

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

  if (!currentPrescription) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Prescription not found</p>
        <Link href="/dashboard/prescriptions" className="mt-4 inline-block">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to prescriptions
          </Button>
        </Link>
      </div>
    );
  }

  // Get the first medication in the list
  const primaryMedication = currentPrescription.medications && currentPrescription.medications.length > 0
    ? currentPrescription.medications[0]
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard/prescriptions">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to prescriptions
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50 print:bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Pill className="h-6 w-6 text-primary mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900">
                {primaryMedication ? primaryMedication.name : 'Prescription'}
              </h1>
            </div>
            <div>
              {currentPrescription.status === 'ACTIVE' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {currentPrescription.status}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-medium mb-4 text-gray-900">Prescription Details</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Prescribed By</p>
                    <p className="text-gray-600">Dr. {currentPrescription.doctorName}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Issue Date</p>
                    <p className="text-gray-600">{format(new Date(currentPrescription.issueDate), 'MMMM d, yyyy')}</p>
                  </div>
                </div>

                {currentPrescription.expiryDate && (
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Expiry Date</p>
                      <p className="text-gray-600">{format(new Date(currentPrescription.expiryDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consultation</p>
                    {currentPrescription.consultationId ? (
                      <Link 
                        href={`/dashboard/consultations/${currentPrescription.consultationId}`}
                        className="text-primary hover:underline"
                      >
                        View related consultation
                      </Link>
                    ) : (
                      <p className="text-gray-600">No linked consultation</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium mb-4 text-gray-900">Medications</h2>
              {currentPrescription.medications && currentPrescription.medications.length > 0 ? (
                <div className="space-y-4">
                  {currentPrescription.medications.map((medication, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-lg">{medication.name}</h3>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dosage:</span>
                          <span className="font-medium">{medication.dosage}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">{medication.frequency}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{medication.duration}</span>
                        </div>
                      </div>
                      
                      {medication.instructions && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900">Instructions:</h4>
                          <p className="mt-1 text-gray-600">{medication.instructions}</p>
                        </div>
                      )}

                      {medication.sideEffects && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900">Possible Side Effects:</h4>
                          <p className="mt-1 text-gray-600">{medication.sideEffects}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">No medication details available</p>
                </div>
              )}

              {currentPrescription.status === 'ACTIVE' && (
                <div className="mt-6">
                  <Button 
                    onClick={handleRefillRequest}
                    disabled={isRefilling}
                    className="flex items-center"
                  >
                    {isRefilling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Request Refill
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {currentPrescription.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-gray-900">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{currentPrescription.notes}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4 print:hidden">
            <Button
              variant="outline"
              onClick={handlePrintPrescription}
              className="flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Prescription
            </Button>

            <Button
              variant="outline"
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
