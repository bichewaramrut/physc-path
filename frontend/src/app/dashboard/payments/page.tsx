"use client";

import { useState, useEffect } from 'react';
import { usePayments } from '@/hooks/usePayments';
import Link from 'next/link';
import { 
  Calendar,
  CreditCard, 
  Download, 
  FileText, 
  Filter, 
  Search, 
  DollarSign,
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Receipt 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ErrorAlert } from '@/components/ui/error-alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getStatusColor, formatCurrency } from '@/lib/utils/payment-utils';

export default function PaymentsPage() {
  const { payments, invoices, fetchPayments, fetchInvoices, downloadInvoice, loading, error } = usePayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('payments');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [invoiceFilter, setInvoiceFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, [fetchPayments, fetchInvoices]);

  const filteredPayments = payments.filter(payment => {
    // Apply status filter
    if (paymentFilter !== 'all' && payment.status !== paymentFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !payment.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const filteredInvoices = invoices.filter(invoice => {
    // Apply status filter
    if (invoiceFilter !== 'all' && invoice.status !== invoiceFilter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm && !invoice.number.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Use the utility function for status colors

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
      case 'issued':
        return <AlertCircle className="h-4 w-4" />;
      case 'failed':
      case 'overdue':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    downloadInvoice(invoiceId);
  };

  if (loading && !payments.length && !invoices.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading payment data..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert 
        message={error} 
        onRetry={() => {
          fetchPayments();
          fetchInvoices();
        }}
      />
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Payments & Invoices</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full md:w-auto">
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>Invoices</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="payments" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <select
                  className="border rounded-md p-2 bg-background"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
            
            {filteredPayments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No payments found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPayments.map((payment) => (
                  <Card key={payment.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-medium">
                          {payment.description || `Payment ${payment.id}`}
                        </CardTitle>
                        <Badge className={getStatusColor(payment.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(payment.status)}
                            <span className="capitalize">{payment.status}</span>
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-medium">{formatCurrency(payment.amount, payment.currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Method</span>
                          <span className="capitalize">{payment.method.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Date</span>
                          <span>{format(parseISO(payment.date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/dashboard/payments/${payment.id}`} className="w-full">
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="invoices" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <select
                  className="border rounded-md p-2 bg-background"
                  value={invoiceFilter}
                  onChange={(e) => setInvoiceFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No invoices found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInvoices.map((invoice) => (
                  <Card key={invoice.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-medium">
                          {invoice.number}
                        </CardTitle>
                        <Badge className={getStatusColor(invoice.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(invoice.status)}
                            <span className="capitalize">{invoice.status}</span>
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-medium">{formatCurrency(invoice.total, invoice.currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Issue Date</span>
                          <span>{format(parseISO(invoice.issueDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Due Date</span>
                          <span>{format(parseISO(invoice.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Link href={`/dashboard/invoices/${invoice.id}`} className="flex-1">
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="secondary" 
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      {invoice.status === 'issued' && (
                        <Link href={`/dashboard/invoices/${invoice.id}/pay`} className="flex-1">
                          <Button className="w-full flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Pay
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
