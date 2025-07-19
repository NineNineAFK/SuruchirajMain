import React, { useEffect } from 'react';
import { FiX, FiClock, FiTrash2 } from 'react-icons/fi';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useRecoilValue } from 'recoil';
import { authStateAtom } from '../state/state';
import { useLoginModal } from '../context/LoginModalContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, loading } = useCart();
  const authState = useRecoilValue(authStateAtom);
  const { openModal } = useLoginModal();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleAddToCart = async (productName: string) => {
    const item = cart.find(cartItem => cartItem.productName === productName);
    if (item) {
      await updateQuantity(productName, item.quantity + 1);
    }
  };

  const handleRemoveFromCart = async (productName: string) => {
    const item = cart.find(cartItem => cartItem.productName === productName);
    if (item && item.quantity > 1) {
      await updateQuantity(productName, item.quantity - 1);
    } else {
      await removeFromCart(productName);
    }
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
          cart.map((item) => (
            <div key={item.productName} className="flex justify-between items-center bg-gray-100 dark:bg-[#1a1a1a] rounded-lg p-3">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="flex-1 ml-4">
                <h3 className="dark:text-white text-black font-semibold">{item.productName}</h3>
                <p className="text-gray-400 font-sans text-sm">50 g</p>
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    onClick={() => handleRemoveFromCart(item.productName)}
                    className="px-2 py-1 rounded bg-white dark:bg-black border border-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="dark:text-white text-black">{item.quantity}</span>
                  <button
                    onClick={() => handleAddToCart(item.productName)}
                    className="px-2 py-1 rounded bg-white dark:bg-black border border-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="dark:text-white text-black text-lg font-sans font-bold">₹{item.price}</p>
                <button
                  onClick={() => removeFromCart(item.productName)}
                  className="text-red-500 hover:text-red-600 mt-1"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
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
