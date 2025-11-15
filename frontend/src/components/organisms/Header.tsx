"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About us', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact us', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">The Physc</span>
            <div className="flex items-center">
              <Image 
                src="/images/logo.svg" 
                alt="The Physc Logo" 
                width={120} 
                height={40} 
                priority 
              />
            </div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-4">
          <Link 
            href="/login" 
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200 hover:text-primary dark:hover:text-primary flex items-center"
          >
            Login
          </Link>
          <Button className="bg-[#F26E5C] hover:bg-[#e05a47] text-white" asChild>
            <Link href="/signup">
              <span>Sign Up</span>
            </Link>
          </Button>
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
          <div className="fixed inset-0 flex">
            <div className="relative flex w-full max-w-sm flex-1 flex-col overflow-y-auto pb-4 pt-5 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">The Physc</span>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white font-bold">P</span>
                    </div>
                    <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">The Physc</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="space-y-2 py-6 px-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6 px-4 space-y-2">
                    <Link 
                      href="/login"
                      className="block w-full text-center py-2 text-sm font-semibold text-gray-900 dark:text-gray-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Button className="w-full bg-[#F26E5C] hover:bg-[#e05a47] text-white" asChild>
                      <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
