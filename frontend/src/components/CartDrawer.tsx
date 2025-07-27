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
            const subtotal =
              (item.qty_50g > 0 ? item.qty_50g * item.price_50g : 0) +
              (item.qty_100g > 0 ? item.qty_100g * item.price_100g : 0);
          // Use item._id if available, fallback to productId
            const key = item._id || item.productId;
            return (
              <div key={key} className="mb-6 border-b pb-4">
                <div className="font-semibold text-lg">{item.productName}</div>
                {item.qty_50g > 0 && (
                  <div className="flex text-sm justify-between mt-2">
                    <span>50g x {item.qty_50g}</span>
                    <span>
                      ₹{item.price_50g} each | ₹{item.qty_50g * item.price_50g}
                    </span>
                  </div>
                )}
                {item.qty_100g > 0 && (
                  <div className="flex text-sm justify-between mt-2">
                    <span>100g x {item.qty_100g}</span>
                    <span>
                      ₹{item.price_100g} each | ₹{item.qty_100g * item.price_100g}
                    </span>
                  </div>
                )}
                <div className="flex justify-between mt-2 font-bold">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <button
                  className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={async () => {
                    // First try the product reference, then fallback to _id or productId
                    const id = item.product || item._id || item.productId;
                    if (id) {
                      try {
                        await removeFromCart(id.toString());
                      } catch (error) {
                        console.error('Failed to remove item:', error);
                      }
                    } else {
                      console.error('No product ID found for item:', item);
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>
      <div className="p-4 border-t flex justify-between items-center font-bold text-lg">
        <span>Total:</span>
        <span>₹{totalPrice}</span>
      </div>
    </div>
  );
};

export default CartDrawer;