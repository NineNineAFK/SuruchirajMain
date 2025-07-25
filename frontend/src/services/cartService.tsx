const API_BASE_URL = import.meta.env.VITE_domainName;

export interface CartItem {
  _id?: string;
  productId: string;
  product?: string;  // Add this for MongoDB _id reference
  productName: string;
  price_50g: number;
  price_100g: number;
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

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      throw new Error('Server returned non-JSON response');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add item to cart');
    }

    return data.cart;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to add item: ${error.message}`);
    }
    throw new Error('Failed to add item to cart');
  }
};

// Get user's cart
export const getCart = async (): Promise<Cart> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/cart`, {
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
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
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
    if (!productId) {
      throw new Error('Product ID is required to remove item from cart');
    }
    const response = await fetch(`${API_BASE_URL}/cart/remove/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      throw new Error('Server returned non-JSON response');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to remove item from cart');
    }
    return data.cart;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to remove item: ${error.message}`);
    }
    throw new Error('Failed to remove item from cart');
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