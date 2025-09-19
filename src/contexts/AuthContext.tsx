import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, SiteSettings } from '../types';

// Mock data para demonstração
const mockSiteSettings: SiteSettings = {
  id: '1',
  company_name: 'LaviBaby',
  phone: '(11) 99999-9999',
  email: 'contato@lavibaby.com.br',
  address: 'São Paulo, SP - Brasil',
  instagram: '@lavibaby',
  facebook: 'LaviBaby',
  twitter: '@lavibaby',
  whatsapp: '5511999999999',
  working_hours: 'Seg-Sex: 8h às 18h',
  hero_title: 'Roupas que fazem os pequenos brilharem',
  hero_subtitle: 'Descubra nossa coleção exclusiva de roupas infantis. Conforto, estilo e qualidade para os momentos especiais dos seus pequenos.',
  about_title: 'Por que escolher a LaviBaby?',
  about_description: 'Somos uma loja especializada em roupas infantis que combina estilo, conforto e qualidade. Nossa missão é fazer com que cada criança se sinta especial e confiante.',
  free_shipping_min_value: 150,
  discount_percentage: 20,
  logo_url: '',
  button_links: {
    verColecao: '#categorias',
    ofertas: '#produtos',
    verOfertas: '#produtos',
    comprarAgora: '#produtos',
    queroDesconto: '#newsletter',
    falarWhatsApp: 'https://wa.me/5511999999999',
    verTodosProdutos: '#produtos',
    baixarApp: '#',
    criarConta: '#'
  }
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error: string | null }>;
  isAdmin: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  siteSettings: SiteSettings | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(mockSiteSettings);

  useEffect(() => {
    // Simular carregamento inicial
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simular login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@lavibaby.com' && password === 'admin123') {
      setUser({
        id: '1',
        email: 'admin@lavibaby.com',
        user_profile: {
          id: '1',
          name: 'Administrador',
          role: 'admin',
          created_at: new Date().toISOString()
        }
      } as User);
      setIsLoading(false);
      return { success: true, error: null };
    } else if (email && password) {
      setUser({
        id: '2',
        email: email,
        user_profile: {
          id: '2',
          name: 'Usuário',
          role: 'user',
          created_at: new Date().toISOString()
        }
      } as User);
      setIsLoading(false);
      return { success: true, error: null };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Credenciais inválidas' };
  };

  const logout = async () => {
    setIsLoading(true);
    setUser(null);
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simular registro
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: '3',
      email: email,
      user_profile: {
        id: '3',
        name: name,
        role: 'user',
        created_at: new Date().toISOString()
      }
    } as User);
    
    setIsLoading(false);
    return { success: true, error: null };
  };

  const isAdmin = user?.user_profile?.role === 'admin';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAdmin,
      isLoggedIn,
      isLoading,
      siteSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};