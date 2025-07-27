// Get trending products
import type { Product } from '../types/product.tsx';

export const getTrendingProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/trending`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch trending products');
    }
    return data.products;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    throw error;
  }
};
// Update trending rank (admin)
export const updateTrendingRank = async (id: string, trendingRank: number | null): Promise<number | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/trending-rank`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trendingRank }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update trending rank');
    }
    return data.trendingRank;
  } catch (error) {
    console.error('Error updating trending rank:', error);
    throw error;
  }
};
// Toggle product visibility (admin)
export const toggleProductVisibility = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}/toggle-visibility`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to toggle product visibility');
    }
    return data.isVisible;
  } catch (error) {
    console.error('Error toggling product visibility:', error);
    throw error;
  }
};
import type { Product, ProductFormData } from '../types/product.tsx';

const API_BASE_URL = import.meta.env.VITE_domainName;

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/productInfo`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch products');
    }
    
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/productInfo/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch product');
    }
    
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Add new product
export const addProduct = async (productData: ProductFormData): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/addProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include', // Temporarily commented out
      body: JSON.stringify(productData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add product');
    }
    
    return data.product;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/updateProduct/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include', // Temporarily commented out
      body: JSON.stringify(productData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update product');
    }
    
    return data.product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/deleteProduct/${id}`, {
      method: 'DELETE',
      // credentials: 'include', // Temporarily commented out
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get unique categories and quantities for filters
export const getProductFilters = async (): Promise<{ categories: string[]; quantities: string[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/api/filters`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch filters');
    }
    return { categories: data.categories, quantities: data.quantities };
  } catch (error) {
    console.error('Error fetching product filters:', error);
    throw error;
  }
};

// Fetch all orders (admin)
export const getAllOrders = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    return data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Update order status (admin)
export const updateOrderStatus = async (orderId: string, orderStatus: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update order status');
    }
    return data.order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Delete order (admin)
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete order');
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}; 