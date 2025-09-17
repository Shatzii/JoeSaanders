// TypeScript type definitions for the Uncle Joes Golf Platform

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'set' | 'event' | 'consent' | 'js',
      targetId: string | Date | ConsentParams,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

interface ConsentParams {
  analytics_storage?: 'granted' | 'denied';
  ad_storage?: 'granted' | 'denied';
}

// Shot data structure for simulator
export interface ShotData {
  id: string;
  distance: number;
  accuracy: number;
  club: string;
  timestamp: string;
  userId?: string;
}

// Tournament data structure
export interface Tournament {
  id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
  image_url?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  // Additional properties for journey/tournament details
  name?: string; // Alternative to title for display
  result?: string;
  recap_text?: string;
  photo_urls?: string[];
  video_url?: string;
}

// Sponsor data structure
export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  description: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Merchandise data structure
export interface Merchandise {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: string;
  in_stock: boolean;
  stripe_price_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Newsletter subscriber structure
export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

// Contact form data
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Health check response
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: boolean;
    email: boolean;
    payments: boolean;
  };
  version: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_fan_club_member: boolean;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Merch {
  id: string;
  name: string;
  description?: string;
  price_id: string;
  image_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FanClubSubscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterEmail {
  id: string;
  email: string;
  subscribed_at: string;
}