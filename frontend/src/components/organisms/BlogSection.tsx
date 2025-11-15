"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: 'How to Manage Anxiety in Daily Life',
    excerpt: 'Practical tips and mindfulness techniques to reduce stress and anxiety in everyday situations.',
    category: 'Mental Wellness',
    date: 'June 15, 2025',
    imageUrl: 'https://placehold.co/600x400/4F46E5/FFFFFF.jpg?text=Anxiety+Management',
    slug: 'manage-anxiety-daily-life'
  },
  {
    id: 2,
    title: 'The Link Between Sleep & Mental Health',
    excerpt: 'Exploring how sleep patterns affect mental well-being and ways to improve sleep hygiene.',
    category: 'Sleep',
    date: 'June 8, 2025',
    imageUrl: 'https://placehold.co/600x400/4F46E5/FFFFFF.jpg?text=Sleep+Health',
    slug: 'sleep-mental-health-link'
  },
  {
    id: 3,
    title: 'Understanding Depression: Signs & Treatment',
    excerpt: 'A comprehensive guide on recognizing depression, its symptoms, and treatment options available.',
    category: 'Depression',
    date: 'May 29, 2025',
    imageUrl: 'https://placehold.co/600x400/4F46E5/FFFFFF.jpg?text=Understanding+Depression',
    slug: 'understanding-depression-signs-treatment'
  }
];

export default function BlogSection() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Blog & Resources</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Enhancing User Engagement with Educational Resources
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Our platform is designed not only to connect patients with mental health professionals 
            but also to educate, empower, and engage users with valuable resources.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-32 sm:pt-48 lg:pt-64"
            >
              <div className="absolute inset-0 z-0">
                <div className="h-full w-full bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="h-full w-full absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="h-full w-full bg-black/20" />
              </div>
              <div className="absolute inset-0 z-[-10]">
                <div className="h-full w-full object-cover">
                  <Image 
                    src={post.imageUrl} 
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              
              <div className="z-10 gap-y-1 overflow-hidden">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.date} className="text-gray-300">
                    {post.date}
                  </time>
                  <div className="relative rounded-full bg-primary px-3 py-1.5 text-white font-medium">
                    {post.category}
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0 z-20" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/blog">Read More Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
