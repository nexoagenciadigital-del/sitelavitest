import { User as SupabaseAuthUser, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
}

// Extend SupabaseAuthUser with our custom profile data
export interface User extends SupabaseAuthUser {
  user_profile?: UserProfile; // Optional, as it might not always be loaded or exist immediately
}

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_email: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  newsletter_text: string;
  footer_text: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_urls: string[];
  category_id: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  size: string;
  created_at: string;
}
