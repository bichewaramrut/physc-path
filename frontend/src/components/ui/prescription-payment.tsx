'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';
import { toast } from './use-toast';
import { 
  processPrescriptionPayment,
  RazorPaySuccessResponse,
  isRazorPaySupported,
  enhancedProcessPrescriptionPayment,
  handleRazorPayError
} from '@/lib/utils/razorpay-utils';
import { Payment, PaymentStatus } from '@/lib/utils/payment-utils';
import { Prescription } from '@/lib/api/prescriptions';
import { isPaymentGatewaySupported } from '@/lib/utils/browser-compatibility';
import { CreditCard, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from './loading-spinner';
import { ErrorAlert } from './error-alert';
import { PaymentCardSkeleton } from './skeleton';

interface PrescriptionPaymentProps {
  prescription: Prescription;
  patientDetails: {
    name: string;
    email: string;
    phone: string;
  };
  onPaymentComplete?: (payment: Payment) => void;
  onPaymentError?: (error: Error) => void;
}

export function PrescriptionPayment({
  prescription,
  patientDetails,
  onPaymentComplete,
  onPaymentError,
}: PrescriptionPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBrowserCompatible, setIsBrowserCompatible] = useState<boolean>(true);

  const amount = prescription.cost || 0;
  
  // Check browser compatibility on component mount
  useEffect(() => {
    const checkBrowserCompatibility = async () => {
      // Add a small delay to simulate loading for a smoother UI experience
      await new Promise(resolve => setTimeout(resolve, 800));
      const isCompatible = isPaymentGatewaySupported() && isRazorPaySupported();
      setIsBrowserCompatible(isCompatible);
      setIsInitializing(false);
    };
    
    checkBrowserCompatibility();
  }, []);

  const handlePayment = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Use enhanced payment processing with better error handling
      const payment = await enhancedProcessPrescriptionPayment(
        prescription.id,
        amount,
        patientDetails,
        {
          description: `Payment for prescription ${prescription.prescriptionNumber || prescription.id}`,
          theme: {
            color: '#4A3AFF'
          }
        }
      );

      setPaymentStatus(payment.status as PaymentStatus);
      
      if (payment.status === PaymentStatus.COMPLETED) {
        toast({
          title: 'Payment Successful',
          description: `Your payment of ₹${amount.toFixed(2)} was processed successfully.`,
          variant: 'default',
        });

        if (onPaymentComplete) {
          onPaymentComplete(payment);
        }
      } else {
        setErrorMessage('Payment was not completed successfully.');
        
        if (onPaymentError) {
          onPaymentError(new Error('Payment failed or was cancelled'));
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus(PaymentStatus.FAILED);
      
      // Use better error handling
      const errorMsg = handleRazorPayError(error);
      setErrorMessage(errorMsg);
      
      toast({
        title: 'Payment Failed',
        description: errorMsg,
        variant: 'destructive',
      });

      if (onPaymentError) {
        onPaymentError(error instanceof Error ? error : new Error(errorMsg));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading skeleton during initialization
  if (isInitializing) {
    return <PaymentCardSkeleton glassmorphism={true} />;
  }
  
  // Don't show payment if cost is 0 or undefined
  if (!amount || amount <= 0) {
    return (
      <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-center text-muted-foreground">No payment required for this prescription.</p>
      </Card>
    );
  }

  // Show payment result if payment was processed
  if (paymentStatus === PaymentStatus.COMPLETED) {
    return (
      <Card className="p-6 relative overflow-hidden bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800">
        <div className="flex flex-col items-center justify-center space-y-4 animate-fadeIn">
          <div className="relative">
            <CheckCircle className="h-12 w-12 text-success-500 animate-pulse-subtle" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500"></span>
            </span>
          </div>
          
          <h3 className="text-lg font-medium text-success-700 dark:text-success-300">Payment Successful</h3>
          
          <p className="text-center text-success-600 dark:text-success-300 max-w-sm">
            Your payment of ₹{amount.toFixed(2)} for this prescription has been processed successfully.
          </p>
          
          <div className="w-full max-w-xs h-1 bg-success-200 dark:bg-success-700 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-success-500 rounded-full animate-pulse-subtle" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="absolute -bottom-20 -right-20 h-40 w-40 bg-success-200 dark:bg-success-800/20 rounded-full blur-3xl opacity-60 z-0"></div>
      </Card>
    );
  }

  if (paymentStatus === PaymentStatus.FAILED) {
    return (
      <ErrorAlert
        variant="error"
        title="Payment Failed"
        message={errorMessage || 'There was a problem processing your payment.'}
        onRetry={() => {
          setPaymentStatus(null);
          setErrorMessage(null);
        }}
        actions={[
          {
            label: "Try Again",
            onClick: () => {
              setPaymentStatus(null);
              setErrorMessage(null);
            },
            variant: "button",
          },
          {
            label: "Contact Support",
            onClick: () => window.location.href = "/contact",
            variant: "link",
          }
        ]}
        showIcon={true}
        bordered={true}
        elevated={true}
        glassmorphism={true}
        animationVariant="shake"
        className="mx-auto max-w-md"
      />
    );
  }

  // Show browser compatibility warning if needed
  if (!isBrowserCompatible) {
    return (
      <ErrorAlert
        variant="warning"
        title="Browser Compatibility Issue"
        message="Your current browser may not fully support our payment system. For the best experience, please try a supported browser."
        actions={[
          {
            label: "Continue to Alternative Payment",
            onClick: handlePayment,
            variant: "button",
            color: "bg-warning-500 hover:bg-warning-600 text-white"
          }
        ]}
        helpLink="https://support.thepshyc.com/browser-compatibility"
        showIcon={true}
        bordered={true}
        elevated={true}
        glassmorphism={true}
        animationVariant="fade"
        className="mx-auto"
      >
        <div className="mt-4 bg-card/30 backdrop-blur-sm p-4 rounded-md">
          <p className="text-sm font-medium mb-2">For the best experience, please try:</p>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Using Chrome, Firefox, or Edge</li>
            <li>Updating your browser to the latest version</li>
            <li>Disabling privacy blockers for this site</li>
          </ul>
        </div>
      </ErrorAlert>
    );
  }

  // Show loading state when payment is processing
  if (isLoading) {
    return (
      <Card className="p-6 relative overflow-hidden">
        <LoadingSpinner 
          variant="pulse" 
          size="lg" 
          text="Processing your payment..." 
          color="primary" 
          glassmorphism={true}
          timeout={15000}
          onTimeout={() => setIsLoading(false)}
          className="py-8"
        />
        <div className="flex items-center justify-center mt-4">
          <span className="text-sm text-muted-foreground">This may take a few moments. Please don't close this window.</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Amazing Interactive Payment Design */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Interactive Medical Prescription Illustration */}
        <div className="order-2 lg:order-1">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-8 shadow-2xl backdrop-blur-sm border border-white/20">
            <svg width="100%" height="500" viewBox="0 0 500 500" className="w-full">
              <defs>
                <linearGradient id="prescriptionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6"/>
                  <stop offset="30%" stopColor="#6366F1"/>
                  <stop offset="70%" stopColor="#8B5CF6"/>
                  <stop offset="100%" stopColor="#EC4899"/>
                </linearGradient>
                <linearGradient id="medicineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981"/>
                  <stop offset="50%" stopColor="#06B6D4"/>
                  <stop offset="100%" stopColor="#3B82F6"/>
                </linearGradient>
                <linearGradient id="paymentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B"/>
                  <stop offset="50%" stopColor="#EF4444"/>
                  <stop offset="100%" stopColor="#EC4899"/>
                </linearGradient>
                <filter id="prescriptionGlow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Central Prescription Document */}
              <g transform="translate(250, 250)" filter="url(#prescriptionGlow)">
                {/* Prescription pad background */}
                <rect x="-80" y="-120" width="160" height="240" rx="12" fill="#F8FAFC" stroke="url(#prescriptionGradient)" strokeWidth="3" opacity="0.95">
                  <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite"/>
                </rect>
                
                {/* Header with medical cross */}
                <g transform="translate(0, -100)">
                  <circle cx="0" cy="0" r="15" fill="#EF4444" opacity="0.9"/>
                  <path d="M0 -8 L0 8 M-8 0 L8 0" stroke="white" strokeWidth="3"/>
                  <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#1E40AF" fontWeight="bold">PRESCRIPTION</text>
                </g>
                
                {/* Prescription lines with medications */}
                <g stroke="#6B7280" strokeWidth="1" opacity="0.6">
                  <line x1="-60" y1="-60" x2="60" y2="-60">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
                  </line>
                  <line x1="-60" y1="-40" x2="40" y2="-40">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" begin="0.5s"/>
                  </line>
                  <line x1="-60" y1="-20" x2="55" y2="-20">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" begin="1s"/>
                  </line>
                  <line x1="-60" y1="0" x2="35" y2="0">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" begin="1.5s"/>
                  </line>
                  <line x1="-60" y1="20" x2="50" y2="20">
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" begin="2s"/>
                  </line>
                </g>
                
                {/* Doctor signature area */}
                <g transform="translate(0, 80)">
                  <rect x="-50" y="-15" width="100" height="25" rx="5" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,3"/>
                  <text x="0" y="0" textAnchor="middle" fontSize="8" fill="#6B7280">Dr. Signature</text>
                </g>
                
                {/* Prescription ID badge */}
                <g transform="translate(60, -80)">
                  <rect x="-15" y="-8" width="30" height="16" rx="8" fill="url(#prescriptionGradient)" opacity="0.8"/>
                  <text x="0" y="0" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">
                    #{prescription.id.substring(0, 6)}
                  </text>
                </g>
              </g>
              
              {/* Floating Medicine Bottles */}
              <g transform="translate(120, 150)">
                {/* Medicine bottle 1 */}
                <g>
                  <rect x="-8" y="-20" width="16" height="35" rx="3" fill="url(#medicineGradient)" opacity="0.8"/>
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
                  <rect x="-6" y="-25" width="12" height="8" rx="2" fill="#1E293B" opacity="0.7"/>
                  <circle cx="0" cy="-5" r="2" fill="white" opacity="0.8"/>
                  <circle cx="0" cy="5" r="2" fill="white" opacity="0.8"/>
                  
                  {/* Floating effect */}
                  <animateTransform 
                    attributeName="transform" 
                    type="translate" 
                    values="120,150; 120,140; 120,150" 
                    dur="4s" 
                    repeatCount="indefinite"
                  />
                </g>
                <text x="0" y="35" textAnchor="middle" fontSize="8" fill="#059669" fontWeight="bold">Medicine 1</text>
              </g>
              
              <g transform="translate(380, 180)">
                {/* Medicine bottle 2 */}
                <g>
                  <rect x="-8" y="-20" width="16" height="35" rx="3" fill="url(#medicineGradient)" opacity="0.8">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="1s"/>
                  </rect>
                  <rect x="-6" y="-25" width="12" height="8" rx="2" fill="#1E293B" opacity="0.7"/>
                  <circle cx="0" cy="-8" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="0" cy="-2" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="0" cy="4" r="1.5" fill="white" opacity="0.8"/>
                  <circle cx="0" cy="10" r="1.5" fill="white" opacity="0.8"/>
                  
                  {/* Floating effect */}
                  <animateTransform 
                    attributeName="transform" 
                    type="translate" 
                    values="380,180; 380,170; 380,180" 
                    dur="4s" 
                    repeatCount="indefinite" 
                    begin="2s"
                  />
                </g>
                <text x="0" y="35" textAnchor="middle" fontSize="8" fill="#059669" fontWeight="bold">Medicine 2</text>
              </g>
              
              {/* Payment Security Shield */}
              <g transform="translate(100, 350)">
                <path d="M0 -20 L12 -15 L12 10 Q12 20 0 25 Q-12 20 -12 10 L-12 -15 Z" fill="url(#paymentGradient)" opacity="0.9">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                </path>
                <path d="M-6 -2 L-2 2 L8 -8" stroke="white" strokeWidth="2" fill="none"/>
                <text x="0" y="40" textAnchor="middle" fontSize="10" fill="#F59E0B" fontWeight="bold">Secure Payment</text>
              </g>
              
              {/* RazorPay Integration Visualization */}
              <g transform="translate(400, 350)">
                <rect x="-25" y="-15" width="50" height="30" rx="8" fill="#6366F1" opacity="0.9">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite"/>
                </rect>
                <text x="0" y="-5" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">RazorPay</text>
                <text x="0" y="5" textAnchor="middle" fontSize="6" fill="white">Powered</text>
                
                {/* Payment waves */}
                <g stroke="#60A5FA" strokeWidth="2" fill="none" opacity="0.6">
                  <circle cx="0" cy="0" r="35">
                    <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="25;45;25" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="0" cy="0" r="35">
                    <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" begin="1s"/>
                    <animate attributeName="r" values="25;45;25" dur="3s" repeatCount="indefinite" begin="1s"/>
                  </circle>
                </g>
              </g>
              
              {/* Connecting Flow Lines */}
              <g stroke="url(#prescriptionGradient)" strokeWidth="2" fill="none" opacity="0.5">
                {/* Prescription to medicines */}
                <path d="M180 200 Q150 180 140 160">
                  <animate attributeName="stroke-dasharray" values="0 100;50 100;0 100" dur="4s" repeatCount="indefinite"/>
                </path>
                <path d="M320 200 Q350 180 360 160">
                  <animate attributeName="stroke-dasharray" values="0 100;50 100;0 100" dur="4s" repeatCount="indefinite" begin="1s"/>
                </path>
                
                {/* Payment connections */}
                <path d="M200 320 Q150 340 120 360">
                  <animate attributeName="stroke-dasharray" values="0 100;50 100;0 100" dur="4s" repeatCount="indefinite" begin="2s"/>
                </path>
                <path d="M300 320 Q350 340 380 360">
                  <animate attributeName="stroke-dasharray" values="0 100;50 100;0 100" dur="4s" repeatCount="indefinite" begin="3s"/>
                </path>
              </g>
              
              {/* Floating Medical Particles */}
              <g fill="url(#prescriptionGradient)" opacity="0.4">
                <circle cx="80" cy="80" r="3">
                  <animate attributeName="cy" values="80;60;80" dur="4s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="420" cy="80" r="2">
                  <animate attributeName="cy" values="80;60;80" dur="4s" repeatCount="indefinite" begin="1s"/>
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" begin="1s"/>
                </circle>
                <circle cx="450" cy="420" r="3">
                  <animate attributeName="cy" values="420;400;420" dur="4s" repeatCount="indefinite" begin="2s"/>
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" begin="2s"/>
                </circle>
                <circle cx="50" cy="420" r="2">
                  <animate attributeName="cy" values="420;400;420" dur="4s" repeatCount="indefinite" begin="3s"/>
                  <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" begin="3s"/>
                </circle>
              </g>
            </svg>
          </div>
        </div>
        
        {/* Enhanced Payment Card */}
        <div className="order-1 lg:order-2">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30 shadow-2xl border-2 border-blue-200 dark:border-blue-800 backdrop-blur-sm">
            {/* Animated background elements */}
            <div className="absolute -top-20 -right-20 h-40 w-40 bg-blue-200 dark:bg-blue-800/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 h-40 w-40 bg-purple-200 dark:bg-purple-800/20 rounded-full blur-3xl opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <div className="relative z-10 p-8 space-y-6">
              {/* Header with animated icon */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <CreditCard className="h-8 w-8 text-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Complete Payment
                </h3>
                <p className="text-sm text-muted-foreground mt-2">Secure prescription payment processing</p>
              </div>
              
              {/* Prescription Details with Enhanced Styling */}
              <div className="space-y-4">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      Prescription ID:
                    </span>
                    <span className="font-bold text-foreground bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full text-sm">
                      #{prescription.id.substring(0, 8)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-t border-blue-100 dark:border-blue-800 mt-2 pt-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Prescription Date:
                    </span>
                    <span className="font-medium text-foreground">
                      {new Date(prescription.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-t border-blue-100 dark:border-blue-800 mt-2 pt-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                      Medications:
                    </span>
                    <span className="font-medium text-foreground bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full text-sm">
                      {prescription.medications?.length || 0} items
                    </span>
                  </div>
                </div>
                
                {/* Total Amount with Animation */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm opacity-90">Total Amount</span>
                      <div className="text-3xl font-bold flex items-center gap-2">
                        ₹{amount.toFixed(2)}
                        <span className="text-lg animate-bounce">💊</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl animate-pulse">💳</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Payment Button */}
              <Button 
                onClick={handlePayment} 
                className="w-full h-14 group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <CreditCard className="h-6 w-6 group-hover:animate-bounce" />
                  Pay ₹{amount.toFixed(2)} Securely
                  <span className="text-xl animate-pulse">✨</span>
                </span>
                
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300"></div>
                </div>
              </Button>
              
              {/* Enhanced Security Info */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-center gap-2 text-sm text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="font-medium">🔒 Bank-Level Security</span>
                  </div>
                </div>
                <p className="text-center text-xs text-green-600 dark:text-green-400 mt-2 flex items-center justify-center gap-2">
                  <span>🛡️ Powered by RazorPay</span>
                  <span>•</span>
                  <span>🔐 256-bit SSL Encryption</span>
                  <span>•</span>
                  <span>✅ PCI DSS Compliant</span>
                </p>
              </div>
              
              {/* Patient Details Badge */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 px-4 py-2 rounded-full text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Patient: {patientDetails.name}
                  <span className="text-xl">👤</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
