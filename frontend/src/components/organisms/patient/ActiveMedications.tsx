'use client';

import { useEffect, useState } from 'react';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pill, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatPrescriptionDate } from '@/lib/utils/prescription-utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorAlert } from '@/components/ui/error-alert';
import { Prescription } from '@/lib/api/prescriptions';

/**
 * ActiveMedications component
 * 
 * Displays a summary of the patient's active medications
 * from current prescriptions on the dashboard
 */
export function ActiveMedications() {
  const { fetchPrescriptions, loading, error } = usePrescriptions();
  const [activePrescriptions, setActivePrescriptions] = useState<Prescription[]>([]);
  const [medicationsCount, setMedicationsCount] = useState(0);
  
  useEffect(() => {
    const getActivePrescriptions = async () => {
      const prescriptions = await fetchPrescriptions({ status: 'ACTIVE' });
      if (prescriptions) {
        setActivePrescriptions(prescriptions);
        
        // Count total medications
        const count = prescriptions.reduce((total: number, prescription: Prescription) => {
          return total + (prescription.medications ? prescription.medications.length : 0);
        }, 0);
        
        setMedicationsCount(count);
      }
    };
    
    getActivePrescriptions();
  }, [fetchPrescriptions]);
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorAlert message="Could not load medications" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-semibold">Active Medications</CardTitle>
        <Badge variant="outline" className="font-normal">
          {medicationsCount} {medicationsCount === 1 ? 'medication' : 'medications'}
        </Badge>
      </CardHeader>
      <CardContent>
        {activePrescriptions.length > 0 ? (
          <div className="space-y-4">
            {activePrescriptions.slice(0, 3).map((prescription) => (
              <div key={prescription.id} className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Pill className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">
                    {prescription.medications && prescription.medications[0]?.name}
                    {prescription.medications && prescription.medications.length > 1 && 
                      ` +${prescription.medications.length - 1} more`}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatPrescriptionDate(prescription.prescribedDate)}
                  </div>
                </div>
              </div>
            ))}
            
            {activePrescriptions.length > 3 && (
              <div className="text-xs text-muted-foreground mt-2">
                And {activePrescriptions.length - 3} more prescriptions...
              </div>
            )}
            
            <Link href="/dashboard/prescriptions">
              <Button variant="ghost" className="w-full mt-2 text-xs h-8" size="sm">
                View All Prescriptions
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-6 space-y-2">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <p className="text-sm text-muted-foreground">No active medications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
