import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: number, newQuantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full md:w-1/3 h-full shadow-lg flex flex-col relative">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800">Seu Carrinho</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={28} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-600 text-lg mt-10">Seu carrinho está vazio.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center border-b border-gray-100 pb-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Tamanho: {item.size || 'N/A'}</p>
                  <p className="text-indigo-600 font-bold">R${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300 disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 text-gray-700 p-1 rounded-full hover:bg-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold text-gray-800">Subtotal:</span>
            <span className="text-2xl font-bold text-indigo-600">R${subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md text-lg font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
