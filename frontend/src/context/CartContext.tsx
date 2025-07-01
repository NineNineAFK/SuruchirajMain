import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getCart, addToCart as addToCartAPI, updateQuantity as updateQuantityAPI, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI, type CartItem } from '../services/cartService';
import { useRecoilValue } from 'recoil';
import { authStateAtom } from '../state/state';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { productId: string; quantity?: number }) => Promise<void>;
  removeFromCart: (productName: string) => Promise<void>;
  updateQuantity: (productName: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const authState = useRecoilValue(authStateAtom);

  // Load cart from backend when user is authenticated
  const loadCart = async () => {
    if (!authState) {
      setCart([]);
      return;
    }
    try {
      setLoading(true);
      const cartData = await getCart();
      setCart(cartData.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      if (error instanceof Error && error.message.includes('not authenticated')) {
        setCart([]);
      } else {
        toast.error('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh cart data
  const refreshCart = async () => {
    await loadCart();
  };

  useEffect(() => {
    loadCart();
  }, [authState]);

  const addToCart = async (item: { productId: string; quantity?: number }) => {
    if (!authState) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      setLoading(true);
      const cartData = await addToCartAPI(item.productId, item.quantity || 1);
      setCart(cartData.items || []);
      toast.success('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error instanceof Error && error.message.includes('not authenticated')) {
        toast.error('Please login to add items to cart');
        return;
      } else {
        toast.error('Failed to add item to cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productName: string) => {
    if (!authState) {
      toast.error('Please login to manage your cart');
      return;
    }
    try {
      setLoading(true);
      const cartData = await removeFromCartAPI(productName);
      setCart(cartData.items || []);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productName: string, quantity: number) => {
    if (!authState) {
      toast.error('Please login to manage your cart');
      return;
    }
    if (quantity <= 0) {
      await removeFromCart(productName);
      return;
    }
    try {
      setLoading(true);
      const cartData = await updateQuantityAPI(productName, quantity);
      setCart(cartData.items || []);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!authState) {
      toast.error('Please login to manage your cart');
      return;
    }
    try {
      setLoading(true);
      await clearCartAPI();
      setCart([]);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      loading, 
      refreshCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
