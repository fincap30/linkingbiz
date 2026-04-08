export type UserRole = 'business' | 'referrer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  logo_url?: string;
  cover_image_url?: string;
  website?: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  province: string;
  postal_code?: string;
  country: string;
  industry: string;
  services: string[];
  commission_rate: number;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  business_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'converted' | 'declined' | 'cancelled';
  commission_amount?: number;
  commission_paid: boolean;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralWithDetails extends Referral {
  business: Business;
  referrer: User;
}

export interface Commission {
  id: string;
  referral_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed';
  paid_at?: string;
  created_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface HubSearchFilters {
  industry?: string;
  city?: string;
  province?: string;
  verified?: boolean;
  minRating?: number;
  query?: string;
}
