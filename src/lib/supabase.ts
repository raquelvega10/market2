import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  name: string;
  description: string | null;
}

export interface SubCategory {
  id: string;
  name: string;
  category_name: string | null;
  description: string | null;
}

export interface Product {
  id: string;
  category_name: string | null;
  sub_category_name: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockProducto {
  product_name: string;
  stock_actual: number;
}

export interface Order {
  id: string;
  cliente_fullname: string;
  cliente_pais: string | null;
  cliente_email: string | null;
  cliente_contacto: string | null;
  receptor_fullname: string;
  receptor_ci: string | null;
  receptor_contacto: string | null;
  receptor_direccion: string | null;
  receptor_adicionales: string | null;
  payment_method: string | null;
  order_date: string;
  status: 'pendiente' | 'confirmada' | 'enviada' | 'cancelada' | 'completada';
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string | null;
  product_name: string | null;
  quantity: number;
  price: number;
  subtotal: number | null;
  created_at: string;
}

export interface Sale {
  id: string;
  order_id: string | null;
  cliente_fullname: string;
  sale_date: string;
  total: number;
  payment_method: 'efectivo' | 'tarjeta' | 'transferencia' | 'paypal';
  created_at: string;
}

export interface SiteSettings {
  id: number;
  nombre: string;
  valor: string;
}

export interface SocialMedia {
  id: number;
  nombre: string;
  link: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order_position: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}
