"use client";

import { useEffect } from 'react';
import { usePayments } from '@/hooks/usePayments';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  Receipt, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function PaymentDetailPage({ params }: { params: { paymentId: string } }) {
  const { fetchPayment, currentPayment, loading, error } = usePayments();
  const router = useRouter();

  useEffect(() => {
    if (params.paymentId) {
      fetchPayment(params.paymentId);
    }
  }, [fetchPayment, params.paymentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'refunded':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'failed':
      case 'refunded':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading && !currentPayment) {
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

  if (!currentPayment) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Payment not found.</p>
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
          <h1 className="text-2xl font-bold">Payment Details</h1>
          <Badge className={`ml-4 ${getStatusColor(currentPayment.status)}`}>
            <span className="flex items-center gap-1">
              {getStatusIcon(currentPayment.status)}
              <span className="capitalize">{currentPayment.status}</span>
            </span>
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Payment ID</h3>
                    <p className="font-medium">{currentPayment.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <Badge className={getStatusColor(currentPayment.status)}>
                      <span className="capitalize">{currentPayment.status}</span>
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                    <p className="text-xl font-bold">{currentPayment.currency} {currentPayment.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                      <p>{format(parseISO(currentPayment.date), 'MMMM d, yyyy - h:mm a')}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <span className="capitalize">{currentPayment.method.replace('_', ' ')}</span>
                  </div>
                </div>
                
                {currentPayment.description && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p>{currentPayment.description}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {currentPayment.invoiceId && (
                  <Link href={`/dashboard/invoices/${currentPayment.invoiceId}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      View Invoice
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Related Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPayment.invoiceId && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Invoice</h3>
                      <Link 
                        href={`/dashboard/invoices/${currentPayment.invoiceId}`}
                        className="text-primary hover:underline flex items-center"
                      >
                        <Receipt className="h-4 w-4 mr-1" />
                        View Invoice
                      </Link>
                    </div>
                  )}
                  {currentPayment.appointmentId && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Appointment</h3>
                      <Link 
                        href={`/dashboard/appointments/${currentPayment.appointmentId}`}
                        className="text-primary hover:underline flex items-center"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        View Appointment
                      </Link>
                    </div>
                  )}
                  {currentPayment.status === 'completed' && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Receipt</h3>
                      <Button variant="outline" className="mt-1 text-primary flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Download Receipt
                      </Button>
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
