import React, { useState } from 'react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Único'); // Default size

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
    onClose(); // Close modal after adding to cart
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full flex flex-col md:flex-row relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-light"
        >
          &times;
        </button>

        <div className="md:w-1/2 p-4">
          <img
            src={product.image_urls[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg"
          />
          {product.image_urls.length > 1 && (
            <div className="flex space-x-2 mt-2 overflow-x-auto">
              {product.image_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md cursor-pointer border border-gray-200 hover:border-indigo-500"
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-indigo-600 text-3xl font-bold mb-4">
              R$ {product.price.toFixed(2)}
            </p>
            <p className="text-gray-700 text-base mb-6 leading-relaxed">{product.description}</p>

            <div className="mb-6">
              <label htmlFor="size-select" className="block text-gray-700 text-sm font-semibold mb-2">
                Tamanho:
              </label>
              <select
                id="size-select"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="Único">Único</option>
                <option value="P">P</option>
                <option value="M">M</option>
                <option value="G">G</option>
              </select>
            </div>

            <div className="flex items-center mb-6">
              <label htmlFor="quantity-input" className="block text-gray-700 text-sm font-semibold mr-4">
                Quantidade:
              </label>
              <input
                type="number"
                id="quantity-input"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-20 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out font-bold text-lg"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
