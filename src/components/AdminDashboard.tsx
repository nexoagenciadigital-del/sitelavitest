import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SiteSettings } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
  siteSettings: SiteSettings | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, siteSettings }) => {
  const { user, updateSiteSettings, isLoading } = useAuth();
  const [editableSettings, setEditableSettings] = useState<Partial<SiteSettings>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (siteSettings) {
      setEditableSettings(siteSettings);
    }
  }, [siteSettings]);

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
    const success = await updateSiteSettings(editableSettings);
    if (success) {
      setMessage('Configurações salvas com sucesso!');
    } else {
      setMessage('Erro ao salvar configurações.');
    }
  };

  if (!user || user.user_profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700">
        Acesso negado. Você não tem permissão de administrador.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Painel do Administrador</h1>

        <div className="flex justify-between items-center mb-8">
          <p className="text-lg text-gray-700">Bem-vindo, {user.user_profile?.name || user.email}!</p>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
          >
            Sair
          </button>
        </div>

        {message && (
          <div className={`p-3 mb-4 rounded-md text-center ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Configurações do Site</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.keys(editableSettings).filter(key => typeof editableSettings[key as keyof SiteSettings] === 'string' || typeof editableSettings[key as keyof SiteSettings] === 'number').map(key => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type={typeof editableSettings[key as keyof SiteSettings] === 'number' ? 'number' : 'text'}
                id={key}
                name={key}
                value={String(editableSettings[key as keyof SiteSettings] || '')}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Links dos Botões</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {editableSettings.button_links && Object.keys(editableSettings.button_links).map(key => (
            <div key={key}>
              <label htmlFor={`button-link-${key}`} className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                id={`button-link-${key}`}
                name={`button_links.${key}`}
                value={editableSettings.button_links?.[key as keyof typeof editableSettings.button_links] || ''}
                onChange={(e) => handleButtonLinkChange(key, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleSaveSettings}
            className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>

        {/* Adicione outras seções de gerenciamento aqui, como produtos, pedidos, etc. */}
      </div>
    </div>
  );
};

export default AdminDashboard;
