import { supabase } from '../lib/supabaseClient';
import { Product, Category } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao buscar produtos');
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      throw new Error('Falha ao buscar categorias');
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    throw error;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    return null;
  }
};

export const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      throw new Error('Falha ao buscar produtos por categoria');
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchProductsByCategory:', error);
    throw error;
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar produto:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createProduct:', error);
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return false;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar produto:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return false;
  }
};