// context/WishlistContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { userApi } from '../api/userApi';
import { useRecoilValue } from 'recoil';
import { authStateAtom } from '../state/state';
import toast from 'react-hot-toast';
import { useCart } from './CartContext';

type WishlistItem = {
  id: string;
  name: string;
  image: string;
  price: number;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  moveWishlistItemToCart: (productId: string) => void;
  isWishlisted: (id: string) => boolean;
  fetchWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const authState = useRecoilValue(authStateAtom);
  const { refreshCart } = useCart();

  // Fetch wishlist from backend on login
  useEffect(() => {
    if (authState) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [authState]);

  const fetchWishlist = async () => {
    try {
      const res = await userApi.getWishlist();
      if (res.success && Array.isArray(res.wishlist)) {
        setWishlist(res.wishlist.map((p: any) => ({
          id: String(p._id),
          name: p.product_name,
          image: p.images && p.images.length > 0 ? p.images[0] : '',
          price: p.mrp && p.mrp.length > 0 ? p.mrp[0] : 0
        })));
      }
    } catch (err) {
      setWishlist([]);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      const res = await userApi.addToWishlist(productId);
      if (res.success) {
        await fetchWishlist();
        toast.success('Added to wishlist',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
      }
    } catch (err) {
      toast.error('Failed to add to wishlist',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await userApi.removeFromWishlist(productId);
      if (res.success) {
        await fetchWishlist();
        toast.success('Removed from wishlist',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
      }
    } catch (err) {
      toast.error('Failed to remove from wishlist',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
    }
  };

  const moveWishlistItemToCart = async (productId: string) => {
    try {
      const res = await userApi.moveWishlistItemToCart(productId);
      if (res.success) {
        await fetchWishlist();
        await refreshCart();
        toast.success('Moved to cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
      }
    } catch (err) {
      toast.error('Failed to move to cart',{
        position: 'top-right',
        style: {
          marginTop: '60px',
        },
      });
    }
  };

  const isWishlisted = (id: string) => wishlist.some((i) => i.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, moveWishlistItemToCart, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
