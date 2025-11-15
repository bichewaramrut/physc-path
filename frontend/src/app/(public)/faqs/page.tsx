"use client";

import { useEffect } from 'react';
import PublicPageTemplate from '@/components/templates/PublicPageTemplate';
import FAQsSection from '@/components/organisms/FAQsSection';
import { useFAQs } from '@/hooks/useContent';
import { FAQ } from '@/lib/api/content';

// Mock data for initial development
const mockFaqs: FAQ[] = [
  {
    id: "1",
    question: "What is telemedicine and how does it work?",
    answer: "Telemedicine is the practice of providing medical care remotely using telecommunications technology. At The Physc, our platform allows you to consult with licensed psychiatrists and psychologists through secure video calls. You'll receive the same quality of care as in-person visits but from the comfort of your home.",
    category: "General"
  },
  {
    id: "2",
    question: "Is telemedicine as effective as in-person therapy?",
    answer: "Research shows that telepsychiatry and teletherapy can be just as effective as in-person care for many mental health conditions. Our platform is designed to provide a seamless experience that closely mirrors traditional appointments while offering additional convenience and accessibility.",
    category: "General"
  },
  {
    id: "3",
    question: "How do I schedule an appointment?",
    answer: "To schedule an appointment, simply create an account, complete your profile, browse available providers, and select a convenient time slot. Our booking system shows real-time availability, and you'll receive immediate confirmation of your appointment.",
    category: "Appointments"
  },
  {
    id: "4",
    question: "What happens if I need to cancel or reschedule?",
    answer: "You can cancel or reschedule appointments through your dashboard up to 24 hours before the scheduled time without incurring fees. Late cancellations or missed appointments may be subject to our cancellation policy.",
    category: "Appointments"
  },
  {
    id: "5",
    question: "How are my medical records kept secure?",
    answer: "We take your privacy seriously. Our platform is HIPAA-compliant with industry-standard encryption for all data transmission and storage. Your medical records are protected by strict access controls, and we never share your information without your explicit consent.",
    category: "Privacy & Security"
  },
  {
    id: "6",
    question: "Can I get prescriptions through The Physc?",
    answer: "Yes, our licensed psychiatrists can prescribe medications when clinically appropriate. Prescriptions are sent electronically to your preferred pharmacy. Note that certain controlled substances may have restrictions based on state regulations.",
    category: "Treatment"
  },
  {
    id: "7",
    question: "What insurance plans do you accept?",
    answer: "We accept most major insurance plans, including Medicare and many commercial providers. You can verify coverage during registration or contact our support team for assistance with verifying your benefits.",
    category: "Payment & Insurance"
  },
  {
    id: "8",
    question: "What if I have technical difficulties during my appointment?",
    answer: "Our system will automatically check your connection before appointments. If you experience issues during a session, our platform includes a backup phone option, and our technical support team is available during business hours to assist with any problems.",
    category: "Technical Support"
  }
];

export default function FAQsPage() {
  const { faqs, loading, error, fetchFAQs } = useFAQs();
  
  useEffect(() => {
    fetchFAQs();
    // In production, we would use the API data
    // For now, we're using mock data
  }, [fetchFAQs]);
  
  const categories = Array.from(new Set(mockFaqs.map(faq => faq.category).filter(Boolean))) as string[];
  
  return (
    <PublicPageTemplate>
      <div className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our services, appointments, and how we can support your mental health journey.
            </p>
          </div>
        </div>
      </div>
      
      <FAQsSection 
        faqs={mockFaqs} 
        categories={categories}
        title="How can we help you?"
        description="Browse through our comprehensive FAQ section to find answers to your questions about our telemedicine platform, appointment process, and mental health services."
      />
      
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to help. If you couldn't find the answer you're looking for, please reach out to us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-200"
            >
              Contact Us
            </a>
            <a 
              href="tel:+1234567890" 
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition duration-200"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </PublicPageTemplate>
  );
}
