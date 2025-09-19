import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SiteSettings, Product, Category } from '../types';
import { fetchProducts, fetchCategories } from '../services/productService';

interface AdminDashboardProps {
  onLogout: () => void;
  siteSettings: SiteSettings | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, siteSettings }) => {
  const { user, isLoading } = useAuth();
  const [editableSettings, setEditableSettings] = useState<Partial<SiteSettings>>({});
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'products' | 'orders'>('settings');

  useEffect(() => {
    if (siteSettings) {
      setEditableSettings(siteSettings);
    }
  }, [siteSettings]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleButtonLinkChange = (key: string, value: string) => {
    setEditableSettings(prev => ({
      ...prev,
      button_links: {
        ...(prev.button_links || {}),
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setMessage('');
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage('Configurações salvas com sucesso!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (!user || user.user_profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p>Você não tem permissão de administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Painel do Administrador</h1>
            <p className="text-lg text-gray-700">Bem-vindo, {user.user_profile?.name || user.email}!</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
          >
            Sair
          </button>
        </div>

        {message && (
          <div className={`p-4 mb-6 rounded-md text-center ${
            message.includes('sucesso') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Configurações
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'products'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pedidos
          </button>
        </div>

        {/* Configurações Tab */}
        {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configurações Básicas */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Configurações Básicas</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={editableSettings.company_name || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={editableSettings.phone || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editableSettings.email || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={editableSettings.address || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Redes Sociais</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={editableSettings.instagram || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="@lavibaby"
                />
              </div>

              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  value={editableSettings.facebook || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={editableSettings.whatsapp || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="5511999999999"
                />
              </div>

              <div>
                <label htmlFor="working_hours" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  id="working_hours"
                  name="working_hours"
                  value={editableSettings.working_hours || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Conteúdo do Site */}
          <div className="bg-gray-50 p-6 rounded-lg lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Conteúdo do Site</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="hero_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título Principal
                </label>
                <input
                  type="text"
                  id="hero_title"
                  name="hero_title"
                  value={editableSettings.hero_title || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="hero_subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Subtítulo
                </label>
                <textarea
                  id="hero_subtitle"
                  name="hero_subtitle"
                  value={editableSettings.hero_subtitle || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="about_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Título Sobre Nós
                </label>
                <input
                  type="text"
                  id="about_title"
                  name="about_title"
                  value={editableSettings.about_title || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="about_description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Sobre Nós
                </label>
                <textarea
                  id="about_description"
                  name="about_description"
                  value={editableSettings.about_description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Produtos Tab */}
        {activeTab === 'products' && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gerenciar Produtos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const category = categories.find(cat => cat.id === product.category_id);
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={product.image_urls[0] || 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400'}
                              alt={product.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400';
                              }}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          R$ {product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pedidos Tab */}
        {activeTab === 'orders' && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pedidos Recentes</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-center">Nenhum pedido encontrado.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
        <div className="text-center mt-8">
          <button
            onClick={handleSaveSettings}
            className="bg-indigo-600 text-white px-12 py-4 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;