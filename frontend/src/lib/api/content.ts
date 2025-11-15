import apiClient from './client';
import { CONTENT_ENDPOINTS } from './endpoints';

// Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
  publishedDate: string;
  readTime: string;
  heroImage?: string;
  tags: string[];
}

export interface ServiceContent {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  treatments: string[];
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
  content: string;
  rating: number;
  service?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// API methods
export const contentApi = {
  // Blog posts
  getBlogPosts: async (params?: { category?: string; page?: number; limit?: number }) => {
    try {
      const response = await apiClient.get(CONTENT_ENDPOINTS.BLOG_POSTS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },
  
  getBlogPostBySlug: async (slug: string) => {
    try {
      const response = await apiClient.get(CONTENT_ENDPOINTS.BLOG_POST(slug));
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog post with slug ${slug}:`, error);
      throw error;
    }
  },
  
  // Services
  getServices: async () => {
    try {
      const response = await apiClient.get(CONTENT_ENDPOINTS.SERVICES);
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },
  
  getServiceBySlug: async (slug: string) => {
    try {
      const response = await apiClient.get(CONTENT_ENDPOINTS.SERVICE(slug));
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with slug ${slug}:`, error);
      throw error;
    }
  },
  
  // Testimonials
  getTestimonials: async () => {
    try {
      const response = await apiClient.get(CONTENT_ENDPOINTS.TESTIMONIALS);
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },
  
  // FAQs
  getFAQs: async (category?: string) => {
    try {
      const response = await apiClient.get(CONTENT_ENDPOINTS.FAQS, { 
        params: category ? { category } : undefined 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }
};
