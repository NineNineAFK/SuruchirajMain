import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Swiper as SwiperType } from 'swiper/types';
import { useNavigate } from 'react-router-dom';

import 'swiper/css';

interface Category {
  label: string;
  image: string;
  path: string;
}

const categories: Category[] = [
  { label: 'Veg', image: '/categories/veg fp.png', path: '/categories/veg' },
  { label: 'Non-Veg', image: '/categories/non veg fp.png', path: '/categories/nonveg' },
  { label: 'Maharashtrian', image: '/categories/Maharashtrian Veg fp.png', path: '/categories/maharashtrian' },
  { label: 'Beverages', image: '/categories/Beverage fp.png', path: '/categories/beverages' }, 
  { label: 'Snacks', image: '/categories/Snacks fp.png', path: '/categories/snacks' },
  { label: 'Soups', image: '/categories/soup fp.png', path: '/categories/soups' },
  { label: 'Rice Mixes', image: '/categories/Biryani fp.png', path: '/categories/biryani' },
  { label: 'South Indian', image: '/categories/south india fp.png', path: '/categories/southindian' },
  //{ label: 'Others', image: '/categories/Pickle fp.png', path: '/categories/pickle' },
];

const TopCategories: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const navigate = useNavigate();

  const handleSlideChange = () => {
    const swiper = swiperRef.current;
    if (swiper) {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    }
  };

  const handleCategoryClick = (label: string) => {
    navigate(`/sub-products?category=${encodeURIComponent(label)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <section id="categories" className="md:mt-8 px-4 py-4 md:px-8 md:pt-8 text-center relative font-heading dark:bg-transparent bg-[#3d4b58]">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-10 text-white dark:text-white">
        Top <span className="text-yellow-400 dark:text-yellow-400">Categories</span>
      </h2>

      {/* ✅ MOBILE LAYOUT */}
      <Swiper
        spaceBetween={16}
        slidesPerView={'auto'}
        className="md:hidden px-[1vw]"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index} style={{ width: '7rem' }}>
            <div
              onClick={() => handleCategoryClick(category.label)}
              className="relative mb-4 h-36 w-30 bg-[#B8C2B3] dark:bg-white/5 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/10 shadow-md cursor-pointer overflow-hidden"
            >
              <div className="absolute -top-[6vw] -left-[5vw] w-[32vw] h-[32vw] rounded-full overflow-hidden">
                <img
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-[1.5vw] w-full text-end px-[1.5vw] text-[4vw] font-semibold text-black dark:text-white font-body">
                {category.label}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ✅ DESKTOP LAYOUT */}
      <div className="relative max-w-5xl mx-auto overflow-visible hidden md:block">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={isBeginning}
          className={`hidden md:flex absolute -left-20 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full transition ${
            isBeginning
              ? 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 dark:bg-white/20 text-black dark:text-white dark:hover:bg-yellow-400 hover:text-black'
          }`}
        >
          <FiChevronLeft className="text-2xl" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          disabled={isEnd}
          className={`hidden md:flex absolute -right-20 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full transition ${
            isEnd
              ? 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 dark:bg-white/20 text-black dark:text-white dark:hover:bg-yellow-400 hover:text-black'
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
          spaceBetween={20}
          slidesPerGroup={1}
          grabCursor={false}
          loop={false}
          pagination={{ clickable: true }}
          navigation={false}
          modules={[Navigation, Pagination]}
          breakpoints={{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className="pb-10"
        >
          {categories.map((category, index) => (
            <SwiperSlide
              key={index}
              className="relative w-full overflow-visible transition-transform duration-300 hover:scale-[1.03]"
            >
              <div
                onClick={() => handleCategoryClick(category.label)}
                className="relative cursor-pointer mb-4 h-[240px] w-[180px] bg-[#B8C2B3] dark:bg-transparent backdrop-blur-md rounded-3xl overflow-hidden shadow-md border border-black/10 dark:border-white/10"
              >
                <div className="absolute -top-6 -left-10 w-52 h-52 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:opacity-100">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 right-4 text-black dark:text-white text-lg font-semibold font-body text-right opacity-90">
                  {category.label}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white/20 dark:via-white/5 dark:to-white/10 pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TopCategories;
