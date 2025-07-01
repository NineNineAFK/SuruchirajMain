import React, { useState, useEffect } from 'react';
import type { Product } from '../types/product';
import { getAllProducts } from '../services/productService';
import toast from 'react-hot-toast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { searchTermAtom, authStateAtom } from '../state/state';
import { useCart } from '../context/CartContext';
import { useLoginModal } from '../context/LoginModalContext';
import { Link } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermAtom);
  const authState = useRecoilValue(authStateAtom);
  const { addToCart, loading: cartLoading } = useCart();
  const { openModal } = useLoginModal();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || (Array.isArray(product.category) && product.category.includes(selectedCategory));
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(product.category) && product.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (product: Product) => {
    if (!authState) {
      openModal();
      return;
    }
    try {
      await addToCart({
        productId: product._id,
        quantity: 1
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = (product: Product) => {
    if (!authState) {
      openModal();
      return;
    }
    toast('Buy now functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={String(product._id)}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{product.product_name}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600">₹{product.mrp && product.mrp.length > 0 ? product.mrp[0] : ''}</span>
                        <span className="text-gray-500">{product.net_wt && product.net_wt.length > 0 ? `${product.net_wt[0].value} ${product.net_wt[0].unit}` : ''}</span>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Ingredients:</h4>
                        <div className="flex flex-wrap gap-1">
                          {product.ingredients && product.ingredients.map((ingredient, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Recipe:</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {product.recipe && Array.isArray(product.recipe) ? product.recipe.join(' ') : product.recipe}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={e => { e.preventDefault(); handleAddToCart(product); }}
                        disabled={cartLoading}
                        className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                          cartLoading 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {cartLoading ? 'Adding...' : 'Add to Cart'}
                      </button>
                      <button 
                        onClick={e => { e.preventDefault(); handleBuyNow(product); }}
                        disabled={cartLoading}
                        className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                          cartLoading 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage; 