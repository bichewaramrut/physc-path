"use client";

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut,
  Video,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Clock },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Consultations', href: '/dashboard/consultations', icon: Video },
    { name: 'Medical Records', href: '/dashboard/medical-records', icon: FileText },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75" 
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            ></div>
          )}
          
          {/* Sidebar */}
          <div
            className={`fixed inset-0 z-40 flex transform transition-transform ease-in-out duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800 pt-5 pb-4">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              
              {/* Mobile logo */}
              <div className="flex flex-shrink-0 items-center px-4">
                <Link href="/">
                  <Image 
                    src="/images/logo.svg" 
                    alt="The Physc Logo" 
                    width={120} 
                    height={40} 
                    priority
                  />
                </Link>
              </div>
              
              {/* Mobile navigation */}
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${
                          isActive 
                            ? 'bg-[#FEF3F2] text-[#F26E5C]' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        <item.icon 
                          className={`mr-4 h-6 w-6 flex-shrink-0 ${
                            isActive ? 'text-[#F26E5C]' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'
                          }`} 
                          aria-hidden="true" 
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              
              {/* Mobile logout */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3 px-2">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-[#F26E5C] flex items-center justify-center">
                      <span className="text-white font-medium">JD</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">John Doe</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">john.doe@example.com</div>
                  </div>
                </div>
                <Link
                  href="/logout"
                  className="mt-3 group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <LogOut className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  Logout
                </Link>
              </div>
            </div>
            
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link href="/">
                <Image 
                  src="/images/logo.svg" 
                  alt="The Physc Logo" 
                  width={120} 
                  height={40} 
                  priority
                />
              </Link>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive 
                        ? 'bg-[#FEF3F2] text-[#F26E5C]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon 
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-[#F26E5C]' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'
                      }`} 
                      aria-hidden="true" 
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-[#F26E5C] flex items-center justify-center">
                  <span className="text-white font-medium">JD</span>
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-gray-900 dark:text-white">John Doe</div>
                <div className="truncate text-sm text-gray-500 dark:text-gray-400">Patient</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-gray-400 hover:text-gray-500"
                asChild
              >
                <Link href="/logout">
                  <span className="sr-only">Logout</span>
                  <LogOut className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top navbar */}
        <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white dark:bg-gray-800 shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification button */}
              <button
                type="button"
                className="rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 pb-8">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
