import React, { useEffect } from 'react';
import { FiX, FiClock, FiTrash } from 'react-icons/fi';
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

  // Calculate total cart price
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + (item.qty_50g > 0 ? item.qty_50g * item.price_50g : 0) + (item.qty_100g > 0 ? item.qty_100g * item.price_100g : 0),
    0
  );

  const handleCheckout = () => {
    if (!authState) {
      openModal();
    } else {
      navigate('/checkout');
    }
  };

  // const handleAddToCart = async (productName: string) => {
  //   const item = cart.find(cartItem => cartItem.productName === productName);
  //   if (item) {
  //     await updateQuantity(productName, item.qty_50g + 1, item.qty_100g + 1);
  //   }
  // };

  // const handleRemoveFromCart = async (productName: string) => {
  //   const item = cart.find(cartItem => cartItem.productName === productName);
  //   if (item && item.quantity > 1) {
  //     await updateQuantity(productName, item.qty_50g - 1, item.qty_100g - 1);
  //   } else {
  //     await removeFromCart(productName);
  //   }
  // };

  

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
      <div className="flex items-center gap-2 px-4 py-3 text-sm font-sans text-black dark:text-white border-b border-black/10 dark:border-white/10">
        <FiClock className="text-yellow-400" />
        <span>Delivery in 3 - 5 days</span>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-120px)]">
        {loading ? (
          <div className="text-center text-yellow-400">Loading...</div>
        ) : cart.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">Your cart is empty.</div>


        ) : (
          cart.map((item) => {
          //  const subtotal =
          //    (item.qty_50g > 0 ? item.qty_50g * item.price_50g : 0) +
          //    (item.qty_100g > 0 ? item.qty_100g * item.price_100g : 0);
          // Use item._id if available, fallback to productId
            const key = item._id || item.productId;
            return (
              <div key={key} className="mb-6 pb-4 border-b border-gray-300 dark:border-white/10">
                <div className="flex items-start gap-4">
                {/* Product Image */}
                <img
                  src={item.productImage || '/testing/Batata Wada Masala Lifestyle Shot.webp'}
                  alt={item.productName}
                  className="w-20 h-20 md:w-24 md:h-24 rounded object-cover"
                />

                {/* Product Details */}
                <div className="flex-1">
                  <div className="font-semibold text-lg text-black dark:text-white">
                    {item.productName}
                  </div>

                  {item.qty_50g > 0 && (
                    <div className="flex justify-between items-center text-sm mt-2 text-gray-700 dark:text-gray-300">
                      <span>50g x {item.qty_50g}</span>
                      <div className="flex items-center gap-2">
                        <span>₹{item.qty_50g * item.price_50g}</span>
                        <button
                          onClick={async () => {
                            const id = item.product || item._id || item.productId;
                            if (id) {
                              try {
                                await updateQuantity(id.toString(), 0, item.qty_100g);
                              } catch (error) {
                                console.error('Failed to remove 50g item:', error);
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {item.qty_100g > 0 && (
                    <div className="flex justify-between items-center text-sm mt-2 text-gray-700 dark:text-gray-300">
                      <span>100g x {item.qty_100g}</span>
                      <div className="flex items-center gap-2">
                        <span>₹{item.qty_100g * item.price_100g}</span>
                        <button
                          onClick={async () => {
                            const id = item.product || item._id || item.productId;
                            if (id) {
                              try {
                                await updateQuantity(id.toString(), item.qty_50g, 0);
                              } catch (error) {
                                console.error('Failed to remove 100g item:', error);
                              }
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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