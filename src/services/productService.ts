import { Product, Category } from '../types';

// Mock data para demonstração
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Roupas de Bebê',
    slug: 'roupas-de-bebe',
    image_url: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Brinquedos',
    slug: 'brinquedos',
    image_url: 'https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Acessórios',
    slug: 'acessorios',
    image_url: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Calçados',
    slug: 'calcados',
    image_url: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: new Date().toISOString()
  }
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Body de Algodão Orgânico',
    slug: 'body-algodao-organico',
    description: 'Body macio e confortável para bebês, feito de algodão orgânico.',
    price: 49.90,
    image_urls: ['https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400'],
    category_id: '1',
    stock: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Chocalho de Madeira',
    slug: 'chocalho-madeira',
    description: 'Chocalho ecológico de madeira, seguro para o bebê.',
    price: 29.50,
    image_urls: ['https://images.pexels.com/photos/207891/pexels-photo-207891.jpeg?auto=compress&cs=tinysrgb&w=400'],
    category_id: '2',
    stock: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Vestido Floral Verão',
    slug: 'vestido-floral-verao',
    description: 'Vestido leve e fresco com estampa floral, perfeito para os dias quentes.',
    price: 89.90,
    image_urls: ['https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400'],
    category_id: '1',
    stock: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Sapatinho de Tricô',
    slug: 'sapatinho-trico',
    description: 'Sapatinho de tricô feito à mão, super quentinho e delicado.',
    price: 49.90,
    image_urls: ['https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400'],
    category_id: '4',
    stock: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Kit Faixas de Cabelo',
    slug: 'kit-faixas-cabelo',
    description: 'Kit com 3 faixas de cabelo em cores variadas.',
    price: 34.90,
    image_urls: ['https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400'],
    category_id: '3',
    stock: 60,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Macacão Divertido',
    slug: 'macacao-divertido',
    description: 'Macacão colorido e divertido para o dia a dia.',
    price: 79.90,
    image_urls: ['https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400'],
    category_id: '1',
    stock: 40,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const fetchProducts = async (): Promise<Product[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts;
};

export const fetchCategories = async (): Promise<Category[]> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCategories;
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts.find(product => product.id === id) || null;
};

export const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts.filter(product => product.category_id === categoryId);
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  mockProducts.push(newProduct);
  return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockProducts.findIndex(product => product.id === id);
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...updates, updated_at: new Date().toISOString() };
    return true;
  }
  return false;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockProducts.findIndex(product => product.id === id);
  if (index !== -1) {
    mockProducts.splice(index, 1);
    return true;
  }
  return false;
};