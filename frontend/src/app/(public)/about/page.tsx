import AboutSection from '@/components/organisms/AboutSection';
import PublicPageTemplate from '@/components/templates/PublicPageTemplate';
import TestimonialsSection from '@/components/organisms/TestimonialsSection';

export const metadata = {
  title: 'About Us | The Physc',
  description: 'Learn about our mission, our team of mental health specialists, and our commitment to providing quality care.',
};

export default function AboutPage() {
  return (
    <PublicPageTemplate>
      {/* Hero Section specific to About page */}
      <div className="bg-gradient-to-r from-[#4269ED] to-[#EA5B45] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About The Physc</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            We're a team of dedicated mental health professionals committed to improving 
            lives through compassionate care and evidence-based treatment.
          </p>
        </div>
      </div>
      
      {/* About Section with more details */}
      <AboutSection />
      
      {/* Our Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission & Values</h2>
            <div className="mt-2 h-1 w-24 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassionate Care</h3>
              <p className="text-gray-600">
                We believe in treating every patient with dignity, empathy, and respect, 
                creating a safe space for healing and growth.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Evidence-Based Treatment</h3>
              <p className="text-gray-600">
                Our therapeutic approaches are grounded in research and clinical evidence, 
                ensuring effective care for all our patients.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Accessible Mental Health</h3>
              <p className="text-gray-600">
                We're committed to making quality mental healthcare accessible to all through 
                our telemedicine platform and flexible scheduling.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section - Can be expanded later */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Expert Team</h2>
            <div className="mt-2 h-1 w-24 bg-blue-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Meet our team of board-certified psychiatrists and licensed psychologists dedicated to your mental wellbeing.
            </p>
          </div>
          
          {/* Team grid - Placeholder for now */}
          <div className="text-center">
            <p className="text-blue-600 font-medium">
              Coming soon - Our full team directory
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <TestimonialsSection />
    </PublicPageTemplate>
  );
}
