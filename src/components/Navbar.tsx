import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import UserLogin from './UserLogin';
import UserRegistration from './UserRegistration';
import { SiteSettings } from '../types';

interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
  siteSettings: SiteSettings | null;
}

const Navbar: React.FC<NavbarProps> = ({ cartItemCount, onCartClick, siteSettings }) => {
  const { user, logout, isLoggedIn, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showUserRegistration, setShowUserRegistration] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const handleAdminLoginClick = () => {
    setShowAdminLogin(true);
    setIsMobileMenuOpen(false);
  };

  const handleUserLoginClick = () => {
    setShowUserLogin(true);
    setIsMobileMenuOpen(false);
  };

  const handleUserRegistrationClick = () => {
    setShowUserRegistration(true);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Início', href: '#hero' },
    { name: 'Categorias', href: '#categorias' },
    { name: 'Produtos', href: '#produtos' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Depoimentos', href: '#depoimentos' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
          {siteSettings?.logo_url && (
            <img src={siteSettings.logo_url} alt={siteSettings.company_name} className="h-10" />
          )}
          <span className="text-2xl font-bold text-indigo-600">{siteSettings?.company_name || 'LaviBaby'}</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-indigo-600 transition duration-300 font-medium"
            >
              {link.name}
            </a>
          ))}
          <div className="relative">
            <button onClick={onCartClick} className="relative text-gray-700 hover:text-indigo-600 transition duration-300">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
          <div className="relative group">
            <button className="text-gray-700 hover:text-indigo-600 transition duration-300 flex items-center space-x-1">
              <User size={24} />
              <span className="font-medium">{user?.user_profile?.name || (isLoggedIn ? 'Minha Conta' : 'Entrar')}</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 invisible z-50">
              {isLoggedIn ? (
                <>
                  <span className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    Olá, {user?.user_profile?.name || user?.email}!
                  </span>
                  {isAdmin && (
                    <a href="#admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard Admin
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleUserLoginClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleUserRegistrationClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cadastre-se
                  </button>
                  <button
                    onClick={handleAdminLoginClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login Admin
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={onCartClick} className="relative text-gray-700 hover:text-indigo-600">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <button onClick={toggleMobileMenu} className="text-gray-700 hover:text-indigo-600">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg pb-4">
          <div className="flex flex-col items-center space-y-4 py-4 border-b border-gray-200">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-indigo-600 transition duration-300 font-medium text-lg"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="flex flex-col items-center space-y-4 py-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-700 font-medium text-lg">Olá, {user?.user_profile?.name || user?.email}!</span>
                {isAdmin && (
                  <a href="#admin" onClick={toggleMobileMenu} className="text-gray-700 hover:text-indigo-600 transition duration-300 font-medium text-lg">
                    Dashboard Admin
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition duration-300 font-medium text-lg"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUserLoginClick}
                  className="text-gray-700 hover:text-indigo-600 transition duration-300 font-medium text-lg"
                >
                  Entrar
                </button>
                <button
                  onClick={handleUserRegistrationClick}
                  className="text-gray-700 hover:text-indigo-600 transition duration-300 font-medium text-lg"
                >
                  Cadastre-se
                </button>
                <button
                  onClick={handleAdminLoginClick}
                  className="text-gray-700 hover:text-indigo-600 transition duration-300 font-medium text-lg"
                >
                  Login Admin
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showAdminLogin && <AdminLogin onClose={() => setShowAdminLogin(false)} />}
      {showUserLogin && (
        <UserLogin
          onClose={() => setShowUserLogin(false)}
          onSwitchToRegister={() => {
            setShowUserLogin(false);
            setShowUserRegistration(true);
          }}
          onSuccess={() => setShowUserLogin(false)}
        />
      )}
      {showUserRegistration && (
        <UserRegistration
          onClose={() => setShowUserRegistration(false)}
          onSuccess={() => setShowUserRegistration(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
