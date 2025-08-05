import React, { useRef, useState, useEffect } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
// import { useCart } from '../context/CartContext';
// import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/pagination';

import type { Product } from '../types/product.tsx';


import { getTrendingProducts } from '../services/productService';

// Only one TrendingMasalas component definition should exist. (If duplicate, remove the extra one.)

const TrendingMasalas: React.FC = () => {
  
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  // const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  // const { isWishlisted } = useWishlist();


  // Wishlist toggle logic removed (not used)


  const handleBuyNow = (product: Product) => {
    navigate(`/product/${product._id}`);
  };





  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const trending = await getTrendingProducts();
        setProducts(trending);
      } catch (err) {
        toast.error('Failed to load trending products');
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleSlideChange = () => {
    const swiper = swiperRef.current;
    if (swiper) {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    }
  };

  return (
    <section id="trending" className="px-4 md:px-8 text-center relative font-heading">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-10 text-black dark:text-white">
        Trending <span className="text-[#4D6A3F] dark:text-yellow-400">Masalas</span>
      </h2>
      <div className="relative max-w-6xl mx-auto overflow-visible">
      {/* Navigation Buttons - Desktop Only */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={isBeginning}
          className={`hidden md:flex absolute -left-14 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full transition ${
            isBeginning
              ? 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 dark:bg-white/20 text-black dark:text-white dark:hover:bg-yellow-400 hover:text-black'
          }`}
        >
          <FiChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          // disabled={isEnd}
          className={`hidden md:flex absolute -right-14 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full transition ${
            isEnd
              ? 'bg-gray-100 dark:bg-white/10 text-black'
              : 'bg-gray-100 dark:bg-white/10 text-black dark:text-white dark:hover:bg-yellow-400 hover:text-black'
          }`}
        >
          <FiChevronRight className="text-2xl" />
        </button>

      
        <Swiper
          onSwiper={(swiper: SwiperType) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
          spaceBetween={10}
          slidesPerGroup={1}
          grabCursor={false}
          loop={false}
          pagination={{ clickable: true }}
          navigation={false}
          modules={[Navigation, Pagination]}
          className="pb-10"
          breakpoints={{
            0: { slidesPerView: 3 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">No trending products found.</div>
          ) : products.map((product) => {
            // Removed cart/quantity logic
            // Prefer lifestyle shot, else first image
            const image = product.images && product.images.length > 0
              ? `https://suruchiraj.com/images/products/${product.images.find((img: string) => img.toLowerCase().includes('lifestyle shot')) || product.images[0]}`
              : '';
            return (
              <SwiperSlide
                key={product._id}
                className="relative w-full overflow-visible transition-transform duration-300 hover:scale-[1]"
              >
                {/* Mobile Version */}
                <div className="block md:hidden w-full max-w-[96vw] mx-auto">
                  <div className="relative w-full aspect-[3/4]">
                    {image && (
                      <div className="relative w-full h-full rounded-t-full overflow-hidden z-20">
                        <Link to={`/product/${product._id}`}>
                          <img src={image} alt={product.product_name} className="w-full h-[80%] object-cover drop-shadow-xl pointer-events-none" />
                        </Link>
                        <div
                          className="absolute top-[4vw] right-[4vw] z-10 cursor-pointer"
                        >
                          {/* <FiHeart
                            className={`text-[3vw] transition ${
                              isWishlisted(product._id) ? 'text-red-500 fill-red-500' : 'text-black dark:text-white'
                            }`}
                          /> */}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="-mt-[10vw] w-full bg-white/10 backdrop-blur-md border-l border-r border-b dark:border-[#6B0073]/60 border-lime-900 rounded-b-3xl px-[3vw] py-[4vw] text-black dark:text-white">
                    <div className="w-full mb-[1.5vw]">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-[3vw] font-semibold font-body truncate">
                          {product.product_name}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex justify-between items-center w-full mb-1">
                      <div className="text-[3vw] text-black dark:text-white font-sans">
                        ₹ <span className="font-semibold">{product.mrp && product.mrp[0]}</span>
                      </div>
                      {product.net_wt && product.net_wt.length > 0 && (
                        <span className="text-[2.5vw] dark:text-gray-200 text-gray-900 font-sans font-normal">{String(product.net_wt[0]?.value ?? '')} {product.net_wt[0]?.unit ?? ''}</span>
                      )}
                    </div>
                      {/* <div className="text-[2vw] bg-lime-400 text-black font-semibold px-[1.5vw] py-[0.5vw] rounded-full w-fit font-button">
                        {/* Discount calculation can be added if you have price and mrp 
                      </div> */}

                    <div className="w-full">
                      <button
                        onClick={() => handleBuyNow(product)}
                        className="w-full h-[7vw] bg-yellow-400 hover:bg-yellow-300 text-black font-semibold font-button rounded-full flex items-center justify-center text-[3.5vw] shadow-md transition-all duration-200 ease-in-out"
                      >
                        Buy Now
                      </button>
                      {/*
                        <div className="flex justify-between items-center w-full bg-yellow-400 text-black rounded-full px-[3vw] py-[1vw] text-[3.5vw] font-semibold font-button shadow-md">
                          <button onClick={() => handleDecrement(product._id)}><FiMinus /></button>
                          <span>{quantity}</span>
                          <button onClick={() => handleIncrement(product._id)}><FiPlus /></button>
                        </div>
                      */}
                    </div>
                  </div>
                </div>

                {/* Desktop Version */}
                <div className="hidden md:block">
                  <div className="absolute -top-0 inset-x-0 z-40 px-2 pointer-events-drag cursor-pointer">
                    <div className="relative">
                      <Link to={`/product/${product._id}`}>
                        <img src={image} alt={product.product_name} className="h-full w-full rounded-t-full object-fill pointer-events-none cursor-pointer" />
                      </Link>
                      <div
                        className="absolute top-1 right-2 z-50 cursor-pointer"
                      >
                        {/* <FiHeart
                          className={`text-xl transition ${
                            isWishlisted(product._id) ? 'text-red-500 fill-red-500' : 'text-black dark:text-white'
                          }`}
                        /> */}
                      </div>
                    </div>
                  </div>

                  <div className="mt-[200px] px-2 pt-0">
                    <div className="bg-transparent backdrop-blur-xl border-l border-r border-b dark:border-[#6B0073]/60 border-lime-900 rounded-b-3xl p-4 pb-5 text-black dark:text-white relative w-full">
                      <div className="mb-2 w-full">
                        <Link to={`/product/${product._id}`}>
                          <h3 className="text-base font-semibold font-body truncate flex justify-center gap-2">
                            {product.product_name}
                          </h3>
                          
                        </Link>
                      </div>
                      <div className="flex justify-between items-center w-full mb-1">
                        <div className="text-lg text-black dark:text-white font-sans">
                          ₹ <span className="font-semibold">{product.mrp && product.mrp[0]}</span>
                        </div>
                        {product.net_wt && product.net_wt.length > 0 && (
                          <span className="text-sm dark:text-gray-200 text-gray-900 font-sans font-normal">{String(product.net_wt[0]?.value ?? '')} {product.net_wt[0]?.unit ?? ''}</span>
                        )}
                      </div>

                      <div className="w-full">
                        <button
                          onClick={() => handleBuyNow(product)}
                          className="w-full bg-yellow-400 text-black px-3 py-1 text-sm rounded-full font-semibold hover:brightness-110 transition font-button"
                        >
                          Buy Now
                        </button>
                        {/*
                          <div className="flex justify-between items-center w-full bg-yellow-400 rounded-full px-4 py-1 text-black text-sm font-button">
                          <button onClick={() => handleDecrement(product._id)}><FiMinus /></button>
                          <span>{quantity}</span>
                          <button onClick={() => handleIncrement(product._id)}><FiPlus /></button>
                          </div>
                        */}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default TrendingMasalas;
