"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Frequently Ask Question</h2>
            <p className="text-gray-500 text-sm mt-2">Still you have any questions? Contact our team via support@thephysc.com</p>
          </div>
          
          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto mt-8">
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              {/* FAQ Question */}
              <div className="bg-[#F26E5C]/10 p-4 flex justify-between items-center cursor-pointer">
                <h3 className="font-medium text-gray-900">What type of consultation services do you offer?</h3>
                <button className="text-gray-600 hover:bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
              {/* FAQ Answer */}
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-700">
                  We offer a full range of psychiatric consultations, including depression and anxiety treatment, 
                  ADHD management, trauma therapy, addiction counseling, and general mental health support. 
                  Our licensed psychiatrists and therapists are experienced in treating various mental health conditions.
                </p>
              </div>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="p-4 flex justify-between items-center cursor-pointer">
                <h3 className="font-medium text-gray-900">How does the first consultation work?</h3>
                <button className="text-gray-600 hover:bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="p-4 flex justify-between items-center cursor-pointer">
                <h3 className="font-medium text-gray-900">How do you handle emergency mental health situations?</h3>
                <button className="text-gray-600 hover:bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="p-4 flex justify-between items-center cursor-pointer">
                <h3 className="font-medium text-gray-900">What are your consulting sessions?</h3>
                <button className="text-gray-600 hover:bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* FAQ Item 5 */}
            <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="p-4 flex justify-between items-center cursor-pointer">
                <h3 className="font-medium text-gray-900">Can prescription refills ordered online?</h3>
                <button className="text-gray-600 hover:bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-[#F26E5C] rounded-xl p-12 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-white">
              Schedule A Free Consultation To Understand Your Needs
            </h2>
          </div>
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <Button className="bg-white text-[#F26E5C] hover:bg-gray-100">
              Get started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
