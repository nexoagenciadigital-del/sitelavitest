import React from 'react';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-3xl font-light"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ação Necessária</h2>
        <p className="text-gray-700 mb-6">
          Você precisa estar logado para adicionar itens ao carrinho ou finalizar a compra.
        </p>
        <div className="space-y-4">
          <button
            onClick={onLogin}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out font-bold text-lg shadow-md"
          >
            Fazer Login
          </button>
          <button
            onClick={onRegister}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out font-semibold text-lg shadow-md"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
