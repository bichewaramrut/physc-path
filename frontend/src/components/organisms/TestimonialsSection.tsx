"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "Working with The Physc has been a transformative experience. The therapists are not only highly skilled but also deeply compassionate. The online platform is so convenient, and I appreciate the flexibility of scheduling sessions.",
    name: "Alex W.",
    title: "Patient - Anxiety Management",
    rating: 5,
  },
  {
    id: 2,
    quote: "After struggling with depression for years, I finally found the right support through The Physc. My therapist developed a personalized approach that has truly changed my life. The video consultations are seamless.",
    name: "Jamie P.",
    title: "Patient - Depression Treatment",
    rating: 5,
  },
  {
    id: 3,
    quote: "The Physc's platform has made mental health care accessible for me when I needed it most. The psychiatrist I work with is attentive, understanding, and incredibly helpful with medication management.",
    name: "Sam B.",
    title: "Patient - Bipolar Disorder Management",
    rating: 4,
  },
  {
    id: 4,
    quote: "As a busy professional, finding time for therapy was always challenging. The Physc's flexible scheduling and video sessions have made it possible for me to prioritize my mental health without disrupting my work.",
    name: "Taylor D.",
    title: "Patient - Work-Related Stress",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  // No need for carousel controls since we're showing all testimonials in grid
  
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Our Happy Clients</h2>
          <p className="text-gray-500 text-sm mt-2">Through these authentic testimonials, we hope to provide the most accurate picture of our patients.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {/* Testimonial 1 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <img 
                src="/images/testimonials/profile-1.svg" 
                alt="Thomas Gilani" 
                className="w-12 h-12 rounded-full mr-4" 
              />
              <div>
                <h3 className="font-semibold text-gray-900">Thomas Gilani</h3>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">4.9</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              "The Physc transformed my approach to anxiety. Their therapists are incredibly knowledgeable and supportive, helping me develop practical strategies that work for my lifestyle. The online format is so convenient!"
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Client since 2024</p>
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <img 
                src="/images/testimonials/profile-2.svg" 
                alt="Anna Kim" 
                className="w-12 h-12 rounded-full mr-4" 
              />
              <div>
                <h3 className="font-semibold text-gray-900">Anna Kim</h3>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">5.0</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              "I was skeptical about online therapy at first, but my experience with The Physc has been incredible. My psychiatrist listens deeply and works with me to find the right treatment. The video quality is excellent too."
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Client since 2023</p>
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <img 
                src="/images/testimonials/profile-3.svg" 
                alt="Thomas Erikson" 
                className="w-12 h-12 rounded-full mr-4" 
              />
              <div>
                <h3 className="font-semibold text-gray-900">Thomas Erikson</h3>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">4.8</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              "Managing my depression became much easier with The Physc's help. Their therapists are compassionate and truly committed to helping. I appreciate how they tailor approaches to my specific needs and circumstances."
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Client since 2024</p>
            </div>
          </div>
          
          {/* Testimonial 4 */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <img 
                src="/images/testimonials/profile-4.svg" 
                alt="Thomas Güzel" 
                className="w-12 h-12 rounded-full mr-4" 
              />
              <div>
                <h3 className="font-semibold text-gray-900">Thomas Güzel</h3>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">5.0</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              "As a busy parent, finding time for therapy was impossible until I found The Physc. Their flexible scheduling and virtual sessions make it so convenient. My therapist is amazing and really understands my challenges."
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Client since 2023</p>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          <div className="bg-[#F26E5C]/20 rounded-lg p-6 text-center">
            <h3 className="text-[#F26E5C] font-bold text-2xl">8 <span className="text-xl">+</span></h3>
            <p className="text-sm text-gray-700 mt-1">Experienced</p>
          </div>
          
          <div className="bg-[#2970FF]/20 rounded-lg p-6 text-center">
            <h3 className="text-[#2970FF] font-bold text-2xl">122 <span className="text-xl">+</span></h3>
            <p className="text-sm text-gray-700 mt-1">Therapy</p>
          </div>
          
          <div className="bg-[#101828]/10 rounded-lg p-6 text-center">
            <h3 className="text-[#101828] font-bold text-2xl">563 <span className="text-xl">+</span></h3>
            <p className="text-sm text-gray-700 mt-1">Clients</p>
          </div>
          
          <div className="bg-[#F26E5C]/20 rounded-lg p-6 text-center">
            <h3 className="text-[#F26E5C] font-bold text-2xl">232 <span className="text-xl">+</span></h3>
            <p className="text-sm text-gray-700 mt-1">Finished Cases</p>
          </div>
        </div>
      </div>
    </section>
  );
}
