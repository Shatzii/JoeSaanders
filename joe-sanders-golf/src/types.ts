// TypeScript type definitions for the Joe Sanders Golf Platform

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

export interface Tournament {
  id: string;
  date: string; // DATE in SQL, but string in TypeScript
  name: string;
  result?: string;
  recap_text?: string;
  video_url?: string;
  photo_urls?: string[]; // Array of strings
  created_at: string;
  updated_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  tier: string;
  website_url?: string;
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