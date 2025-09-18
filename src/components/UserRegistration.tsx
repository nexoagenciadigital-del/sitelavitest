import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserRegistrationProps {
  onClose: () => void;
  onSuccess: () => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onClose, onSuccess }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { success, error: registerError } = await register(email, password, name);
    setLoading(false);

    if (success) {
      onSuccess();
    } else {
      setError(registerError || 'Falha no registro. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-light"
        >
          &times;
        </button>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Cadastro</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out font-bold text-lg"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onClose}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Fazer Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserRegistration;
