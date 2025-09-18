import React from 'react';
import { CheckCircle } from 'lucide-react';

interface OrderSuccessProps {
  onBackToHome: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
        <CheckCircle className="text-green-500 w-24 h-24 mx-auto mb-6 animate-bounce" />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">Pedido Realizado!</h1>
        <p className="text-lg text-gray-700 mb-8">
          Obrigado pela sua compra na Lavibaby. Seu pedido foi processado com sucesso e está a caminho!
        </p>
        <button
          onClick={onBackToHome}
          className="w-full bg-indigo-600 text-white py-4 px-8 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out font-bold text-xl shadow-lg"
        >
          Continuar Comprando
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
