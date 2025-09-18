import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  selectedCategory: string | null;
  getCategoryName: (categoryId: string) => string;
  onProductClick: (product: Product) => void; // New prop for opening modal
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onAddToCart,
  selectedCategory,
  getCategoryName,
  onProductClick,
}) => {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
          {selectedCategory ? selectedCategory : 'Produtos em Destaque'}
        </h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">Nenhum produto encontrado nesta categoria.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                onClick={() => onProductClick(product)} // Open modal on product click
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={product.image_urls[0] || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  {hoveredProductId === product.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent modal from opening when clicking add to cart
                          onAddToCart(product, 'Único', 1); // Default size 'Único', quantity 1
                        }}
                        className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                      >
                        <ShoppingCart size={24} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {getCategoryName(product.category_id)}
                  </p>
                  <p className="text-indigo-600 text-3xl font-bold">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
