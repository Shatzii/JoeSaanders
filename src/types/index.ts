export interface Tournament {
  id: string;
  name: string;
  date: Date;
  location: string;
  result: string;
  purse: number;
  earnings?: number;
  description?: string;
  highlights?: string[];
}

export interface Stat {
  label: string;
  value: string | number;
  description?: string;
}

export interface SponsorshipTier {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  featured?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: "apparel" | "equipment" | "accessories";
  inStock: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  membershipTier?: string;
  joinedAt: Date;
}