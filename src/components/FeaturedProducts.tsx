import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  selectedCategory: string | null;
  getCategoryName: (categoryId: string) => string;
  onProductClick: (product: Product) => void;
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
    <section id="produtos" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
          {selectedCategory ? selectedCategory : 'Produtos em Destaque'}
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Nenhum produto encontrado nesta categoria.</p>
            <div className="animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-xl h-80"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                onClick={() => onProductClick(product)}
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={product.image_urls[0] || 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  {hoveredProductId === product.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product, 'Único', 1);
                        }}
                        className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                      >
                        <ShoppingCart size={24} />
                      </button>
                    </div>
                  )}
                  {product.stock <= 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      Esgotado
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {getCategoryName(product.category_id)}
                  </p>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-indigo-600 text-3xl font-bold">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Estoque: {product.stock}
                    </p>
                  </div>
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