import { useState, useEffect } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
// import { useCart } from '../context/CartContext';
// import { useWishlist } from '../context/WishlistContext';
import { getAllProducts } from '../services/productService';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';
import { searchTermAtom } from '../state/state';
// import { useLoginModal } from '../context/LoginModalContext';
import type { Product } from '../types/product.tsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const SubProducts = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  // Only visible products for user-facing display
  const visibleProducts = products.filter(product => product.isVisible);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const searchTerm = useRecoilValue(searchTermAtom);

  // Categories derived from visible products only
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
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
        // Dynamically set categories from only visible products
        const categories = Array.from(new Set(
          data.filter((p: Product) => p.isVisible && Array.isArray(p.category))
            .flatMap((p: Product) => p.category)
        ));
        setFilterCategories(categories);
      } catch (err) {
        toast.error('Failed to load products');
        setFilterCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // const handleWishlistToggle = (product: Product) => {
  //   const id = product._id;
  //   if (isWishlisted(id)) {
  //     removeFromWishlist(id);
  //   } else {
  //     addToWishlist(id);
  //   }
  // };


  const handleBuyNow = (product: Product) => {
    navigate(`/product/${product._id}`);
  };



  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Remove all logic and state related to selectedQuantities, filterQuantities, and safeSelectedQuantities
  // Ensure selectedQuantities and filterQuantities are always arrays of strings
  const filteredProducts = visibleProducts.filter((product) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = product.product_name && product.product_name.toLowerCase().includes(term);

    // Category filter
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

    // Removed quantity filter logic

    // Search term (name/category)
    let searchMatch = nameMatch;
    if (!searchMatch && Array.isArray(product.category)) {
      searchMatch = product.category.some(cat =>
        typeof cat === 'string' && cat.toLowerCase().includes(term)
      );
    }

    return searchMatch && categoryMatch;
  });

  return (
    <div className="bg-east-side-100 text-black dark:bg-black dark:text-white min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      {/* Mobile Filter Toggle */}
      <div className="sm:hidden flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold font-heading text-black dark:text-white">Products</h1>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center space-x-1 text-sm border border-black dark:border-white px-3 py-1 rounded-full"
        >
          <FiFilter />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar (Desktop Only) */}
        <aside className="w-60 dark:bg-black bg-east-side-100 text-white hidden sm:block">
          <h2 className="text-2xl font-medium text-black dark:text-yellow-400 font-body mb-4">Filters</h2>
          {/* Removed Quantity filter UI */}
          <div>
            <h3 className="font-semibold font-heading text-black dark:text-white text-xl mb-2">Category</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {filterCategories.map((cat) => (
                <li key={cat}>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                        className="w-5 h-5 appearance-none border-2 border-[#4D6A3F] dark:border-yellow-400 rounded bg-east-side-100 dark:bg-black relative checked:bg-east-side-100 checked:dark:bg-black checked:border-[#4D6A3F] dark:checked:border-yellow-400 transition-colors duration-200 checked:after:content-['✓'] checked:after:text-[#4D6A3F] dark:checked:after:text-yellow-400 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-sm"
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
            <h1 className="text-3xl font-bold font-heading dark:text-white text-black">Products</h1>
            <span className="text-sm dark:text-white text-gray-600 font-medium">All Categories</span>
          </div>

          {loading ? (
            <p className="text-black dark:text-gray-100  text-center">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-black dark:text-gray-100  text-center mt-10">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={String(product._id)}>
                  <div
                    className="relative group transition transform hover:-translate-y-1 flex flex-col justify-between h-[320px] sm:h-[30vw]"
                  >
                    {/* Wishlist Icon */}
                    <div className="absolute md:top-8 md:right-4 top-4 right-2 z-20">
                      {/* Wishlist functionality disabled */}
                      {/* <button
                        onClick={e => { e.preventDefault(); handleWishlistToggle(product); }}
                        className="text-white text-sm"
                      >
                        <FiHeart
                          className={`text-lg transition ${isWishlisted(product._id)
                            ? 'text-red-500 fill-red-500'
                            : 'text-black'
                            }`}
                        />
                      </button> */}
                      {/* <FiHeart className="text-xl text-gray-400" /> */}
                    </div>
                    <div className="rounded-t-[3rem] rounded-b-lg overflow-hidden border border-gray-200 dark:border-white/30 shadow-md bg-white dark:bg-black flex flex-col">
                      {/* Product Image */}
                      {product.images && product.images.length > 0 && (
                        <img
                          src={`https://suruchiraj.com/images/products/${product.images.find(img => img.toLowerCase().includes('lifestyle shot')) || product.images[0]}`}
                          alt={product.product_name}
                          className="w-full aspect-square object-cover"
                        />
                      )}

                      {/* Product Info */}
                      <div className="p-4 dark:text-white text-black flex flex-col justify-between gap-2"><h3 className="text-sm md:text-lg font-medium leading-tight line-clamp-1">{product.product_name}</h3>
                        <div className="-mt-1 flex items-center justify-between font-sans md:text-lg text-base">
                          {/* Price on the left */}
                          {product.mrp && product.mrp.length > 0 && (
                            <span className="font-semibold dark:text-white text-black">₹{product.mrp[0]}</span>
                          )}

                          {/* Weight on the right */}
                          {product.net_wt && product.net_wt.length > 0 && (
                            <span className="text-sm text-gray-500 dark:text-gray-300">
                              {String(product.net_wt[0]?.value ?? '')} {product.net_wt[0]?.unit ?? ''}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={e => { e.preventDefault(); handleBuyNow(product); }}
                          className="mt-1 w-full text-sm font-button font-semibold py-1.5 rounded-full transition bg-yellow-400 text-black hover:bg-yellow-300"
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
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 sm:hidden flex justify-end"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="bg-east-side-100 dark:bg-black w-3/4 max-w-xs p-6 overflow-y-auto text-black dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold font-heading">Filters</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    // Removed setSelectedQuantities([])
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
            {/* Removed Quantity filter UI */}
            <div>
              <h3 className="font-semibold font-heading text-xl mb-2">Category</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {filterCategories.map((cat) => (
                <li key={cat}>
                  <label className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                        className="w-5 h-5 appearance-none border-2 border-[#4D6A3F] dark:border-yellow-400 rounded bg-east-side-100 dark:bg-black relative checked:bg-east-side-100 checked:dark:bg-black checked:border-[#4D6A3F] dark:checked:border-yellow-400 transition-colors duration-200 checked:after:content-['✓'] checked:after:text-[#4D6A3F] dark:checked:after:text-yellow-400 checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-sm"
                      />
                      <span>{cat}</span>
                    </label>
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