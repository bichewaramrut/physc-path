import ContactSection from '@/components/organisms/ContactSection';
import PublicPageTemplate from '@/components/templates/PublicPageTemplate';

export const metadata = {
  title: 'Contact Us | The Physc',
  description: 'Get in touch with our mental health specialists. We\'re here to help with all your questions and concerns.',
};

export default function ContactPage() {
  return (
    <PublicPageTemplate>
      <ContactSection />
    </PublicPageTemplate>
  );
}
