import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiHeart, } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
// import toast from 'react-hot-toast';
import DeliveryLocation from '../components/DeliveryLocation';
import { getProductById } from '../services/productService';
import type { Product } from '../types/product';
import { AiFillHeart } from 'react-icons/ai';


const ProductDetailPage: React.FC = () => {
  // Initialize with empty string instead of fallback
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  //const [selectedImage, setSelectedImage] = useState<string>(placeholder);
  //const [selectedImage, setSelectedImage] = useState<string>(testImages[0]);
  
  const [selected50g, setSelected50g] = useState(0);
  const [selected100g, setSelected100g] = useState(0);
  const [error, setError] = useState('');
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
        if (data.images && data.images.length > 0) {
          // Find lifestyle shot or use first image
          const defaultImage = data.images.find(img => img.toLowerCase().includes('lifestyle shot')) || data.images[0];
          setSelectedImage(`https://suruchiraj.com/images/products/${defaultImage}`);
        }
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const total_required_grams = (selected50g * 50) + (selected100g * 100);
    let err = '';
    if (total_required_grams > (product.stock || 0)) {
      err = 'Not enough spice stock available';
    }
    if (selected50g > (product.packaging_50gms || 0)) {
    }
    if (selected50g > (product.packaging_50gms || 0)) {
      err = 'Not enough 50g packaging available';
    }
    if (selected100g > (product.packaging_100gms || 0)) {
    }
    if (selected100g > (product.packaging_100gms || 0)) {
      err = 'Not enough 100g packaging available';
    }
    setError(err);
  }, [selected50g, selected100g, product]);


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

  // const handleMoveToCart = () => {
  //   moveWishlistItemToCart(product._id);
  // };


  const max50g = product ? Math.min(Math.floor((product.stock || 0) / 50), product.packaging_50gms) : 0;
  const max100g = product ? Math.min(Math.floor((product.stock || 0) / 100), product.packaging_100gms) : 0;
  const total_required_grams = (selected50g * 50) + (selected100g * 100);
  const canAddToCart = !error && (selected50g > 0 || selected100g > 0);

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      qty_50g: selected50g,
      qty_100g: selected100g,
    });
  };

  return (
  <div className="bg-white text-black dark:bg-black dark:text-white min-h-screen px-4 py-8">
    <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-6">
      {/* Image Section */}
      <div className="col-span-5 flex flex-col-reverse md:flex-row gap-4 items-center md:items-start">
        
        {/* Thumbnails */}
        <div className="flex flex-row md:flex-col md:gap-8 gap-3">
          {product.images?.map((img, idx) => (
            <div
              key={idx}
              className={`rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
                selectedImage === img ? 'ring-1 ring-yellow-400' : ''
              }`}
              onClick={() => setSelectedImage(`https://suruchiraj.com/images/products/${img}`)}
              style={{
                width: '50px',
                height: '50px',
              }}
            >
              <img
                src={`https://suruchiraj.com/images/products/${img}`}
                alt={`${product.product_name} thumbnail ${idx + 1}`}
                className="object-contain rounded-lg w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative w-full sm:w-[90vw] md:w-full aspect-square flex items-center justify-center mx-auto">
          {wishlisted ? (
            <AiFillHeart
              className="absolute top-8 right-8 text-2xl text-red-500 cursor-pointer transition-all"
              onClick={handleWishlistToggle}
            />
          ) : (
            <FiHeart
              className="absolute top-8 right-8 text-2xl text-white cursor-pointer transition-all"
              onClick={handleWishlistToggle}
            />
          )}
          <img
            src={selectedImage}
            alt={product.product_name}
            className="w-[90%] h-[90%] object-contain rounded-xl"
          />
        </div>
      </div>



        {/* Product Info */}
        <div className="col-span-7 md:mt-10">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading mb-2">{product.product_name}</h1>
          <p className="text-xl font-semibold font-sans mb-3">
            50g: ₹{product.mrp && product.mrp.length > 0 ? Math.round(product.mrp[0]) : 'N/A'} &nbsp;|
            100g: ₹{product.mrp && product.mrp.length > 1 ? Math.round(product.mrp[1]) : 'N/A'}
          </p>

          <p className="mb-2 text-xl font-sans font-semibold">
            <span className="text-black dark:text-white text-2xl font-heading">Subtotal</span>:- ₹{
              product.mrp && product.mrp.length > 1
                ? Math.round((selected50g * product.mrp[0]) + (selected100g * product.mrp[1]))
                : ''
            }
          </p>

          {/* Replace old quantity selector with new packet selectors and validation UI */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <p className="font-semibold text-2xl font-heading">Select Packets</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-body">50g:</span>
                  <button onClick={() => setSelected50g(Math.max(0, selected50g - 1))} className="px-2">-</button>
                  <span>{selected50g}</span>
                  <button onClick={() => setSelected50g(Math.min(max50g, selected50g + 1))} className="px-2">+</button>
                  <span className="text-xs text-gray-500">(max {max50g})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-body">100g:</span>
                  <button onClick={() => setSelected100g(Math.max(0, selected100g - 1))} className="px-2">-</button>
                  <span>{selected100g}</span>
                  <button onClick={() => setSelected100g(Math.min(max100g, selected100g + 1))} className="px-2">+</button>
                  <span className="text-xs text-gray-500">(max {max100g})</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">Total grams: {total_required_grams}g / {(product.stock || 0)}g available</div>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
              </div>
            </div>
            <button
              className={`text-black dark:text-white font-button font-normal px-4 py-2 rounded-full border border-yellow-400 hover:brightness-125 transition duration-200 w-full sm:w-[51%] ${!canAddToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAddToCart}
              disabled={!canAddToCart}
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
            {/* <p>
              <span className="text-yellow-400 font-heading text-lg font-semibold">Manufactured by:</span>{' '}
              {product.manufactured_marketed_by || 'Suruchiraj Spices, Pune'}
            </p>
            <p>
              <span className="text-yellow-400 font-heading text-lg font-semibold">Customer Care:</span>{' '}
              <span className="font-sans">{product.customer_care_no || '+91 9867104406'}</span>
            </p> */}
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