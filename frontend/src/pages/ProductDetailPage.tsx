import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import DeliveryLocation from '../components/DeliveryLocation';
import { getProductById } from '../services/productService';
import type { Product } from '../types/product';

const placeholder = '/placeholder.png';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>(placeholder);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { isWishlisted, addToWishlist, removeFromWishlist, moveWishlistItemToCart } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        setSelectedImage(data.images && data.images.length > 0 ? data.images[0] : placeholder);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center text-yellow-400 mt-10">Loading...</div>;
  if (!product) return <div className="text-center text-red-500 mt-10">Product not found.</div>;

  const wishlisted = isWishlisted(product._id);

  const handleWishlistToggle = () => {
    if (wishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const handleMoveToCart = () => {
    moveWishlistItemToCart(product._id);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      quantity,
    });
  };

  return (
    <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-6">
        {/* Left image section */}
        <div className="col-span-5 flex flex-col-reverse md:flex-row gap-4 items-center md:items-start">
          {/* Thumbnails (mobile below, desktop left) */}
          <div className="flex md:flex-col gap-2 justify-center md:justify-start items-center md:items-start">
            {(product.images && product.images.length > 0 ? product.images : [placeholder, placeholder, placeholder, placeholder]).slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className={`w-16 h-16 sm:w-20 sm:h-20 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-center cursor-pointer border-2 transition-all duration-200 ${
                  selectedImage === img ? 'border-yellow-400' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={`/images/products/${img}`} alt={`thumbnail-${idx}`} className="w-8 h-8 object-contain" />
              </div>
            ))}
          </div>

          {/* Main image */}
          <div className="relative w-full sm:w-[90vw] md:w-full h-[300px] sm:h-[400px] bg-black/5 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
            <FiHeart
              className={`absolute top-4 right-4 text-2xl cursor-pointer transition-all ${
                wishlisted ? 'text-yellow-400' : 'text-white'
              }`}
              onClick={handleWishlistToggle}
            />
            <img src={selectedImage} alt={product.product_name} className="h-3/4 object-contain" />
          </div>
        </div>

        {/* Product Info */}
        <div className="col-span-7">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">{product.product_name}</h1>
          <p className="text-yellow-400 font-body mb-2">12 sold in last 10 hours</p>
          <p className="text-xl font-semibold font-sans mb-3">₹{product.mrp && product.mrp.length > 0 ? Math.round(product.mrp[0]) : ''}</p>

          <div className="mb-4">
            <p className="mb-1 font-medium font-body">Select Unit</p>
            <div className="flex gap-2 flex-wrap">
              {product.net_wt && product.net_wt.map((wt, idx) => (
                <button key={idx} className="px-4 py-2 border rounded-2xl font-button border-yellow-400 text-yellow-400">
                  {wt.value}{wt.unit}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-2 text-xl font-sans font-semibold">
            <span className="text-black dark:text-white text-2xl font-heading">Subtotal</span>:- ₹{product.mrp && product.mrp.length > 0 ? Math.round(product.mrp[0] * quantity) : ''}
          </p>

          <div className="flex flex-col gap-4 mb-6">
          {/* Row 1: Quantity and Wishlist */}
          <div className="flex items-center gap-4 flex-wrap">
            <p className="font-semibold text-2xl font-heading">Quantity</p>

            <div className="flex items-center border font-button border-black dark:border-white rounded-full px-4 py-1 gap-3">
              <button onClick={() => handleQuantityChange(-1)}><FiMinus /></button>
              <span className="font-sans">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}><FiPlus /></button>
            </div>

            <button
              className={`font-button px-4 py-1 rounded-full border transition duration-200 ${
                wishlisted ? 'border-yellow-400 text-yellow-400' : 'border-black dark:border-white text-black dark:text-white'
              }`}
              onClick={handleWishlistToggle}
            >
              {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {wishlisted && (
              <button
                className="bg-yellow-400 text-black font-button px-4 py-1 rounded-full border border-yellow-400 hover:brightness-125 transition duration-200"
                onClick={handleMoveToCart}
              >
                Move to Cart
              </button>
            )}
          </div>

          {/* Row 2: Add to Cart Button */}
          <button
            className="text-black dark:text-white font-button font-normal px-4 py-2 rounded-full border border-yellow-400 hover:brightness-125 transition duration-200 w-full sm:w-[51%]"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>

          {/* Delivery & Policy */}
          <div className="font-body mt-6 space-y-4 text-sm">
            <p>
              <span className="text-yellow-400 font-heading text-lg font-semibold">Delivery Info:</span>{' '}
              Delivery within <span className="font-sans">3-5</span> days
            </p>
            <DeliveryLocation />
            <p>
              <span className="text-yellow-400 font-heading text-lg font-semibold">Manufactured by:</span>{' '}
              {product.manufactured_marketed_by || 'Suruchiraj Spices, Pune'}
            </p>
            <p>
              <span className="text-yellow-400 font-heading text-lg font-semibold">Customer Care:</span>{' '}
              <span className="font-sans">{product.customer_care_no || '+91 9867104406'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="font-body text-lg max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-heading font-semibold mb-2">Product Details</h2>
        <p className="text-yellow-400 font-semibold">Ingredients</p>
        <p className="mb-2">
          {product.ingredients && product.ingredients.length > 0 ? product.ingredients.join(', ') : 'N/A'}
        </p>
        <p className="text-yellow-400 font-semibold mb-2">No Preservatives</p>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-yellow-400 font-semibold">Unit:</p>
          <span className="font-sans">
            {product.net_wt && product.net_wt.length > 0
              ? `${product.net_wt[0].value}${product.net_wt[0].unit}`
              : 'N/A'}
          </span>
        </div>
        <p className="text-yellow-400 font-semibold">Why You'll Love It</p>
        <ul className="list-disc list-inside mb-2">
          {product.why_you_will_love_it && product.why_you_will_love_it.length > 0 ? (
            product.why_you_will_love_it.map((item, idx) => <li key={idx}>{item}</li>)
          ) : (
            <li>Full of rich biryani aroma and taste</li>
          )}
        </ul>
        <p className="text-yellow-400 font-semibold">How to Use (Simple Recipe)</p>
        <ol className="list-decimal list-inside mb-2">
          {product.recipe && Array.isArray(product.recipe) && product.recipe.length > 0 ? (
            product.recipe.map((step, idx) => <li key={idx}>{step}</li>)
          ) : (
            <li>Use as per your taste and recipe.</li>
          )}
        </ol>
        <p><span className="text-yellow-400 font-semibold">Shelf Life</span> <span className="font-sans">{product.best_before || '12 Months'}</span></p>
      </div>
    </div>
  );
};

export default ProductDetailPage;
