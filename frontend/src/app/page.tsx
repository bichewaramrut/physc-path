import HeroSection from '@/components/organisms/HeroSection';
import ServicesSection from '@/components/organisms/ServicesSection';
import AboutSection from '@/components/organisms/AboutSection';
import TestimonialsSection from '@/components/organisms/TestimonialsSection';
import CTASection from '@/components/organisms/CTASection';
import BlogSection from '@/components/organisms/BlogSection';
import PublicPageTemplate from '@/components/templates/PublicPageTemplate';

export default function Home() {
  return (
    <PublicPageTemplate>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <BlogSection />
      <CTASection />
    </PublicPageTemplate>
  );
}
