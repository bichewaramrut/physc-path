"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ } from '@/lib/api/content';

interface FAQsSectionProps {
  faqs: FAQ[];
  title?: string;
  description?: string;
  categories?: string[];
}

export default function FAQsSection({
  faqs,
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about our services, appointments, and mental health care.",
  categories = []
}: FAQsSectionProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };
  
  const filteredFaqs = activeCategory
    ? faqs.filter(faq => faq.category === activeCategory)
    : faqs;
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        <div className="max-w-3xl mx-auto divide-y divide-gray-200 rounded-lg bg-white shadow">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="border-b last:border-b-0">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="flex w-full items-center justify-between px-6 py-5 text-left font-medium"
              >
                <span className="text-lg">{faq.question}</span>
                {openFaqId === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary" />
                )}
              </button>
              
              {openFaqId === faq.id && (
                <div className="px-6 pb-5">
                  <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
