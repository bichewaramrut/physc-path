"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  specialties?: string[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
  title?: string;
  subtitle?: string;
}

export default function TeamSection({
  teamMembers,
  title = "Our Team",
  subtitle = "Meet our dedicated team of mental health professionals"
}: TeamSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-80 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.title}</p>
                
                {member.specialties && member.specialties.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {member.specialties.map((specialty, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-gray-600 mb-5 line-clamp-3">{member.bio}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    {member.socialMedia?.linkedin && (
                      <Link href={member.socialMedia.linkedin} className="text-gray-500 hover:text-primary transition-colors">
                        <Linkedin size={18} />
                      </Link>
                    )}
                    {member.socialMedia?.twitter && (
                      <Link href={member.socialMedia.twitter} className="text-gray-500 hover:text-primary transition-colors">
                        <Twitter size={18} />
                      </Link>
                    )}
                    {member.socialMedia?.facebook && (
                      <Link href={member.socialMedia.facebook} className="text-gray-500 hover:text-primary transition-colors">
                        <Facebook size={18} />
                      </Link>
                    )}
                    {member.socialMedia?.instagram && (
                      <Link href={member.socialMedia.instagram} className="text-gray-500 hover:text-primary transition-colors">
                        <Instagram size={18} />
                      </Link>
                    )}
                  </div>
                  
                  <Link 
                    href={`/team/${member.id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
