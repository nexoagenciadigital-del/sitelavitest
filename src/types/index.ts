import { User as SupabaseAuthUser } from '@supabase/supabase-js';

// Tipos centralizados para melhor organização
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  created_at: string;
}

export interface CartItem {
  id: number; // Local cart ID
  product: Product;
  size: string;
  quantity: number;
}

export interface UserProfile {
  id: string;
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