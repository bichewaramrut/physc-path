"use client";

import { useEffect, useState } from 'react';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  Clock, 
  User, 
  Pill,
  FileText,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { 
  getStatusColorClass, 
  formatPrescriptionDate,
  formatMedicationInstructions,
  canRequestRefill
} from '@/lib/utils/prescription-utils';
import { ErrorAlert } from '@/components/ui/error-alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { RefillRequestForm } from '@/components/organisms/patient/RefillRequestForm';

export default function PrescriptionDetailPage({ params }: { params: { prescriptionId: string } }) {
  const { fetchPrescription, currentPrescription, downloadPrescription, loading, error } = usePrescriptions();
  const router = useRouter();
  const [refillDialogOpen, setRefillDialogOpen] = useState(false);

  useEffect(() => {
    if (params.prescriptionId) {
      fetchPrescription(params.prescriptionId);
    }
  }, [fetchPrescription, params.prescriptionId]);

  const handleDownload = () => {
    if (currentPrescription) {
      downloadPrescription(currentPrescription.id);
    }
  };

  if (loading && !currentPrescription) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (!currentPrescription) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Prescription not found.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Prescription Details</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">Prescription Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleDownload}
                  data-testid="download-pdf"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Issue Date</p>
                        <p>{formatPrescriptionDate(currentPrescription.issueDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Expiry Date</p>
                        <p>{formatPrescriptionDate(currentPrescription.expiryDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(currentPrescription.status)}`}>
                          {currentPrescription.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-4">
                      <User className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Doctor</p>
                        <p>{currentPrescription.doctorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-4">
                      <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Diagnosis</p>
                        <p>{currentPrescription.diagnosis || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <RefreshCw className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Refills</p>
                        <p>{currentPrescription.refills || 0} remaining</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {canRequestRefill(currentPrescription) && (
                  <Dialog open={refillDialogOpen} onOpenChange={setRefillDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="default" className="w-full md:w-auto">
                        Request Refill
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <RefillRequestForm prescription={currentPrescription} onClose={() => setRefillDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                )}
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Medications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPrescription.medications.map((medication, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center mb-2">
                        <Pill className="mr-2 h-5 w-5 text-primary" />
                        <h3 className="font-medium">{medication.name} {medication.dosage}</h3>
                      </div>
                      <div className="pl-7 text-sm">
                        {/* <p><span className="font-medium">Form:</span> {medication.type || 'Not specified'}</p> */}
                        <p><span className="font-medium">Quantity:</span> {medication.quantity || 'Not specified'}</p>
                        <p><span className="font-medium">Instructions:</span> {formatMedicationInstructions(medication)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium mb-1">Special Instructions</h3>
                    <p className="text-sm">{'None provided'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Notes</h3>
                    <p className="text-sm">{currentPrescription.notes || 'None provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}