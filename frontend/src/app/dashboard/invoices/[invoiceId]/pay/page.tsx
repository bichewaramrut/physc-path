"use client";

import { useEffect, useState } from 'react';
import { usePayments } from '@/hooks/usePayments';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CreditCard, 
  CheckCircle, 
  Building, 
  Calendar,
  Receipt 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function InvoicePaymentPage({ params }: { params: { invoiceId: string } }) {
  const { fetchInvoice, currentInvoice, makePayment, loading, error } = usePayments();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'paypal'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (params.invoiceId) {
      fetchInvoice(params.invoiceId);
    }
  }, [fetchInvoice, params.invoiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentInvoice) return;
    
    setProcessingPayment(true);
    
    try {
      const result = await makePayment({
        amount: currentInvoice.total,
        currency: currentInvoice.currency,
        method: paymentMethod,
        invoiceId: currentInvoice.id,
        paymentDetails: paymentMethod === 'card' ? cardDetails : {}
      });
      
      if (result) {
        setPaymentSuccess(true);
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/payments');
        }, 2000);
      }
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading && !currentInvoice) {
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

  if (paymentSuccess) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-xl">Payment Successful</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Your payment of {currentInvoice.currency} {currentInvoice.total.toFixed(2)} for invoice {currentInvoice.number} has been processed successfully.
            </p>
            <p className="text-muted-foreground mt-2">
              You will be redirected to the payments page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Pay Invoice</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invoice Number</span>
                <span className="font-medium">{currentInvoice.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Date</span>
                <span>{format(parseISO(currentInvoice.issueDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date</span>
                <span>{format(parseISO(currentInvoice.dueDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Amount</span>
                <span>{currentInvoice.currency} {currentInvoice.total.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <Link href={`/dashboard/invoices/${currentInvoice.id}`} className="text-primary hover:underline flex items-center">
                  <Receipt className="h-4 w-4 mr-1" />
                  View Invoice Details
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as any)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer">
                      <Building className="h-4 w-4 mr-2" />
                      Bank Transfer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.028-2.645 4.578-6.409 4.578h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788l.04-.23.732-4.633.047-.254a.928.928 0 0 1 .92-.788h.581c3.75 0 6.683-1.524 7.543-5.929.36-1.847.174-3.388-.853-4.463-.309-.323-.682-.607-1.116-.85l-.014-.007z"/>
                      </svg>
                      PayPal
                    </Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input 
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input 
                        id="nameOnCard"
                        placeholder="John Smith"
                        value={cardDetails.nameOnCard}
                        onChange={(e) => setCardDetails({...cardDetails, nameOnCard: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'bank_transfer' && (
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="text-sm mb-3">Please use the following details to make a bank transfer:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Name:</span>
                        <span className="font-medium">The Pshyc Medical Center</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Number:</span>
                        <span className="font-medium">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Routing Number:</span>
                        <span className="font-medium">123456789</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference:</span>
                        <span className="font-medium">{currentInvoice.number}</span>
                      </div>
                    </div>
                    <p className="text-sm mt-3 text-muted-foreground">
                      Please include the invoice number as reference when making the payment.
                    </p>
                  </div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <div className="text-center p-4">
                    <p className="mb-3">You'll be redirected to PayPal to complete the payment.</p>
                    <svg className="h-10 w-10 mx-auto text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.028-2.645 4.578-6.409 4.578h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788l.04-.23.732-4.633.047-.254a.928.928 0 0 1 .92-.788h.581c3.75 0 6.683-1.524 7.543-5.929.36-1.847.174-3.388-.853-4.463-.309-.323-.682-.607-1.116-.85l-.014-.007z"/>
                    </svg>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Processing...
                    </>
                  ) : (
                    <>Pay {currentInvoice.currency} {currentInvoice.total.toFixed(2)}</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
