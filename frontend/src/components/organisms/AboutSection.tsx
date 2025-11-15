"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section className="bg-[#F26E5C] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left side - Image */}
          <div className="order-2 lg:order-1">
            <img 
              src="/images/consulting-expert.svg"
              alt="Professional consultation" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="order-1 lg:order-2 text-white">
            <div className="mb-6">
              <h2 className="text-xl font-medium">Mission</h2>
              <h3 className="text-3xl font-bold mt-2 mb-4">
                Introducing Experienced Consulting
              </h3>
            </div>
            
            {/* Expertise & Credentials */}
            <div className="mb-6 flex items-start space-x-4">
              <img 
                src="/images/vectors/checkmark.svg"
                alt="Checkmark" 
                className="w-6 h-6 mt-1 flex-shrink-0" 
              />
              <div>
                <h4 className="font-semibold text-lg">Highlight Expertise and Credentials</h4>
                <p className="text-sm opacity-90 mt-1">
                  Showcase your team's qualifications, certifications, years of experience, and specialized areas of practice. This establishes credibility and trust with potential clients seeking mental health support.
                </p>
              </div>
            </div>
            
            {/* Consulting Process */}
            <div className="flex items-start space-x-4">
              <img 
                src="/images/vectors/process.svg"
                alt="Process" 
                className="w-6 h-6 mt-1 flex-shrink-0" 
              />
              <div>
                <h4 className="font-semibold text-lg">Outline the Consulting Process</h4>
                <p className="text-sm opacity-90 mt-1">
                  Explain how your telemedicine consultations work, from the initial assessment through treatment planning and follow-up care. This clarity helps reduce anxiety for new patients who may be unfamiliar with virtual mental health services.
                </p>
              </div>
            </div>
            
            <div className="mt-10">
              <Button className="bg-white text-[#F26E5C] hover:bg-gray-100">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
