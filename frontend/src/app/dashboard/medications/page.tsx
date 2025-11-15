"use client";

import { usePrescriptions } from '@/hooks/usePrescriptions';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrescriptionDate } from '@/lib/utils/prescription-utils';
import { Pill, FileText, Clock, ArrowRight } from 'lucide-react';

export default function PrescriptionsList() {
  const router = useRouter();
  const { 
    prescriptions,
    loading,
    error,
    fetchPrescriptions
  } = usePrescriptions();
  
  const [activeTab, setActiveTab] = useState('active');
  
  const activePrescriptions = prescriptions?.filter(p => p.status === 'ACTIVE') || [];
  const pastPrescriptions = prescriptions?.filter(p => p.status !== 'ACTIVE') || [];

  const handleViewPrescription = (id: string) => {
    router.push(`/dashboard/medications/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 animate-pulse bg-gray-200 w-1/3 h-8 rounded"></h1>
        
        <div className="bg-white shadow rounded-lg animate-pulse">
          <div className="h-12 bg-gray-100 rounded-t-lg mb-4"></div>
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Prescriptions</h1>
        <Button onClick={() => fetchPrescriptions()}>
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            Active Prescriptions ({activePrescriptions.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Prescriptions ({pastPrescriptions.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activePrescriptions.length > 0 ? (
            <div className="space-y-4">
              {activePrescriptions.map(prescription => (
                <Card 
                  key={prescription.id}
                  className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewPrescription(prescription.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <Pill className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-medium">
                          {prescription.medications?.[0]?.name}
                          {prescription.medications?.length > 1 ? ` + ${prescription.medications.length - 1} more` : ''}
                        </h3>
                      </div>
                      
                      <div className="mt-2 flex flex-col space-y-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Prescribed by Dr. {prescription.doctor?.name || 'Unknown'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Issued on {formatPrescriptionDate(prescription.issueDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-500">
                        {prescription.refills !== undefined ? `${prescription.refills} refills left` : 'No refills'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No active prescriptions found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {pastPrescriptions.length > 0 ? (
            <div className="space-y-4">
              {pastPrescriptions.map(prescription => (
                <Card 
                  key={prescription.id}
                  className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewPrescription(prescription.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <Pill className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="font-medium">
                          {prescription.medications?.[0]?.name}
                          {prescription.medications?.length > 1 ? ` + ${prescription.medications.length - 1} more` : ''}
                        </h3>
                      </div>
                      
                      <div className="mt-2 flex flex-col space-y-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Prescribed by Dr. {prescription.doctor?.name || 'Unknown'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Issued on {formatPrescriptionDate(prescription.issueDate)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prescription.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        prescription.status === 'EXPIRED' ? 'bg-amber-100 text-amber-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {prescription.status}
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No past prescriptions found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
