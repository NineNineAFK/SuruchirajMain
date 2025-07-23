const API_BASE_URL = import.meta.env.VITE_domainName;

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  qty_50g: number;
  qty_100g: number;
  totalGrams: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

// Add item to cart
export const addToCart = async (productId: string, qty_50g: number = 0, qty_100g: number = 0): Promise<Cart> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/add-to-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({
        productId,
        qty_50g,
        qty_100g
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add item to cart');
    }

    return data.cart;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Get user's cart
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/api/cart`, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch cart');
    }

    return data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Update item quantity
export const updateQuantity = async (productId: string, qty_50g: number, qty_100g: number): Promise<Cart> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/api/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        productId,
        qty_50g,
        qty_100g
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update cart');
    }
    return data.cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};
// Remove item from cart
export const removeFromCart = async (productId: string): Promise<Cart> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/api/cart/remove/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to remove item from cart');
    }
    return data.cart;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

// Clear entire cart
export const clearCart = async (): Promise<Cart> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/api/cart/clear`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to clear cart');
    }

    return data.cart;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}; 