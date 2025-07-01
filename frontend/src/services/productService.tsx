import type { Product, ProductFormData } from '../types/product';

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