"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, HeartPulse, Wine, Baby, Users, Building2 } from 'lucide-react';

const services = [
  {
    name: 'Anxiety & Stress Management',
    description: 'Develop effective coping mechanisms to handle everyday stress and anxiety.',
    icon: Brain,
    href: '/services#anxiety'
  },
  {
    name: 'Depression & Mood Disorders',
    description: 'Access evidence-based treatments for conditions like depression and bipolar disorder.',
    icon: HeartPulse,
    href: '/services#depression'
  },
  {
    name: 'Addiction & Substance Abuse',
    description: 'Receive expert counseling for overcoming substance dependency and addiction.',
    icon: Wine,
    href: '/services#addiction'
  },
  {
    name: 'Child & Adolescent Psychiatry',
    description: 'Specialized mental health care designed for children and teenagers.',
    icon: Baby,
    href: '/services#children'
  },
  {
    name: 'Geriatric Psychiatry',
    description: 'Compassionate mental health support for elderly individuals.',
    icon: Users,
    href: '/services#geriatric'
  },
  {
    name: 'Workplace & Corporate Wellness',
    description: 'Mental health programs and therapy sessions tailored for employees and organizations.',
    icon: Building2,
    href: '/services#corporate'
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-base font-medium text-gray-600">Why?</h2>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            Why Our Mental Health Consultants are<br />the Best Choice
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Professional & Reassuring Card */}
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col items-center mb-4">
              <img 
                src="/images/vectors/professional-care.svg" 
                alt="Professional & Reassuring" 
                className="h-20 w-20 object-contain" 
              />
              <h3 className="mt-4 text-lg font-semibold text-center">Professional & Reassuring</h3>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Our consultants combine clinical expertise with a warm, supportive approach. They're not just qualified professionals, they're empathetic listeners who genuinely care about your well-being. They create safe spaces where you can share openly and receive expert guidance without feeling judged.
            </p>
          </div>
          
          {/* Friendly & Supportive Card - With Orange Background */}
          <div className="bg-[#F26E5C] rounded-xl p-6 text-white">
            <div className="flex flex-col items-center mb-4">
              <img 
                src="/images/vectors/friendly-support.svg" 
                alt="Friendly & Supportive" 
                className="h-20 w-20 object-contain" 
              />
              <h3 className="mt-4 text-lg font-semibold text-center">Friendly & Supportive</h3>
            </div>
            <p className="text-sm text-white text-center">
              We believe in the power of authentic connections. Our consultants prioritize building rapport and trust with every client. They're friendly faces you'll look forward to seeing, offering encouragement during tough times and celebrating your victories. Your journey to better mental health becomes less intimidating with their support.
            </p>
          </div>
          
          {/* Confident & Clear Card */}
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex flex-col items-center mb-4">
              <img 
                src="/images/vectors/confident-care.svg" 
                alt="Confident & Clear" 
                className="h-20 w-20 object-contain" 
              />
              <h3 className="mt-4 text-lg font-semibold text-center">Confident & Clear</h3>
            </div>
            <p className="text-sm text-gray-600 text-center">
              When you need mental health support, clarity matters. Our consultants explain concepts in simple, accessible language and provide clear action steps for your journey. They're confident in their expertise, delivering evidence-based strategies tailored to your specific situation. With their guidance, you'll always know where you stand and what comes next.
            </p>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10">How it works?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#101828] h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold mb-4">1</div>
              <h3 className="font-semibold mb-2">Sign up</h3>
              <p className="text-sm text-gray-600 text-center">No subscription is required, sign up for free</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#2970FF] h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold mb-4">2</div>
              <h3 className="font-semibold mb-2">Choose your calendar</h3>
              <p className="text-sm text-gray-600 text-center">Select convenient time slots for your sessions</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="bg-[#F26E5C] h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold mb-4">3</div>
              <h3 className="font-semibold mb-2">Virtual Consultation</h3>
              <p className="text-sm text-gray-600 text-center">Connect securely with your dedicated mental health professional through a simple video interface</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
