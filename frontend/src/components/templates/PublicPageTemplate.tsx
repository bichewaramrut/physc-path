"use client";

import { ReactNode } from 'react';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';

interface PublicPageTemplateProps {
  children: ReactNode;
}

export default function PublicPageTemplate({ children }: PublicPageTemplateProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
