import React from 'react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, loading } = useCart();

  // Calculate total cart price
  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + (item.qty_50g > 0 ? item.qty_50g * item.price_50g : 0) + (item.qty_100g > 0 ? item.qty_100g * item.price_100g : 0),
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[350px] bg-white dark:bg-gray-900 shadow-lg z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button onClick={onClose} className="text-lg font-bold">&times;</button>
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
                  <div className="flex justify-between mt-2">
                    <span>50g x {item.qty_50g}</span>
                    <span>
                      ₹{item.price_50g} each | ₹{item.qty_50g * item.price_50g}
                    </span>
                  </div>
                )}
                {item.qty_100g > 0 && (
                  <div className="flex justify-between mt-2">
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