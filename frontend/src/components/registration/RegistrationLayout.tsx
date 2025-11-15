import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RegistrationLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
  showProgress?: boolean;
}

export const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
  children,
  title,
  subtitle,
  step,
  totalSteps,
  showProgress = true,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="py-6 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="The Physc Logo"
              width={150}
              height={50}
              priority
            />
          </Link>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg mx-auto">
          {showProgress && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#F26E5C]">Step {step} of {totalSteps}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{Math.round((step / totalSteps) * 100)}% completed</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-[#F26E5C] h-2.5 rounded-full" 
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
              {subtitle && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} The Physc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RegistrationLayout;
