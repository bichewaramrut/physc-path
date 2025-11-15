'use client';

import { useState, useCallback } from 'react';
import { contentApi, BlogPost, ServiceContent, Testimonial, FAQ } from '@/lib/api/content';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPosts = useCallback(async (params?: { category?: string; page?: number; limit?: number }) => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentApi.getBlogPosts(params);
      setPosts(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchPostBySlug = useCallback(async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentApi.getBlogPostBySlug(slug);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch blog post with slug: ${slug}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    posts,
    loading,
    error,
    fetchPosts,
    fetchPostBySlug
  };
}

export function useServices() {
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentApi.getServices();
      setServices(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchServiceBySlug = useCallback(async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentApi.getServiceBySlug(slug);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch service with slug: ${slug}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    services,
    loading,
    error,
    fetchServices,
    fetchServiceBySlug
  };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentApi.getTestimonials();
      setTestimonials(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    testimonials,
    loading,
    error,
    fetchTestimonials
  };
}

export function useFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchFAQs = useCallback(async (category?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentApi.getFAQs(category);
      setFaqs(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch FAQs');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    faqs,
    loading,
    error,
    fetchFAQs
  };
}
