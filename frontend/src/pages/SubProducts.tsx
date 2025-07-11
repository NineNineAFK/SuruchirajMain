import { useState, useEffect } from 'react';
import { FiFilter, FiHeart, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getAllProducts, getProductFilters } from '../services/productService';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';
import { searchTermAtom, authStateAtom } from '../state/state';
import { useLoginModal } from '../context/LoginModalContext';
import type { Product } from '../types/product';
import { Link, useLocation } from 'react-router-dom';

const SubProducts = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, updateQuantity, loading: cartLoading } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const searchTerm = useRecoilValue(searchTermAtom);
  const authState = useRecoilValue(authStateAtom);
  const { openModal } = useLoginModal();
  const [filterQuantities, setFilterQuantities] = useState<string[]>([]);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    const fetchFilters = async () => {
      try {
        const { categories, quantities } = await getProductFilters();
        setFilterCategories(categories || []);
        setFilterQuantities(Array.isArray(quantities) ? quantities.filter((q): q is string => typeof q === 'string' && q.length > 0) : []);
      } catch (err) {
        setFilterCategories([]);
        setFilterQuantities([]);
      }
    };
    fetchProducts();
    fetchFilters();
  }, []);

  const handleWishlistToggle = (product: Product) => {
    const id = product._id;
    if (isWishlisted(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

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

  const handleIncreaseQuantity = async (product: Product) => {
    if (!authState) {
      openModal();
      return;
    }

    const cartItem = cart.find(item => item.productName === product.product_name);
    if (cartItem) {
      await updateQuantity(product.product_name, cartItem.quantity + 1);
    }
  };

  const handleDecreaseQuantity = async (product: Product) => {
    if (!authState) {
      openModal();
      return;
    }

    const cartItem = cart.find(item => item.productName === product.product_name);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        await updateQuantity(product.product_name, cartItem.quantity - 1);
      } else {
        await removeFromCart(product.product_name);
      }
    }
  };

  const handleQuantityChange = (qty: string) => {
    if (typeof qty !== 'string' || !qty || qty.length === 0) return;
    setSelectedQuantities((prev) => {
      const filteredPrev = prev.filter((q): q is string => typeof q === 'string' && q.length > 0);
      return filteredPrev.includes(qty) ? filteredPrev.filter(q => q !== qty) : [...filteredPrev, qty];
    });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Ensure selectedQuantities and filterQuantities are always arrays of strings
  const safeSelectedQuantities = (Array.isArray(selectedQuantities)
    ? selectedQuantities.filter((q): q is string => typeof q === 'string' && q.length > 0)
    : []) as string[];
  const safeFilterQuantities: string[] = Array.isArray(filterQuantities)
    ? filterQuantities.filter((q): q is string => typeof q === 'string' && q.length > 0)
    : [];

  // Debug logs for filter values
  console.log('selectedQuantities:', selectedQuantities, selectedQuantities.map(q => typeof q));
  console.log('filterQuantities:', filterQuantities, filterQuantities.map(q => typeof q));
  console.log('safeSelectedQuantities:', safeSelectedQuantities, safeSelectedQuantities.map(q => typeof q));

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = product.product_name && product.product_name.toLowerCase().includes(term);

    // Category filter (used for both categories and cuisines)
    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      if (Array.isArray(product.category)) {
        categoryMatch = product.category.some(cat => selectedCategories.includes(cat));
      } else if (typeof product.category === 'string') {
        categoryMatch = selectedCategories.includes(product.category);
      } else {
        categoryMatch = false;
      }
    }

    // Quantity filter
    let quantityMatch = true;
    if (safeSelectedQuantities.length > 0) {
      if (Array.isArray(product.net_wt) && product.net_wt.length > 0) {
        quantityMatch = product.net_wt.some(wt => {
          if (
            wt &&
            (typeof wt.value === 'string' || typeof wt.value === 'number') &&
            typeof wt.unit === 'string' &&
            wt.unit && wt.unit.length > 0
          ) {
            const valueStr = String(wt.value).trim();
            const unitStr = String(wt.unit).trim();
            if (!valueStr || !unitStr) return false;
            const productQty = `${valueStr} ${unitStr}`;
            if (!Array.isArray(safeSelectedQuantities)) return false;
            const stringSelectedQuantities = safeSelectedQuantities.filter((q): q is string => typeof q === 'string' && q.length > 0);
            return (stringSelectedQuantities as string[]).some(selQty => {
              const selQtyTrimmed = (selQty!).trim();
              return selQtyTrimmed === productQty || selQtyTrimmed === valueStr || selQtyTrimmed === unitStr;
            });
          }
          return false;
        });
      } else {
        quantityMatch = false;
      }
    }

    // Search term (name/category)
    let searchMatch = nameMatch;
    if (!searchMatch && Array.isArray(product.category)) {
      searchMatch = product.category.some(cat =>
        typeof cat === 'string' && cat.toLowerCase().includes(term)
      );
    }

    return searchMatch && categoryMatch && quantityMatch;
  });

  return (
    <div className="bg-black text-white min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      {/* Mobile Filter Toggle */}
      <div className="sm:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-yellow-400">Products</h1>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="text-white flex items-center space-x-1 text-sm border px-3 py-1 rounded-full"
        >
          <FiFilter />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar (Desktop Only) */}
        <aside className="w-60 bg-black text-white hidden sm:block">
          <h2 className="text-2xl font-medium text-yellow-400 font-body mb-4">Filters</h2>
          <div className="mb-6 font-body">
            <h3 className="font-semibold font-heading text-xl mb-2">Quantity</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {safeFilterQuantities.map((safeQty) => {
                if (typeof safeQty !== 'string' || !safeQty.length) return null;
                return (
                  <li key={safeQty}>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={safeSelectedQuantities.includes(safeQty)}
                        onChange={() => handleQuantityChange(safeQty)}
                          className="w-5 h-5 appearance-none border-2 border-yellow-400 rounded bg-black relative checked:bg-black checked:border-yellow-400 transition-colors duration-200 checked:after:content-['✓'] checked:after:text-yellow-400 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-sm"
                        />
                      <span>{safeQty}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold font-heading text-xl mb-2">Category</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {filterCategories.map((cat) => (
                <li key={cat}>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                        className="w-5 h-5 appearance-none border-2 border-yellow-400 rounded bg-black relative checked:bg-black checked:border-yellow-400 transition-colors duration-200 checked:after:content-['✓'] checked:after:text-yellow-400 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-sm"
                      />
                    <span>{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 font-body">
          <div className="hidden sm:flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-heading text-white">Products</h1>
            <span className="text-sm text-white font-medium cursor-pointer">All Categories</span>
          </div>

          {loading ? (
            <p className="text-white text-center">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
                const cartItem = cart.find(item => item.productName === product.product_name);
                const quantity = cartItem?.quantity || 0;

                return (
                  <Link to={`/product/${product._id}`} key={String(product._id)}>
                    <div
                      className="bg-[#141414] rounded-2xl overflow-hidden relative group transition transform hover:-translate-y-1"
                    >
                      {/* Wishlist Icon */}
                      <div className="absolute top-3 right-3 z-10">
                        <button
                          onClick={e => { e.preventDefault(); handleWishlistToggle(product); }}
                          className="text-white text-sm"
                        >
                          <FiHeart
                            className={`text-lg transition ${
                              isWishlisted(product._id)
                                ? 'text-red-500 fill-red-500'
                                : 'text-white'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Product Image */}
                      <img
                        src={product.images && product.images.length > 0 ? `/images/products/${product.images[0]}` : '/placeholder.png'}
                        alt={product.product_name}
                        className="w-full h-36 object-cover"
                      />

                      {/* Product Info */}
                      <div className="p-3 pt-4 text-white bg-[#141414]">
                        <h3 className="text-sm font-medium">{product.product_name}</h3>
                      <div className="flex items-center justify-between font-sans text-lg mt-1">
                        {/* Price on the left */}
                        {product.mrp && product.mrp.length > 0 && (
                          <span className="font-semibold text-white">₹{product.mrp[0]}</span>
                        )}

                        {/* Weight on the right */}
                        {product.net_wt && product.net_wt.length > 0 && (
                          <span className="text-sm text-gray-300">
                            {String(product.net_wt[0]?.value ?? '')} {product.net_wt[0]?.unit ?? ''}
                          </span>
                        )}
                      </div>

                        {quantity === 0 ? (
                          <button
                            onClick={e => { e.preventDefault(); handleAddToCart(product); }}
                            disabled={cartLoading}
                            className={`mt-3 w-full text-sm font-button font-semibold py-1.5 rounded-full transition ${
                              cartLoading 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-yellow-400 text-black hover:bg-yellow-300'
                            }`}
                          >
                            {cartLoading ? 'Adding...' : 'Add To Cart'}
                          </button>
                        ) : (
                          <div className="mt-3 flex items-center justify-between bg-yellow-400 rounded-full px-3 py-1.5 text-black font-button font-semibold text-sm">
                            <button
                              onClick={e => { e.preventDefault(); handleDecreaseQuantity(product); }}
                              disabled={cartLoading}
                              className={`px-2 ${cartLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-300 rounded'}`}
                            >
                              −
                            </button>
                            <span>{quantity}</span>
                            <button
                              onClick={e => { e.preventDefault(); handleIncreaseQuantity(product); }}
                              disabled={cartLoading}
                              className={`px-2 ${cartLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-300 rounded'}`}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 sm:hidden flex justify-end"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="bg-black w-3/4 max-w-xs p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold font-heading">Filters</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedQuantities([]);
                  }}
                  className="text-xs text-yellow-400 underline hover:text-yellow-300"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-white hover:text-red-400"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>


            <div className="mb-6 font-body">
              <h3 className="font-medium font-heading text-xl mb-2">Quantity</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-none pl-0">
                {safeFilterQuantities.map((safeQty) => {
                  if (typeof safeQty !== 'string' || !safeQty.length) return null;
                  return (
                    <li key={safeQty}>
                      <label className="inline-flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={safeSelectedQuantities.includes(safeQty)}
                          onChange={() => handleQuantityChange(safeQty)}
                          className="w-5 h-5 appearance-none border-2 border-yellow-400 rounded bg-black relative checked:bg-black checked:border-yellow-400 transition-colors duration-200 checked:after:content-['✓'] checked:after:text-yellow-400 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-sm"
                        />
                        <span>{safeQty}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>


            <div>
              <h3 className="font-semibold font-heading text-xl mb-2">Category</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {filterCategories.map((cat) => (
                  <li key={cat}>
                    <span
                      className={`cursor-pointer hover:text-yellow-400 ${
                        selectedCategories.includes(cat) ? 'text-yellow-400' : ''
                      }`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubProducts;
