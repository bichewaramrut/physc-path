"use client";

import { useEffect } from 'react';
import { usePayments } from '@/hooks/usePayments';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  Receipt, 
  CheckCircle, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ErrorAlert } from '@/components/ui/error-alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getStatusColor, formatCurrency } from '@/lib/utils/payment-utils';

export default function InvoiceDetailPage({ params }: { params: { invoiceId: string } }) {
  const { fetchInvoice, currentInvoice, downloadInvoice, loading, error } = usePayments();
  const router = useRouter();

  useEffect(() => {
    if (params.invoiceId) {
      fetchInvoice(params.invoiceId);
    }
  }, [fetchInvoice, params.invoiceId]);

  const handleDownload = () => {
    if (currentInvoice) {
      downloadInvoice(currentInvoice.id);
    }
  };

  // Using the utility function for status colors

  if (loading && !currentInvoice) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading invoice..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert 
        message={error} 
        onRetry={() => {
          if (params.invoiceId) {
            fetchInvoice(params.invoiceId);
          }
        }}
      />
    );
  }

  if (!currentInvoice) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Invoice not found.</p>
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
          <h1 className="text-2xl font-bold">Invoice {currentInvoice.number}</h1>
          <Badge className={`ml-4 ${getStatusColor(currentInvoice.status)}`}>
            <span className="capitalize">{currentInvoice.status}</span>
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Invoice Number</h3>
                    <p className="font-medium">{currentInvoice.number}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <Badge className={getStatusColor(currentInvoice.status)}>
                      <span className="capitalize">{currentInvoice.status}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Issue Date</h3>
                      <p>{format(parseISO(currentInvoice.issueDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                      <p>{format(parseISO(currentInvoice.dueDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Description</th>
                          <th className="text-right py-3 px-4">Quantity</th>
                          <th className="text-right py-3 px-4">Unit Price</th>
                          <th className="text-right py-3 px-4">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentInvoice.items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-3 px-4">{item.description}</td>
                            <td className="text-right py-3 px-4">{item.quantity}</td>
                            <td className="text-right py-3 px-4">
                              {formatCurrency(item.unitPrice, currentInvoice.currency)}
                            </td>
                            <td className="text-right py-3 px-4">
                              {formatCurrency(item.total, currentInvoice.currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between border-b py-2">
                      <span>Subtotal</span>
                      <span>{formatCurrency(currentInvoice.subtotal, currentInvoice.currency)}</span>
                    </div>
                    {currentInvoice.tax && (
                      <div className="flex justify-between border-b py-2">
                        <span>Tax</span>
                        <span>{formatCurrency(currentInvoice.tax, currentInvoice.currency)}</span>
                      </div>
                    )}
                    {currentInvoice.discount && (
                      <div className="flex justify-between border-b py-2">
                        <span>Discount</span>
                        <span>- {formatCurrency(currentInvoice.discount, currentInvoice.currency)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(currentInvoice.total, currentInvoice.currency)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                {currentInvoice.status === 'issued' && (
                  <Link href={`/dashboard/invoices/${currentInvoice.id}/pay`}>
                    <Button className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Pay Now
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Patient</h3>
                    <p className="font-medium">{currentInvoice.patientName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Patient ID</h3>
                    <p>{currentInvoice.patientId}</p>
                  </div>
                  {currentInvoice.paidDate && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Payment Date</h3>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <p>{format(parseISO(currentInvoice.paidDate), 'MMMM d, yyyy')}</p>
                      </div>
                    </div>
                  )}
                  {currentInvoice.appointmentId && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Related To</h3>
                      <Link 
                        href={`/dashboard/appointments/${currentInvoice.appointmentId}`}
                        className="text-primary hover:underline flex items-center"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        View Appointment
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
