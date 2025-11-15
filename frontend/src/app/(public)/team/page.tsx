"use client";

import Link from 'next/link';
import PublicPageTemplate from '@/components/templates/PublicPageTemplate';
import TeamSection from '@/components/organisms/TeamSection';

// Mock data for team members
const teamMembers = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Psychiatrist, MD",
    bio: "Dr. Johnson is a board-certified psychiatrist with over 15 years of experience specializing in mood disorders and anxiety. She completed her medical training at Harvard Medical School and residency at Massachusetts General Hospital.",
    image: "/images/testimonials/profile-1.svg",
    specialties: ["Mood Disorders", "Anxiety", "Medication Management"],
    socialMedia: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "Clinical Psychologist, PhD",
    bio: "Dr. Chen specializes in cognitive behavioral therapy and mindfulness-based approaches. With a PhD from Stanford University, he has helped hundreds of clients navigate depression, anxiety, and life transitions.",
    image: "/images/testimonials/profile-2.svg",
    specialties: ["CBT", "Mindfulness", "Depression"],
    socialMedia: {
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com"
    }
  },
  {
    id: "3",
    name: "Dr. Aisha Patel",
    title: "Psychiatrist, MD",
    bio: "Dr. Patel is passionate about providing culturally-sensitive care. She specializes in trauma, PTSD, and anxiety disorders. She earned her medical degree from Johns Hopkins University.",
    image: "/images/testimonials/profile-3.svg",
    specialties: ["Trauma", "PTSD", "Cultural Psychiatry"],
    socialMedia: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com"
    }
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "Neuropsychologist, PsyD",
    bio: "Dr. Wilson specializes in neuropsychological assessment and treatment of ADHD, learning disorders, and cognitive impairments. He earned his doctorate from UCLA and has extensive experience working with both adults and children.",
    image: "/images/testimonials/profile-4.svg",
    specialties: ["ADHD", "Neuropsychological Assessment", "Learning Disorders"],
    socialMedia: {
      linkedin: "https://linkedin.com"
    }
  },
  {
    id: "5",
    name: "Dr. Elena Rodriguez",
    title: "Therapist, LMFT",
    bio: "Elena is a Licensed Marriage and Family Therapist specializing in relationships, couples therapy, and family dynamics. With over a decade of experience, she helps clients build healthier connections and communication patterns.",
    image: "/images/testimonials/profile-1.svg",
    specialties: ["Couples Therapy", "Family Therapy", "Relationship Issues"],
    socialMedia: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com"
    }
  },
  {
    id: "6",
    name: "Dr. Robert Thompson",
    title: "Clinical Psychologist, PhD",
    bio: "Dr. Thompson specializes in evidence-based treatments for anxiety disorders, OCD, and phobias. He combines cognitive behavioral therapy with acceptance and commitment therapy for a comprehensive approach to mental wellbeing.",
    image: "/images/testimonials/profile-2.svg",
    specialties: ["Anxiety Disorders", "OCD", "Phobias", "ACT"],
    socialMedia: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  }
];

export default function TeamPage() {
  return (
    <PublicPageTemplate>
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Expert Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Meet our diverse team of experienced psychiatrists, psychologists, and therapists 
            dedicated to providing exceptional mental healthcare.
          </p>
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-700">
              At The Physc, we carefully select our mental health professionals based on their expertise,
              experience, and commitment to compassionate care. All of our practitioners are licensed,
              board-certified, and undergo rigorous background checks to ensure you receive the highest
              quality of care.
            </p>
          </div>
        </div>
      </div>
      
      <TeamSection 
        teamMembers={teamMembers}
        title="Meet Our Mental Health Professionals"
        subtitle="Our diverse team of experts is passionate about providing personalized care for your mental health needs"
      />
      
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Approach</h2>
            <p className="text-gray-700 mb-8">
              Our team takes a collaborative, patient-centered approach to mental healthcare. We believe in treating
              the whole person, not just symptoms, and work closely with each client to develop personalized
              treatment plans that address their unique needs and goals.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-3">Evidence-Based Care</h3>
                <p className="text-gray-600">
                  We utilize the latest research and evidence-based treatments to ensure you receive
                  the most effective care possible for your specific condition.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-3">Compassionate Support</h3>
                <p className="text-gray-600">
                  Our team provides a judgment-free, supportive environment where you can feel safe
                  discussing your mental health concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to connect with a specialist?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Schedule your initial consultation today and take the first step towards better mental health.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dashboard/appointments/new"
              className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-200"
            >
              Book an Appointment
            </Link>
            <Link 
              href="/services"
              className="px-6 py-3 bg-white text-primary border border-primary rounded-md hover:bg-gray-50 transition duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </PublicPageTemplate>
  );
}
