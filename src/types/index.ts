import { User as SupabaseAuthUser } from '@supabase/supabase-js';

// Tipos centralizados para melhor organização
export interface Product {
  id: string; // Changed to string for UUID
  name: string;
  price: number;
  original_price?: number; // Changed to original_price
  image?: string;
  rating?: number;
  badge?: string;
  badge_color?: string; // Changed to badge_color
  description?: string;
  sizes?: string[];
  colors?: string[];
  category_id: string; // Changed to category_id for FK
  in_stock?: boolean; // Changed to in_stock
  discount?: number;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  id: number; // This is a local ID for cart, not product ID
  product_id: string; // Reference to Product.id
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
}

export interface UserProfile {
  id: string; // References auth.users.id
  name: string;
  role: 'admin' | 'user';
  cpf?: string;
  telefone?: string;
  address?: {
    cep: string;
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  aceita_newsletter?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Extend Supabase's User type with our profile data
export interface User extends SupabaseAuthUser {
  user_profile?: UserProfile;
}

export interface SiteSettings {
  id: string;
  company_name: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  twitter: string;
  whatsapp: string;
  working_hours: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_description: string;
  free_shipping_min_value: number;
  discount_percentage: number;
  logo_url: string;
  button_links: {
    verColecao: string;
    ofertas: string;
    verOfertas: string;
    comprarAgora: string;
    queroDesconto: string;
    falarWhatsApp: string;
    verTodosProdutos: string;
    baixarApp: string;
    criarConta: string;
  };
  updated_at?: string;
}
