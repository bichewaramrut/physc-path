import ServicesSection from '@/components/organisms/ServicesSection';
import PublicPageTemplate from '@/components/templates/PublicPageTemplate';
import { Button } from '@/components/ui/button';
import { Brain, HeartPulse, Wine, Baby, Users, Building2, BookOpen, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Our Services | The Physc',
  description: 'Explore our comprehensive mental health services including therapy, psychiatry, and specialized treatments.',
};

// Extended service details
const serviceDetails = [
  {
    id: 'anxiety',
    name: 'Anxiety & Stress Management',
    description: 'Our approach to anxiety and stress management combines evidence-based therapeutic techniques with practical coping strategies that you can apply in your daily life.',
    longDescription: `Anxiety and stress can manifest in many forms, from generalized anxiety to specific phobias, social anxiety, and panic attacks. Our specialists are trained in cognitive-behavioral therapy (CBT), acceptance and commitment therapy (ACT), and mindfulness-based stress reduction (MBSR) to provide you with a customized treatment plan. We'll help you identify triggers, challenge negative thought patterns, and develop healthy coping mechanisms.`,
    icon: Brain,
    treatments: [
      'Cognitive-Behavioral Therapy (CBT)',
      'Exposure Therapy',
      'Mindfulness Techniques',
      'Stress Management Skills',
      'Panic Attack Management'
    ],
    image: '/images/services/anxiety-management.jpg'
  },
  {
    id: 'depression',
    name: 'Depression & Mood Disorders',
    description: 'We offer comprehensive treatment for depression, bipolar disorder, and other mood conditions through a combination of therapy and medication management.',
    longDescription: `Depression and mood disorders can deeply affect your quality of life, relationships, and daily functioning. Our psychiatrists and psychologists work together to create an integrated treatment approach that addresses both the biological and psychological aspects of mood disorders. Whether you're experiencing major depression, bipolar disorder, dysthymia, or seasonal affective disorder, we provide evidence-based interventions tailored to your specific needs.`,
    icon: HeartPulse,
    treatments: [
      'Psychotherapy (CBT, IPT)',
      'Medication Management',
      'Behavioral Activation',
      'Lifestyle Modifications',
      'Relapse Prevention'
    ],
    image: '/images/services/depression-treatment.jpg'
  },
  {
    id: 'addiction',
    name: 'Addiction & Substance Abuse',
    description: 'Our addiction specialists provide compassionate, non-judgmental care to help you overcome substance dependence and build a sustainable recovery.',
    longDescription: `Recovery from addiction requires addressing both the physical and psychological aspects of substance use disorders. Our approach combines evidence-based treatments with supportive counseling to help you understand the root causes of addiction, develop coping strategies, and create a sustainable path to recovery. We work with individuals struggling with alcohol, prescription medications, illegal substances, and behavioral addictions.`,
    icon: Wine,
    treatments: [
      'Substance Use Evaluations',
      'Individual & Group Therapy',
      'Medication-Assisted Treatment',
      'Relapse Prevention Planning',
      'Family Counseling'
    ],
    image: '/images/services/addiction-recovery.jpg'
  },
  {
    id: 'children',
    name: 'Child & Adolescent Psychiatry',
    description: 'Our specialists provide age-appropriate mental health care for children and teenagers, addressing their unique developmental needs.',
    longDescription: `Children and adolescents face unique challenges that require specialized approaches to mental health care. Our child psychiatrists and psychologists are trained to identify and treat conditions like ADHD, autism spectrum disorders, anxiety, depression, and behavioral problems in young people. We work closely with parents and, when appropriate, schools to create comprehensive treatment plans that support healthy development and emotional well-being.`,
    icon: Baby,
    treatments: [
      'ADHD Assessment & Management',
      'Autism Spectrum Evaluations',
      'Play Therapy',
      'Family Therapy',
      'School Consultation'
    ],
    image: '/images/services/child-therapy.jpg'
  }
];

export default function ServicesPage() {
  return (
    <PublicPageTemplate>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4269ED] to-[#EA5B45] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Our Mental Health Services</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Comprehensive psychiatric and psychological care delivered through our secure telemedicine platform.
          </p>
        </div>
      </div>
      
      {/* Overview of all services */}
      <ServicesSection />
      
      {/* Detailed Service Sections */}
      {serviceDetails.map((service, index) => (
        <section 
          key={service.id} 
          id={service.id} 
          className={`py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
              {/* Image */}
              <div className={index % 2 !== 0 ? 'order-1 lg:order-2' : ''}>
                <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg shadow-lg">
                  <div className="w-full h-full bg-blue-200 flex items-center justify-center">
                    <service.icon className="h-24 w-24 text-blue-600" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className={index % 2 !== 0 ? 'order-2 lg:order-1' : ''}>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h2>
                <p className="text-lg text-gray-600 mb-6">{service.longDescription}</p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Treatment Approaches:</h3>
                  <ul className="space-y-2">
                    {service.treatments.map((treatment, i) => (
                      <li key={i} className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="bg-[#F26E5C] hover:bg-[#e45a48] text-white">
                  <Link href="/dashboard/appointments/new">Schedule Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      ))}
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <div className="mt-2 h-1 w-24 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">How do telemedicine appointments work?</h3>
              <p className="mt-2 text-gray-600">
                Our telemedicine appointments are conducted through our secure video platform. You'll receive a link to join your session at the scheduled time, where you'll meet with your provider just like an in-person visit, but from the comfort of your own space.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Is telemedicine as effective as in-person therapy?</h3>
              <p className="mt-2 text-gray-600">
                Research consistently shows that telemedicine is just as effective as in-person care for most mental health conditions. Many patients actually prefer the convenience and privacy of virtual sessions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Will my insurance cover telemedicine services?</h3>
              <p className="mt-2 text-gray-600">
                Most insurance providers now cover telemedicine services for mental health. We can verify your benefits before your first appointment and provide you with information about any potential costs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">How quickly can I get an appointment?</h3>
              <p className="mt-2 text-gray-600">
                We offer flexible scheduling with availability often within 1-2 weeks for new patients, and sooner for urgent situations. Our online booking system shows real-time availability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicPageTemplate>
  );
}
