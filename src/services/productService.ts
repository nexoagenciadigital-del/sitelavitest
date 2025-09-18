import { supabase } from '../lib/supabaseClient';
import { Product, Category } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    throw new Error('Falha ao buscar produtos');
  }

  return data as Product[];
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    throw new Error('Falha ao buscar categorias');
  }

  return data as Category[];
};
