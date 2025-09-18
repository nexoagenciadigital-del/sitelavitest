import { useState, useEffect, useCallback } from 'react';
import { Product, CartItem } from '../types';

interface UseCartResult {
  items: CartItem[];
  addToCart: (product: Product, size: string, quantity: number) => void;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  removeItem: (itemId: number) => void;
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
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
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
        const newItem: CartItem = {
          id: Date.now() + Math.random(), // Simple ID generation
          product,
          size,
          quantity
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  const updateQuantity = useCallback((itemId: number, newQuantity: number) => {
    setItems(prevItems => {
      return prevItems
        .map(item =>
          item.id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
        .filter(item => item.quantity > 0);
    });
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setItems(prevItems =>
      prevItems.filter(item => item.id !== itemId)
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