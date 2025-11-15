"use client";

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Connect to backend API
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section className="py-16 relative" id="contact">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#EA5B45] to-[#4269ED] z-0"></div>
      
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Get in Touch With Us</h2>
          <p className="text-white text-lg max-w-2xl mx-auto">
            We're here to help. Contact us through your preferred method and we'll respond
            as soon as possible.
          </p>
        </div>
        
        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden">
          {/* Section Header */}
          <div className="bg-white py-8 px-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900">We're Here to Help</h3>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Contact Options */}
            <div className="md:w-1/2 bg-white p-6 md:p-8 space-y-8">
              {/* Call Us */}
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-orange-500 rounded-full p-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Call Us</h4>
                  <p className="mt-1 text-sm text-gray-500">Mon to Fri, 8am to 6pm</p>
                </div>
              </div>
              
              {/* Email Us */}
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-orange-500 rounded-full p-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Email Us</h4>
                  <p className="mt-1 text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>
              
              {/* Locate Us */}
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-orange-500 rounded-full p-3">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Locate Us</h4>
                  <p className="mt-1 text-sm text-gray-500">Suite 502, Healthcare City, ST 12345</p>
                </div>
              </div>
              
              {/* Visit Us */}
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-orange-500 rounded-full p-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">Visit Us</h4>
                  <p className="mt-1 text-sm text-gray-500">Availability<br/>Monday - Friday<br/>9:00 AM to 5:00 PM</p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Contact Form */}
            <div className="md:w-1/2 bg-gray-50 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Row with Phone and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                {/* Subject */}
                <div>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="appointment">Appointment Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>
                
                {/* Message */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Message"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <div className="text-center">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#F26E5C] hover:bg-[#e45a48] text-white font-medium py-2 px-8 rounded-full transition-all"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                  
                  {/* Success Message */}
                  {isSubmitted && (
                    <p className="mt-4 text-green-600 font-medium">
                      Thank you! Your message has been sent successfully.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Emergency Contact Section */}
        <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold">Emergency Contact</h3>
            <p className="max-w-2xl">
              If you're experiencing a mental health emergency or crisis:
            </p>
            <div className="mt-4 space-y-2">
              <p className="font-bold">Emergency Hotline: 911</p>
              <p className="font-bold">Crisis Helpline: 1-800-273-8255</p>
            </div>
            <p className="text-sm mt-2">
              Available 24/7. Don't hesitate to reach out if you need immediate assistance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
