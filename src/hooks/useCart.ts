import { useState, useEffect, useCallback } from 'react';
import { Product, CartItem } from '../types';

interface UseCartResult {
  items: CartItem[];
  addToCart: (product: Product, size: string, quantity: number) => void;
  updateQuantity: (productId: string, size: string, newQuantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CART_STORAGE_KEY = 'lavibaby_cart';

export const useCart = (): UseCartResult => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, size: string, quantity: number) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { product, size, quantity }];
      }
    });
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, newQuantity: number) => {
    setItems(prevItems => {
      return prevItems
        .map(item =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        )
        .filter(item => item.quantity > 0); // Remove if quantity becomes 0
    });
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems(prevItems =>
      prevItems.filter(item => !(item.product.id === productId && item.size === size))
    );
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [items]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return {
    items,
    addToCart,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalPrice,
    clearCart,
    isOpen,
    openCart,
    closeCart,
  };
};
