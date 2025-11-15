import PublicPageTemplate from '@/components/templates/PublicPageTemplate';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Blog | Mental Health Resources | The Physc',
  description: 'Explore our collection of mental health articles, resources, and expert insights to support your wellbeing journey.',
};

// Mock blog data - In a real implementation, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: 'How to Manage Anxiety in Daily Life',
    excerpt: 'Practical tips and mindfulness techniques to reduce stress and anxiety in everyday situations.',
    category: 'Mental Wellness',
    date: 'June 15, 2025',
    author: 'Dr. Sarah Wilson',
    authorTitle: 'Clinical Psychologist',
    imageUrl: 'https://placehold.co/600x400/4F46E5/FFFFFF.jpg?text=Anxiety+Management',
    slug: 'manage-anxiety-daily-life',
    readTime: '5 min read'
  },
  {
    id: 2,
    title: 'The Link Between Sleep & Mental Health',
    excerpt: 'Exploring how sleep patterns affect mental well-being and ways to improve sleep hygiene.',
    category: 'Sleep',
    date: 'June 8, 2025',
    author: 'Dr. Michael Chen',
    authorTitle: 'Psychiatrist',
    imageUrl: 'https://placehold.co/600x400/4F46E5/FFFFFF.jpg?text=Sleep+Health',
    slug: 'sleep-mental-health-link',
    readTime: '7 min read'
  },
  {
    id: 3,
    title: 'Understanding Depression: Signs & Treatment',
    excerpt: 'A comprehensive guide on recognizing depression, its symptoms, and treatment options available.',
    category: 'Depression',
    date: 'May 28, 2025',
    author: 'Dr. Emily Johnson',
    authorTitle: 'Psychiatric Nurse Practitioner',
    imageUrl: 'https://placehold.co/600x400/4F46E5/FFFFFF.jpg?text=Depression+Guide',
    slug: 'understanding-depression-signs-treatment',
    readTime: '8 min read'
  },
  {
    id: 4,
    title: 'Building Resilience Through Mindfulness',
    excerpt: 'Learn how mindfulness practices can help you build emotional resilience and cope with life challenges.',
    category: 'Mindfulness',
    date: 'May 20, 2025',
    author: 'Dr. James Rodriguez',
    authorTitle: 'Clinical Psychologist',
    imageUrl: 'https://placehold.co/600x400/4F46E5/FFFFFF.jpg?text=Mindfulness+Practices',
    slug: 'building-resilience-through-mindfulness',
    readTime: '6 min read'
  },
  {
    id: 5,
    title: 'Supporting a Loved One with Mental Illness',
    excerpt: 'Guidance for family and friends on how to provide effective support while maintaining boundaries.',
    category: 'Support',
    date: 'May 12, 2025',
    author: 'Dr. Lisa Kim',
    authorTitle: 'Family Therapist',
    imageUrl: 'https://placehold.co/600x400/4F46E5/FFFFFF.jpg?text=Family+Support',
    slug: 'supporting-loved-one-mental-illness',
    readTime: '7 min read'
  },
  {
    id: 6,
    title: 'The Benefits of Teletherapy',
    excerpt: 'How online therapy is breaking down barriers to mental healthcare access and improving outcomes.',
    category: 'Telemedicine',
    date: 'May 5, 2025',
    author: 'Dr. Robert Garcia',
    authorTitle: 'Digital Health Specialist',
    imageUrl: 'https://placehold.co/600x400/4F46E5/FFFFFF.jpg?text=Teletherapy+Benefits',
    slug: 'benefits-of-teletherapy',
    readTime: '5 min read'
  }
];

// Categories for filtering
const categories = [
  'All',
  'Mental Wellness',
  'Depression',
  'Anxiety',
  'Sleep',
  'Mindfulness',
  'Telemedicine',
  'Support'
];

export default function BlogPage() {
  return (
    <PublicPageTemplate>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4269ED] to-[#EA5B45] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Mental Health Blog</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Expert insights, practical advice, and the latest research to support your mental wellbeing journey.
          </p>
        </div>
      </div>
      
      {/* Blog Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    category === 'All' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Featured Article */}
          <div className="mb-16">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Featured Image */}
                <div className="relative h-64 lg:h-auto">
                  <div className="absolute inset-0 bg-blue-600" />
                </div>
                
                {/* Content */}
                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">Featured</span>
                    <span className="ml-2 inline-block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">Mental Wellness</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Mental Health in the Digital Age: Finding Balance</h2>
                  <p className="text-gray-600 mb-6">
                    In our increasingly connected world, maintaining mental wellness requires intentional strategies.
                    Learn how to balance screen time, social media consumption, and digital boundaries.
                  </p>
                  
                  <div className="flex items-center mb-6">
                    <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dr. Rachel Thompson</p>
                      <p className="text-xs text-gray-500">Digital Wellness Expert</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">June 22, 2025 • 10 min read</p>
                    <Button
                      className="bg-[#F26E5C] hover:bg-[#e45a48] text-white"
                      asChild
                    >
                      <Link href="/blog/mental-health-digital-age">Read More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow">
                {/* Image */}
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-blue-200"></div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">{post.category}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-300 mr-2"></div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-16 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                &lt; Previous
              </button>
              <button className="p-2 rounded-md bg-blue-600 text-white">1</button>
              <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">2</button>
              <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">3</button>
              <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                Next &gt;
              </button>
            </nav>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest mental health tips, resources, and articles delivered to your inbox monthly.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Button type="submit" className="bg-[#F26E5C] hover:bg-[#e45a48] text-white px-6">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </PublicPageTemplate>
  );
}
