import React, { useEffect } from 'react';
import { FiX, FiClock, FiTrash2 } from 'react-icons/fi';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useRecoilValue } from 'recoil';
import { authStateAtom } from '../state/state';
import { useLoginModal } from '../context/LoginModalContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, addToCart, loading, updateQuantity } = useCart();
  const authState = useRecoilValue(authStateAtom);
  const { openModal } = useLoginModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [productStocks, setProductStocks] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    // Fetch stock for all products in cart
    const fetchStocks = async () => {
      const stocks: Record<string, number> = {};
      for (const item of cart) {
        try {
          const product = await getProductById(item.productId);
          stocks[item.productId] = product.stock;
        } catch {
          stocks[item.productId] = 0;
        }
      }
      setProductStocks(stocks);
    };
    if (cart.length > 0) fetchStocks();
  }, [cart]);

  useEffect(() => {
    if (location.pathname === '/checkout') {
      onClose();
    }
  }, [location.pathname]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!authState) {
      openModal();
    } else {
      navigate('/checkout');
    }
  };

  // Increment/decrement 50g or 100g packets
  const handleChangePacket = async (item: any, type: 'qty_50g' | 'qty_100g', delta: number) => {
    const newQty50g = type === 'qty_50g' ? item.qty_50g + delta : item.qty_50g;
    const newQty100g = type === 'qty_100g' ? item.qty_100g + delta : item.qty_100g;
    const newTotalGrams = (newQty50g * 50) + (newQty100g * 100);
    const stock = productStocks[item.productId] || 0;
    if (newQty50g < 0 || newQty100g < 0) return;
    if (newTotalGrams > stock) return;
    // If both are zero, remove from cart
    if (newQty50g === 0 && newQty100g === 0) {
      await removeFromCart(item.productId);
      return;
    }
    await updateQuantity(item.productId, newQty50g, newQty100g);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-east-side-100 text-black dark:bg-black dark:text-white z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center font-body justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
        <h2 className="text-2xl font-semibold">
          <span className="dark:text-white text-black">Your</span> <span className="text-east-side-900 dark:text-yellow-400">Cart</span>
        </h2>
        <button onClick={onClose}>
          <FiX className="dark:text-white text-black text-2xl hover:text-yellow-400" />
        </button>
      </div>

      {/* Free Delivery Banner */}
      <div className="flex items-center gap-2 text-sm font-body bg-yellow-100 dark:bg-black/10 border border-yellow-400 rounded-2xl px-3 py-2 mt-4">
        <span className="text-yellow-400 text-lg">✅</span>
        <span>
        <span className="text-green-400 font-semibold">Free Delivery Unlocked</span>, apply coupon to avail
        </span>
      </div>

      {/* Delivery Info */}
      <div className="flex items-center gap-2 px-4 py-3 text-sm font-body text-black dark:text-white border-b border-black/10 dark:border-white/10">
        <FiClock className="text-yellow-400" />
        <span>Delivery in 3 - 5 days</span>
      </div>

      {/* Cart Items Scrollable Section */}
      <div className="flex-1 font-body overflow-y-auto px-4 py-4 space-y-4">
        {loading && (
          <div className="text-center text-gray-400">Loading cart...</div>
        )}

        {!loading && cart.length === 0 ? (
          <div className="text-center text-gray-500">
            {authState ? 'Your cart is empty' : 'Please login to view your cart'}
          </div>
        ) : (
          cart.map((item) => {
            const stock = productStocks[item.productId] || 0;
            const price50g = item.price; // Assuming price is for 50g, adjust if needed
            const price100g = item.price * 2; // Assuming 100g is double, adjust if needed
            const disable50gPlus = ((item.qty_50g + 1) * 50 + item.qty_100g * 100) > stock;
            const disable100gPlus = (item.qty_50g * 50 + (item.qty_100g + 1) * 100) > stock;
            return (
              <div key={item.productId} className="flex flex-col bg-gray-100 dark:bg-[#1a1a1a] rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="dark:text-white text-black font-semibold">{item.productName}</h3>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-600 ml-2"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                {/* 50g Block */}
                <div className="flex items-center justify-between mt-2 p-2 bg-white dark:bg-black rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-body font-semibold">50g</span>
                    <button onClick={() => handleChangePacket(item, 'qty_50g', -1)} disabled={item.qty_50g <= 0 || loading} className="px-2">-</button>
                    <span>{item.qty_50g || 0}</span>
                    <button onClick={() => handleChangePacket(item, 'qty_50g', 1)} disabled={disable50gPlus || loading} className="px-2">+</button>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">₹{price50g} each</span>
                    <span className="font-semibold">₹{item.qty_50g * price50g}</span>
                  </div>
                </div>
                {/* 100g Block */}
                <div className="flex items-center justify-between mt-2 p-2 bg-white dark:bg-black rounded">
                  <div className="flex items-center gap-2">
                    <span className="font-body font-semibold">100g</span>
                    <button onClick={() => handleChangePacket(item, 'qty_100g', -1)} disabled={item.qty_100g <= 0 || loading} className="px-2">-</button>
                    <span>{item.qty_100g || 0}</span>
                    <button onClick={() => handleChangePacket(item, 'qty_100g', 1)} disabled={disable100gPlus || loading} className="px-2">+</button>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">₹{price100g} each</span>
                    <span className="font-semibold">₹{item.qty_100g * price100g}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Total: {item.totalGrams}g / {stock}g available</div>
              </div>
            );
          })
        )}
      </div>

      {/* Checkout Footer – STAYS FIXED */}
      <div className="px-4 py-3 bg-gray-100 dark:bg-[#111] font-body border-t border-black/10 dark:border-white/10">
        <div className="flex justify-between">
          <span className="text-gray-800 dark:text-gray-300 font-semibold">To Pay</span>
          <span className="dark:text-yellow-400 text-black text-xl font-bold font-sans">₹{totalPrice}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-500 mb-4">Incl. all taxes and charges</p>
        <button
          onClick={handleCheckout}
          disabled={cart.length === 0 || loading}
          className={`w-full py-2 font-button rounded-2xl font-medium transition ${
            cart.length === 0 || loading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:bg-yellow-300'
          }`}
        >
          {loading ? 'Loading...' : authState ? 'Checkout' : 'Login to Checkout'}
        </button>
      </div>
    </div>
  );
};

export default CartDrawer;
