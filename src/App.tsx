import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useCart } from './hooks/useCart';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import UserLogin from './components/UserLogin';
import UserRegistration from './components/UserRegistration';
import LoginPrompt from './components/LoginPrompt';
import { fetchProducts, fetchCategories } from './services/productService';
import { Product, Category } from './types';


const AppContent = () => {
  const { user, isAdmin, logout, siteSettings, isLoading: authLoading } = useAuth();
  const cart = useCart();
  const [currentView, setCurrentView] = useState<'home' | 'checkout' | 'success'>('home');
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [showUserRegistration, setShowUserRegistration] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);

  // State for ProductModal
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoadingProducts(true);
      try {
        const [productData, categoryData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productData);
        setCategories(categoryData);
      } catch (err) {
        setErrorProducts('Falha ao carregar dados. Por favor, tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadData();
  }, []);

  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    cart.addToCart(product, size, quantity);
  };

  const handleCheckout = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    cart.closeCart();
    setCurrentView('checkout');
  };

  const handleOrderComplete = () => {
    cart.clearCart();
    setCurrentView('success');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Carregando...</p>
      </div>
    );
  }

  if (isAdmin) {
    return <AdminDashboard onLogout={logout} siteSettings={siteSettings} />;
  }

  if (currentView === 'checkout') {
    return (
      <Checkout
        items={cart.items}
        onBack={() => setCurrentView('home')}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  if (currentView === 'success') {
    return <OrderSuccess onBackToHome={handleBackToHome} />;
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Todos';
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => getCategoryName(product.category_id) === selectedCategory)
    : products;

  return (
    <>
      <Navbar
        cartItemCount={cart.getTotalItems()}
        onCartClick={cart.openCart}
        siteSettings={siteSettings}
      />
      <Hero siteSettings={siteSettings} />
      <Categories categories={categories} onCategorySelect={setSelectedCategory} />
      {loadingProducts ? (
        <p className="text-center py-10">Carregando produtos...</p>
      ) : errorProducts ? (
        <p className="text-center py-10 text-red-500">{errorProducts}</p>
      ) : (
        <FeaturedProducts
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          selectedCategory={selectedCategory}
          getCategoryName={getCategoryName}
          onProductClick={handleProductClick}
        />
      )}
      <About siteSettings={siteSettings} />
      <Testimonials />
      <Newsletter siteSettings={siteSettings} />
      <Footer siteSettings={siteSettings} />

      <Cart
        isOpen={cart.isOpen}
        onClose={cart.closeCart}
        items={cart.items}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onCheckout={handleCheckout}
      />

      {showProductModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowProductModal(false)}
          onAddToCart={handleAddToCart}
        />
      )}

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

      {showLoginPrompt && (
        <LoginPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          onLogin={() => {
            setShowLoginPrompt(false);
            setShowUserLogin(true);
          }}
          onRegister={() => {
            setShowLoginPrompt(false);
            setShowUserRegistration(true);
          }}
        />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
