import PublicPageTemplate from '@/components/templates/PublicPageTemplate';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

// This would typically come from a CMS or API
const getBlogPost = async (slug: string) => {
  // Mock blog data for demonstration
  const posts = {
    'manage-anxiety-daily-life': {
      title: 'How to Manage Anxiety in Daily Life',
      publishedDate: 'June 15, 2025',
      author: {
        name: 'Dr. Sarah Wilson',
        title: 'Clinical Psychologist',
        avatar: 'https://placehold.co/300x300/4F46E5/FFFFFF.jpg?text=SW'
      },
      category: 'Mental Wellness',
      readTime: '5 min read',
      heroImage: 'https://placehold.co/1200x600/4F46E5/FFFFFF.jpg?text=Anxiety+Management',
      content: `
        <p>Anxiety is a natural response to stress, but when it starts interfering with your daily life, it's important to develop effective coping strategies.</p>
        
        <h2>Understanding Anxiety</h2>
        <p>Anxiety disorders affect nearly 30% of adults at some point in their lives. While feeling anxious occasionally is normal, persistent anxiety might indicate an anxiety disorder that requires attention.</p>
        
        <p>Common symptoms include:</p>
        <ul>
          <li>Persistent worry or fear</li>
          <li>Racing thoughts</li>
          <li>Physical symptoms like increased heart rate or sweating</li>
          <li>Avoidance behaviors</li>
          <li>Sleep disturbances</li>
        </ul>
        
        <h2>Practical Strategies for Managing Daily Anxiety</h2>
        
        <h3>1. Mindfulness Practices</h3>
        <p>Mindfulness involves focusing on the present moment without judgment. Regular practice can help reduce anxiety by:</p>
        <ul>
          <li>Bringing awareness to your thoughts without getting caught in worry cycles</li>
          <li>Grounding yourself in the present rather than catastrophizing about the future</li>
          <li>Creating space between you and your anxious thoughts</li>
        </ul>
        
        <p>Try this simple 5-minute mindfulness exercise: Focus on your breath, noticing the sensation of air moving in and out of your body. When your mind wanders (which is normal), gently bring your attention back to your breath.</p>
        
        <h3>2. Cognitive Behavioral Techniques</h3>
        <p>Cognitive Behavioral Therapy (CBT) is one of the most effective approaches for managing anxiety. Key techniques include:</p>
        
        <ul>
          <li><strong>Thought challenging:</strong> Identify negative or catastrophic thoughts and challenge them with evidence and alternative perspectives.</li>
          <li><strong>Behavioral experiments:</strong> Gradually face anxiety-provoking situations to learn that anxiety typically decreases over time.</li>
          <li><strong>Worry scheduling:</strong> Set aside specific "worry time" each day, allowing yourself to focus on other things outside of that time.</li>
        </ul>
        
        <h3>3. Physical Wellness</h3>
        <p>The mind-body connection is powerful in anxiety management:</p>
        
        <ul>
          <li><strong>Regular exercise:</strong> Even 20-30 minutes of moderate activity can reduce anxiety levels significantly.</li>
          <li><strong>Balanced nutrition:</strong> Limiting caffeine, alcohol, and refined sugars can help stabilize mood and energy.</li>
          <li><strong>Adequate sleep:</strong> Poor sleep increases vulnerability to anxiety. Aim for 7-9 hours of quality sleep.</li>
        </ul>
        
        <h3>4. Building a Support System</h3>
        <p>Social support is crucial for managing anxiety:</p>
        
        <ul>
          <li>Share your experiences with trusted friends or family</li>
          <li>Consider joining a support group</li>
          <li>Work with a mental health professional who specializes in anxiety</li>
        </ul>
        
        <h2>When to Seek Professional Help</h2>
        
        <p>While self-management strategies are valuable, it's important to recognize when professional help is needed. Consider reaching out if:</p>
        
        <ul>
          <li>Anxiety significantly impacts your ability to function in daily life</li>
          <li>You've tried self-help strategies without improvement</li>
          <li>You experience panic attacks</li>
          <li>Your anxiety is accompanied by depression or substance use</li>
        </ul>
        
        <p>Remember that seeking help is a sign of strength, not weakness. Effective treatments are available, and many people experience significant improvement with proper support.</p>
        
        <h2>Conclusion</h2>
        
        <p>Managing anxiety is an ongoing practice that combines mindfulness, cognitive strategies, physical wellness, and social support. By developing these skills and knowing when to seek help, you can reduce anxiety's impact on your daily life and build resilience for the future.</p>
      `
    }
  };
  
  return posts[slug as keyof typeof posts] || null;
};

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | The Physc',
      description: 'The requested blog post could not be found.'
    };
  }
  
  return {
    title: `${post.title} | The Physc Blog`,
    description: `Read expert insights about ${post.title} from mental health professionals at The Physc.`,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <PublicPageTemplate>
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category + Back Link */}
        <div className="flex items-center justify-between mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            {post.category}
          </span>
          <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Blog
          </Link>
        </div>
        
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        
        {/* Author + Date */}
        <div className="flex items-center mb-8">
          <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
            <img src={post.author.avatar} alt={post.author.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
            <div className="flex items-center text-xs text-gray-500">
              <span>{post.publishedDate}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <div className="relative h-64 sm:h-96">
            <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Tags:</span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Anxiety</span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Mental Health</span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Wellness</span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Self Care</span>
          </div>
        </div>
        
        {/* Author Bio */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="h-16 w-16 rounded-full bg-gray-300 overflow-hidden">
                <img src={post.author.avatar} alt={post.author.name} className="h-full w-full object-cover" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{post.author.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{post.author.title}</p>
              <p className="text-gray-600">
                Dr. Wilson specializes in anxiety disorders and cognitive-behavioral therapy. 
                With over 15 years of experience, she helps patients develop practical 
                strategies for managing anxiety in their daily lives.
              </p>
            </div>
          </div>
        </div>
        
        {/* Share and Subscribe */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Share this article</h3>
              <div className="flex space-x-2">
                {/* These would be actual social share buttons in a real implementation */}
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <span className="sr-only">Share on Twitter</span>
                  X
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <span className="sr-only">Share on Facebook</span>
                  FB
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <span className="sr-only">Share on LinkedIn</span>
                  IN
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <span className="sr-only">Share via Email</span>
                  ✉
                </button>
              </div>
            </div>
            
            <Button className="bg-[#F26E5C] hover:bg-[#e45a48] text-white">
              <Link href="/dashboard/appointments/new">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
        
        {/* Related Articles - Placeholder */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 mb-2">
                <Link href="#">The Science of Anxiety: Understanding Your Body's Response</Link>
              </h3>
              <p className="text-sm text-gray-500">June 5, 2025 • 6 min read</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 mb-2">
                <Link href="#">5 Breathing Exercises for Immediate Anxiety Relief</Link>
              </h3>
              <p className="text-sm text-gray-500">May 28, 2025 • 4 min read</p>
            </div>
          </div>
        </div>
      </article>
    </PublicPageTemplate>
  );
}
