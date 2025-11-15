"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Compassionate care, 
            <br />
            proven <span className="text-[#F26E5C]">mental 
            <br />
            wellness.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Trusted space for mental wellness through compassionate support, 
            personalized care, and evidence-based treatment methods.
          </p>
          <div className="mt-8 flex items-center gap-x-6">
            <Button size="lg" className="bg-[#F26E5C] hover:bg-[#e05a47] text-white rounded-full px-8" asChild>
              <Link href="/signup">
                Get Started
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl">
            <div className="bg-[#FEF3F2] rounded-xl p-4 text-center">
              <div className="mx-auto h-10 w-10 flex items-center justify-center bg-[#F26E5C] rounded-full mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2"/>
                  <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Anxiety Management</h3>
              <p className="text-xs text-gray-500 mt-1">Expert support for daily challenges</p>
            </div>
            
            <div className="bg-[#EFF8FF] rounded-xl p-4 text-center">
              <div className="mx-auto h-10 w-10 flex items-center justify-center bg-[#2970FF] rounded-full mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Depression Therapy</h3>
              <p className="text-xs text-gray-500 mt-1">Specialized treatment plans</p>
            </div>
            
            <div className="bg-[#EFF8FF]/50 rounded-xl p-4 text-center">
              <div className="mx-auto h-10 w-10 flex items-center justify-center bg-[#101828] rounded-full mb-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="white" strokeWidth="2"/>
                  <path d="M12 2V4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 20V22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4.93 4.93L6.34 6.34" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M17.66 17.66L19.07 19.07" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M2 12H4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M20 12H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6.34 17.66L4.93 19.07" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19.07 4.93L17.66 6.34" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Addiction Recovery</h3>
              <p className="text-xs text-gray-500 mt-1">Compassionate addiction support</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
          <div className="relative mx-auto h-[400px] w-[350px] max-w-full">
            {/* Blue decorative circles */}
            <div className="absolute -right-10 top-10 h-40 w-40 rounded-full border-8 border-indigo-100 z-0"></div>
            <div className="absolute right-20 -top-10 h-20 w-20 rounded-full border-8 border-indigo-100 z-0"></div>
            
            {/* Image container */}
            <div className="absolute left-0 top-0 h-full w-full rounded-2xl z-10">
              <Image
                src="/images/hero-image.svg"
                alt="A woman meditating, representing mental wellness"
                fill
                className="rounded-2xl object-cover"
                priority
              />
            </div>
            
            {/* Decorative wavy lines */}
            <div className="absolute -right-24 top-1/2 transform -translate-y-1/2 z-20">
              <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10,100 C40,80 80,120 110,100 S40,80 10,100 S80,120 110,100" stroke="#F26E5C" strokeWidth="3" fill="none"/>
                <path d="M10,50 C40,30 80,70 110,50 S40,30 10,50 S80,70 110,50" stroke="#4F46E5" strokeWidth="3" fill="none"/>
                <path d="M10,150 C40,130 80,170 110,150 S40,130 10,150 S80,170 110,150" stroke="#4F46E5" strokeWidth="3" fill="none"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
