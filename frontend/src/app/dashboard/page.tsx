"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, MessageSquare, Video, ChevronRight, ArrowRight } from 'lucide-react';

// Dummy data for the dashboard
const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Wilson",
    specialty: "Psychiatrist",
    date: "March 15, 2023",
    time: "10:00 AM",
    type: "Video Consultation",
    image: "/images/doctors/placeholder.svg"
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    specialty: "Psychologist",
    date: "March 22, 2023",
    time: "2:30 PM",
    type: "In-person",
    image: "/images/doctors/placeholder.svg"
  }
];

const recentConsultations = [
  {
    id: 101,
    doctor: "Dr. Sarah Wilson",
    specialty: "Psychiatrist",
    date: "February 28, 2023",
    notes: "Follow-up on anxiety management techniques and medication adjustment."
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, John</h2>
            <p className="mt-1 text-gray-500 dark:text-gray-300">Here's what's happening with your mental health journey</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-[#F26E5C] hover:bg-[#e05a47] text-white" asChild>
              <Link href="/dashboard/appointments/new">
                Book New Appointment
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-[#F26E5C]" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Upcoming Appointments</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">2</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-600 px-5 py-3">
              <div className="text-sm">
                <Link href="/dashboard/appointments" className="font-medium text-[#F26E5C] hover:text-[#e05a47] flex items-center">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Video className="h-6 w-6 text-[#F26E5C]" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Past Consultations</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">1</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-600 px-5 py-3">
              <div className="text-sm">
                <Link href="/dashboard/consultations" className="font-medium text-[#F26E5C] hover:text-[#e05a47] flex items-center">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-[#F26E5C]" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Medical Records</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">3</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-600 px-5 py-3">
              <div className="text-sm">
                <Link href="/dashboard/medical-records" className="font-medium text-[#F26E5C] hover:text-[#e05a47] flex items-center">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg shadow relative">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-500 rounded-full">New</span>
            </div>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-[#F26E5C]" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Prescriptions</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">2</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-600 px-5 py-3">
              <div className="text-sm">
                <Link href="/dashboard/prescriptions" className="font-medium text-[#F26E5C] hover:text-[#e05a47] flex items-center">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Appointments</h2>
          <Link
            href="/dashboard/appointments"
            className="text-sm font-medium text-[#F26E5C] hover:text-[#e05a47] flex items-center"
          >
            View all appointments
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        
        {upcomingAppointments.length > 0 ? (
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 gap-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="relative rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center"
                >
                  <div className="flex-shrink-0 mr-4">
                    {/* Placeholder for doctor image - this would be an actual image in production */}
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-300 text-lg font-medium">
                        {appointment.doctor.split(' ')[1][0]}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.doctor} - {appointment.specialty}
                    </div>
                    <div className="flex mt-1">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mr-4">
                        <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {appointment.time}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {appointment.type}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Button
                      className={appointment.type.includes('Video') ? 'bg-[#F26E5C] hover:bg-[#e05a47]' : 'bg-gray-600 hover:bg-gray-700'}
                      size="sm"
                      asChild={appointment.type.includes('Video')}
                    >
                      {appointment.type.includes('Video') ? (
                        <Link href={`/dashboard/video-call/session-${appointment.id}`}>
                          <Video className="mr-2 h-4 w-4" />
                          Join Call
                        </Link>
                      ) : (
                        'View Details'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">You have no upcoming appointments</p>
            <Button className="mt-4 bg-[#F26E5C] hover:bg-[#e05a47]" asChild>
              <Link href="/dashboard/appointments/new">Book an Appointment</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Recent consultations */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Consultations</h2>
          <Link
            href="/dashboard/consultations"
            className="text-sm font-medium text-[#F26E5C] hover:text-[#e05a47] flex items-center"
          >
            View all consultations
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        
        {recentConsultations.length > 0 ? (
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 gap-4">
              {recentConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="relative rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {consultation.doctor} - {consultation.specialty}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        {consultation.date}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Button variant="outline" size="sm">
                        View Summary
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Notes:</strong> {consultation.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">You have no recent consultations</p>
          </div>
        )}
      </div>

      {/* Resources section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resources for You</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="h-36 bg-gray-100 dark:bg-gray-700">
              {/* Placeholder for article image */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>Resource Image</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Managing Anxiety in Daily Life</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Learn effective techniques to manage anxiety and stress in everyday situations.
              </p>
              <Button variant="link" className="mt-2 px-0 text-[#F26E5C] hover:text-[#e05a47]">
                Read More
              </Button>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="h-36 bg-gray-100 dark:bg-gray-700">
              {/* Placeholder for article image */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>Resource Image</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">The Link Between Sleep & Mental Health</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Discover how sleep patterns affect your mental well-being and ways to improve sleep quality.
              </p>
              <Button variant="link" className="mt-2 px-0 text-[#F26E5C] hover:text-[#e05a47]">
                Read More
              </Button>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="h-36 bg-gray-100 dark:bg-gray-700">
              {/* Placeholder for article image */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>Resource Image</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Understanding Depression: Signs & Treatment</h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                A comprehensive guide on recognizing depression symptoms and available treatment options.
              </p>
              <Button variant="link" className="mt-2 px-0 text-[#F26E5C] hover:text-[#e05a47]">
                Read More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
