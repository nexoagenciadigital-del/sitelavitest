import { useState, useEffect } from 'react';
import { Product } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Vestido Princesa Rosa",
    price: 89.90,
    originalPrice: 129.90,
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 5,
    badge: "Mais Vendido",
    badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Lindo vestido rosa perfeito para ocasiões especiais. Feito com tecido macio e confortável.",
    sizes: ["2", "4", "6", "8", "10"],
    colors: ["Rosa", "Lilás"],
    category: "meninas",
    inStock: true
  },
  {
    id: 2,
    name: "Conjunto Aventureiro",
    price: 69.90,
    originalPrice: 99.90,
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4,
    badge: "Oferta",
    badgeColor: "bg-gradient-to-r from-pink-500 to-blue-500",
    description: "Conjunto aventureiro ideal para brincadeiras ao ar livre. Resistente e estiloso.",
    sizes: ["2", "4", "6", "8"],
    colors: ["Azul", "Verde"],
    category: "meninos",
    inStock: true
  },
  {
    id: 3,
    name: "Body Bebê Unicórnio",
    price: 39.90,
    originalPrice: 59.90,
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 5,
    badge: "Novo",
    badgeColor: "bg-gradient-to-r from-blue-500 to-purple-500",
    description: "Body fofo com estampa de unicórnio. 100% algodão, ideal para bebês.",
    sizes: ["RN", "P", "M", "G"],
    colors: ["Branco", "Rosa Claro"],
    category: "bebes",
    inStock: false
  },
  {
    id: 4,
    name: "Macacão Colorido",
    price: 79.90,
    originalPrice: 119.90,
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4,
    badge: "Promoção",
    badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Macacão colorido e divertido. Perfeito para o dia a dia dos pequenos.",
    sizes: ["1", "2", "3", "4"],
    colors: ["Colorido", "Arco-íris"],
    category: "meninas",
    inStock: true
  },
  {
    id: 5,
    name: "Camiseta Super Herói",
    price: 49.90,
    originalPrice: 69.90,
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 5,
    badge: "Novo",
    badgeColor: "bg-gradient-to-r from-blue-500 to-green-500",
    description: "Camiseta de super herói para os pequenos aventureiros.",
    sizes: ["2", "4", "6", "8", "10"],
    colors: ["Azul", "Vermelho"],
    category: "meninos",
    inStock: true
  },
  {
    id: 6,
    name: "Tiara Princesa",
    price: 29.90,
    originalPrice: 39.90,
    image: "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4,
    badge: "Acessório",
    badgeColor: "bg-gradient-to-r from-pink-500 to-purple-500",
    description: "Linda tiara para completar o look de princesa.",
    sizes: ["Único"],
    colors: ["Rosa", "Dourado"],
    category: "acessorios",
    inStock: true
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Carregar produtos do localStorage ou usar produtos iniciais
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('products', JSON.stringify(newProducts));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    return newProduct;
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, ...updatedProduct } : product
    );
    saveProducts(updatedProducts);
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    saveProducts(updatedProducts);
  };

  const getProductById = (id: number) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    saveProducts
  };
};
