"use client";

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Footer top section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* Logo & company info */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="flex items-center">
              <img 
                src="/images/logo.svg" 
                alt="The Physc Logo" 
                className="h-10"
              />
            </div>
          </div>
          
          {/* Navigation links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Home</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-xs text-gray-600 hover:text-[#F26E5C]">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-xs text-gray-600 hover:text-[#F26E5C]">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-xs text-gray-600 hover:text-[#F26E5C]">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Services</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/services" className="text-xs text-gray-600 hover:text-[#F26E5C]">
                  Anxiety Management
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-xs text-gray-600 hover:text-[#F26E5C]">
                  Depression Therapy
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-xs text-gray-600 hover:text-[#F26E5C]">
                  Addiction Recovery
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/contact" className="text-xs text-gray-600 hover:text-[#F26E5C]">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-xs text-gray-600 hover:text-[#F26E5C]">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-xs text-gray-600 hover:text-[#F26E5C]">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer bottom section */}
        <div className="mt-8 border-t border-gray-100 pt-4 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-gray-500">
            © {new Date().getFullYear()} All rights reserved • Privacy policy • Terms and conditions
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link href="#" className="text-gray-600 hover:text-[#F26E5C]">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#F26E5C]">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#F26E5C]">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#F26E5C]">
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
