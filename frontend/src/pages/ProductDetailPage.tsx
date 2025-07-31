import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { FiHeart, } from 'react-icons/fi';
// import { AiFillHeart } from 'react-icons/ai';
// import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
// import toast from 'react-hot-toast';
import DeliveryLocation from '../components/DeliveryLocation';
import { getProductById } from '../services/productService';
import type { Product } from '../types/product';


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

  // const { isWishlisted, addToWishlist, removeFromWishlist, moveWishlistItemToCart } = useWishlist();
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


  if (loading) return <div className="text-center text-[#4D6A3F] dark:text-yellow-400 mt-10">Loading...</div>;
  if (!product) return <div className="text-center text-red-500 mt-10">Product not found.</div>;

  // const wishlisted = isWishlisted(product._id);

  // const handleWishlistToggle = () => {
  //   if (wishlisted) {
  //     removeFromWishlist(product._id);
  //   } else {
  //     addToWishlist(product._id);
  //   }
  // };

  // const handleMoveToCart = () => {
  //   moveWishlistItemToCart(product._id);
  // };


  const max50g = product ? Math.min(Math.floor((product.stock || 0) / 50), product.packaging_50gms) : 0;
  const max100g = product ? Math.min(Math.floor((product.stock || 0) / 100), product.packaging_100gms) : 0;
  const canAddToCart = !error && (selected50g > 0 || selected100g > 0);

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      qty_50g: selected50g,
      qty_100g: selected100g,
    });
  };

  return (
  <div className="overflow-x-hidden bg-white text-black dark:bg-black dark:text-white min-h-screen px-4 py-8">
  {/* Background images (uncomment if needed    */}
    {/*<img
      src="/icons/leaf.svg"
      alt="Leaf"
      className="absolute top-20 right-10 w-3 h-3 opacity-30"
    />
    <img
      src="/icons/star.svg"
      alt="Star"
      className="absolute bottom-10 left-4 w-4 h-4 opacity-20"
    />
    <img
      src="/icons/branch.svg"
      alt="Branch"
      className="absolute bottom-20 right-6 w-3 h-3 opacity-30"
    /> */}
    <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-6">
      {/* Image Section */}
      <div className="col-span-5 flex flex-col-reverse md:flex-row gap-4 items-center md:items-start">
        
        {/* Thumbnails */}
        <div className="flex flex-row md:flex-col md:gap-8 gap-2">
          {product.images?.map((img, idx) => (
            <div
              key={idx}
              className={`rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
                selectedImage === img ? 'ring-1 ring-[#4D6A3F] dark:ring-yellow-400' : ''
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
        <div className="relative w-full aspect-square flex items-center justify-center">
        {/* <div className="relative w-full sm:w-[90vw] md:w-full aspect-square flex items-center justify-center mx-auto"> */}
          {/* {wishlisted ? (
            <AiFillHeart
              className="absolute top-8 right-8 text-2xl text-red-500 cursor-pointer transition-all"
              onClick={handleWishlistToggle}
            />
          ) : (
            <FiHeart
              className="absolute top-8 right-8 text-2xl text-black cursor-pointer transition-all"
              onClick={handleWishlistToggle}
            />
          )} */}
          <img
            src={selectedImage}
            alt={product.product_name}
            className="w-[90%] h-[90%] object-contain rounded-xl"
          />
        </div>
      </div>



        {/* Product Info */}
        <div className="col-span-7 md:mt-7">
          <h1 className="text-2xl sm:text-3xl font-bold font-body mb-5">{product.product_name}</h1>
          {/* <div className="flex items-center gap-3 mb-3">
            {/* <span className="bg-amber-100 text-amber-800 font-medium px-3 py-1 rounded-full text-sm sm:text-base">
              50g: ₹{product.mrp && product.mrp.length > 0 ? Math.round(product.mrp[0]) : 'N/A'}
            </span> 
            <span className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-sm sm:text-base">
              100g: ₹{product.mrp && product.mrp.length > 1 ? Math.round(product.mrp[1]) : 'N/A'}
            </span>
          </div> */}


          

          {/* Replace old quantity selector with new packet selectors and validation UI */}
          <div className="flex flex-col gap-6 md:mb-8 mb-4">
            {/* ----------  PACKET SELECT  ---------- */}
            <div className="flex flex-col gap-4 md:items-start md:gap-4">
              <p className="font-heading font-semibold text-2xl"><span className='dark:text-yellow-400 text-[#4D6A3F]'>Select</span> Units</p>

              {/* cards container */}
              <div className="flex flex-col md:flex-row gap-3">

                {/* --- 100 g CARD --- */}
                <div className="w-[50vw] md:w-full relative rounded-2xl p-[2px] border dark:border:bg-gradient-to-r dark:from-lime-400/10 dark:to-lime-400/30 dark:hover:bg-gradient-to-r dark:hover:from-lime-400/10 dark:hover:to-lime-400/30">
                  <div className="flex items-center justify-between gap-4 bg-transparent rounded-2xl px-3 py-3">
                    {/* label + price */}
                    <div className="flex flex-col gap-x-5">
                      <span className="dark:text-white text-[#4D6A3F] font-medium text-base">100g</span>
                      <span className="dark:text-yellow-400 text-black font-medium text-sm">₹{product.mrp && product.mrp.length > 1 ? Math.round(product.mrp[1]) : 'N/A'}</span>
                    </div>

                    {/* qty pill */}
                    <div className="p-[1px] rounded-full bg-blend-color-burn bg-[#4D6A3F]/70 dark:bg-gradient-to-r dark:from-slate-50 dark:to-slate-400">
                      <div className="flex items-center rounded-full bg-transparent dark:bg-black/100 px-2">
                        <button
                          onClick={() => setSelected100g(Math.max(0, selected100g - 1))}
                          className="text-white px-1"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-white">{selected100g}</span>
                        <button
                          onClick={() => setSelected100g(Math.min(max100g, selected100g + 1))}
                          className="text-white px-1"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 50 g CARD --- */}
                <div className="w-[50vw] md:w-full relative rounded-2xl p-[2px] border dark:border:bg-gradient-to-r dark:from-lime-400/10 dark:to-lime-400/30 dark:hover:bg-gradient-to-r dark:hover:from-lime-400/10 dark:hover:to-lime-400/30">
                  <div className="flex items-center justify-between gap-4 bg-transparent rounded-2xl px-3 py-3">

                    {/* label + price */}
                    <div className="flex flex-col">
                      <span className="dark:text-white text-[#4D6A3F] font-medium text-base">50g</span>
                      <span className="dark:text-yellow-400 text-black font-medium text-sm">₹{product.mrp && product.mrp.length > 0 ? Math.round(product.mrp[0]) : 'N/A'}</span>
                    </div>

                    {/* qty pill */}
                    <div className="p-[1px] rounded-full bg-blend-color-burn bg-[#4D6A3F]/70 dark:bg-gradient-to-r dark:from-slate-50 dark:to-slate-400">
                      <div className="flex items-center rounded-full bg-transparent dark:bg-black/100 px-2">
                        <button
                          onClick={() => setSelected50g(Math.max(0, selected50g - 1))}
                          className="text-white px-1"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-white">{selected50g}</span>
                        <button
                          onClick={() => setSelected50g(Math.min(max50g, selected50g + 1))}
                          className="text-white px-1"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xl font-sans font-semibold">
              <span className="text-[#4D6A3F] dark:text-yellow-400 text-2xl font-heading">Subtotal :</span> ₹{
                product.mrp && product.mrp.length > 1
                  ? Math.round((selected50g * product.mrp[0]) + (selected100g * product.mrp[1]))
                  : ''
              }
            </p>
            <button
              className={`text-black dark:text-white font-button font-normal px-2 py-2 rounded-full border border-[#4D6A3F] dark:border-yellow-400 hover:brightness-125 transition duration-200 w-[50vw] md:w-[23vw] ${!canAddToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAddToCart}
              disabled={!canAddToCart}
            >
              Add to Cart
            </button>
          </div>

          {/* Delivery & Policy */}
          <div className="font-body mt-6 space-y-4 text-sm">
            <p>
              <span className="text-[#4D6A3F] dark:text-yellow-400 font-heading text-lg font-semibold">Delivery Info:</span>{' '}
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
      <div className="font-body max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold mb-2">Product Details</h2>
        <p className="text-[#4D6A3F] text-lg sm:text-xl dark:text-yellow-400 font-semibold">Ingredients</p>
        <p className="mb-2 text-base sm:text-lg">
          {product.ingredients && product.ingredients.length > 0 ? product.ingredients.join(', ') : 'N/A'}
        </p>
        <p className="text-[#4D6A3F] text-lg sm:text-xl dark:text-yellow-400 font-semibold mb-2">No Preservatives</p>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[#4D6A3F] text-lg sm:text-xl dark:text-yellow-400 font-semibold">Unit:</p>
          <span className="font-sans text-base sm:text-lg">
            {product.net_wt && product.net_wt.length > 0
              ? `${product.net_wt[0].value}${product.net_wt[0].unit}`
              : 'N/A'}
          </span>
        </div>
        <p className="text-[#4D6A3F] text-lg sm:text-xl dark:text-yellow-400 font-semibold">Why You'll Love It</p>
        <ul className="list-disc list-inside mb-2 text-base sm:text-lg">
          {product.why_you_will_love_it && product.why_you_will_love_it.length > 0 ? (
            product.why_you_will_love_it.map((item, idx) => <li key={idx}>{item}</li>)
          ) : (
            <li>Full of rich biryani aroma and taste</li>
          )}
        </ul>
        <p className="text-[#4D6A3F] text-lg sm:text-xl dark:text-yellow-400 font-semibold">How to Use (Simple Recipe)</p>
        <ol className="list-decimal list-inside mb-2 text-base sm:text-lg">
          {product.recipe && Array.isArray(product.recipe) && product.recipe.length > 0 ? (
            product.recipe.map((step, idx) => <li key={idx}>{step}</li>)
          ) : (
            <li>Use as per your taste and recipe.</li>
          )}
        </ol>
        <p><span className="text-[#4D6A3F] text-lg sm:text-xl dark:text-yellow-400 font-semibold">Shelf Life</span> <span className="font-sans text-base sm:text-lg">{product.best_before || '12 Months'}</span></p>
      </div>
    </div>
  );
};

export default ProductDetailPage;