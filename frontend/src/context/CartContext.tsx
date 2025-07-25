import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getCart, addToCart as addToCartAPI, updateQuantity as updateQuantityAPI, removeFromCart as removeFromCartAPI, clearCart as clearCartAPI, type CartItem } from '../services/cartService';
import { useRecoilValue } from 'recoil';
import { authStateAtom } from '../state/state';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { productId: string; qty_50g: number; qty_100g: number }) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, qty_50g: number, qty_100g: number) => Promise<void>;
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

  const addToCart = async (item: { productId: string; qty_50g: number; qty_100g: number }) => {
    if (!authState) {
      toast.error('Please login to add items to cart', {
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
      return;
    }
    try {
      setLoading(true);
      const cartData = await addToCartAPI(item.productId, item.qty_50g, item.qty_100g);
      setCart(cartData.items || []);
      toast.success('Item added to cart successfully',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error instanceof Error && error.message.includes('not authenticated')) {
        toast.error('Please login to add items to cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
        return;
      } else {
        toast.error('Failed to add item to cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!authState) {
      toast.error('Please login to manage your cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
      return;
    }
    try {
      setLoading(true);
      const cartData = await removeFromCartAPI(productId);
      setCart(cartData.items || []);
      toast.success('Item removed from cart', {
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, qty_50g: number, qty_100g: number) => {
    if (!authState) {
      toast.error('Please login to manage your cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
      return;
    }
    if (qty_50g <= 0 && qty_100g <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      setLoading(true);
      const cartData = await updateQuantityAPI(productId, qty_50g, qty_100g);
      setCart(cartData.items || []);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!authState) {
      toast.error('Please login to manage your cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
      return;
    }
    try {
      setLoading(true);
      await clearCartAPI();
      setCart([]);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
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
