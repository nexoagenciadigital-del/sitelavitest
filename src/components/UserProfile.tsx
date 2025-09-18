import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, MapPin, Phone, Mail, Eye, EyeOff, X, Save, LogOut, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatPhone, formatCEP, validateEmail, validateCEP } from '../utils/formatters';
import { buscarCEP } from '../services/cepService';
import { ESTADOS_BRASIL } from '../utils/constants';

interface UserProfileProps {
  onClose: () => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose, onLogout }) => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    telefone: user?.telefone || '',
    email: user?.email || '',
    endereco: {
      cep: user?.endereco?.cep || '',
      endereco: user?.endereco?.endereco || '',
      numero: user?.endereco?.numero || '',
      complemento: user?.endereco?.complemento || '',
      bairro: user?.endereco?.bairro || '',
      cidade: user?.endereco?.cidade || '',
      estado: user?.endereco?.estado || ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'telefone') {
      formattedValue = formatPhone(value);
    } else if (field === 'endereco.cep') {
      formattedValue = formatCEP(value);
    }
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: formattedValue
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    }
  };

  const handleCEPChange = async (cep: string) => {
    handleInputChange('endereco.cep', cep);
    
    if (validateCEP(cep)) {
      const cepData = await buscarCEP(cep);
      if (cepData) {
        setFormData(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            endereco: cepData.logradouro,
            bairro: cepData.bairro,
            cidade: cepData.localidade,
            estado: cepData.uf
          }
        }));
      }
    }
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUserProfile({
        ...user!,
        name: formData.name,
        telefone: formData.telefone,
        email: formData.email,
        endereco: formData.endereco
      });
      
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (err) {
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Todos os campos de senha são obrigatórios');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Nova senha e confirmação não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Senha alterada com sucesso!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Erro ao alterar senha. Verifique a senha atual.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-cyan-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Minha Conta</h2>
              <p className="text-white/90">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 px-6 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                : 'text-gray-600 hover:text-pink-600'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-4 px-6 font-medium transition-colors ${
              activeTab === 'password'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                : 'text-gray-600 hover:text-pink-600'
            }`}
          >
            Senha
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Informações Pessoais</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 text-pink-600 hover:text-pink-700"
                >
                  <Edit size={16} />
                  <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Telefone</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                    maxLength={15}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Endereço de Entrega</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">CEP</label>
                    <input
                      type="text"
                      value={formData.endereco.cep}
                      onChange={(e) => handleCEPChange(e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                      maxLength={9}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Endereço</label>
                    <input
                      type="text"
                      value={formData.endereco.endereco}
                      onChange={(e) => handleInputChange('endereco.endereco', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Número</label>
                    <input
                      type="text"
                      value={formData.endereco.numero}
                      onChange={(e) => handleInputChange('endereco.numero', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Complemento</label>
                    <input
                      type="text"
                      value={formData.endereco.complemento}
                      onChange={(e) => handleInputChange('endereco.complemento', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Bairro</label>
                    <input
                      type="text"
                      value={formData.endereco.bairro}
                      onChange={(e) => handleInputChange('endereco.bairro', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Cidade</label>
                    <input
                      type="text"
                      value={formData.endereco.cidade}
                      onChange={(e) => handleInputChange('endereco.cidade', e.target.value)}
                      disabled={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </div>
                  ) : (
                    <>
                      <Save size={20} className="inline mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Alterar Senha</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Senha Atual</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nova Senha</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                    placeholder="Confirme a nova senha"
                  />
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Alterando...</span>
                  </div>
                ) : (
                  <>
                    <Lock size={20} className="inline mr-2" />
                    Alterar Senha
                  </>
                )}
              </button>
            </div>
          )}

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl"
            >
              {success}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair da Conta</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
