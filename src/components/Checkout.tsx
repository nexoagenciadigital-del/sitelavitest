import React, { useState } from 'react';
import { CartItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onOrderComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onBack, onOrderComplete }) => {
  const { user } = useAuth();
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Brasil',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Você precisa estar logado para finalizar a compra.');
      return;
    }
    if (items.length === 0) {
      setError('Seu carrinho está vazio.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'completed', // Or 'pending' if you have a payment gateway
          shipping_address: shippingAddress,
        })
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || 'Falha ao criar o pedido.');
      }

      // 2. Create order items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
        size: item.size,
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) {
        throw new Error(orderItemsError.message || 'Falha ao adicionar itens ao pedido.');
      }

      onOrderComplete(); // Notify App.tsx that order is complete
    } catch (err: any) {
      console.error('Erro ao finalizar pedido:', err);
      setError(err.message || 'Ocorreu um erro ao finalizar seu pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Finalizar Compra</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu Pedido</h2>
          {items.length === 0 ? (
            <p className="text-gray-600">Seu carrinho está vazio.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <li key={`${item.product.id}-${item.size}-${index}`} className="py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={item.product.image_urls[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Tamanho: {item.size}</p>
                      <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total:</span>
            <span className="text-2xl font-extrabold text-indigo-600">R$ {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Endereço de Entrega</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Rua</label>
              <input
                type="text"
                id="street"
                name="street"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
              <input
                type="text"
                id="state"
                name="state"
                value={shippingAddress.state}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">CEP</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={shippingAddress.zip}
                onChange={handleAddressChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Método de Pagamento</h2>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={paymentMethod === 'credit_card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Cartão de Crédito</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="paymentMethod"
                value="pix"
                checked={paymentMethod === 'pix'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2 text-gray-700">PIX</span>
            </label>
          </div>
          {/* Add more payment details fields here if needed */}

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out font-semibold"
            >
              Voltar ao Carrinho
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out font-bold text-lg"
              disabled={loading || items.length === 0}
            >
              {loading ? 'Finalizando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
