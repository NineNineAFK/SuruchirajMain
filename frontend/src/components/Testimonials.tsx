import React, { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import type { Swiper as SwiperType } from 'swiper/types';

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  image: string;
  rating: number;
}
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Anya Sharma',
    company: 'Facebook',
    text: ` Suruchiraj spices make my food look and taste amazing. They help me create beautiful dishes and get noticed for my cooking.`,
    image: '/userpp/anya.png',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rohan Patel',
    company: 'Facebook',
    text: `I love Suruchiraj's spices because they are healthy and pure. They help me make tasty, nutritious meals for my wellness journey.`,
    image: '/userpp/rohan.png',
    rating: 4,
  },
  {
    id: 3,
    name: 'Priya Krishnan',
    company: 'Facebook',
    text: `Suruchiraj spice blends save me so much time in the kitchen. My family and friends always love the delicious meals I make with them.`,
    image: '/userpp/priya.png',
    rating: 3,
  },
  {
    id: 4,
    name: 'Deepak Marathe',
    company: 'Instagram',
    text: `Suruchiraj helps me cook real dishes from around the world. I love learning about the history and culture of their unique spices.`,
    image: '/userpp/deepak.png',
    rating: 5,
  },
  {
    id: 5,
    name: 'Aisha Khan',
    company: 'Twitter',
    text: `Suruchiraj spices help me make traditional dishes that taste just like home. They are perfect for our family celebrations and keeping our traditions alive.`,
    image: '/userpp/Anamika.png',
    rating: 4,
  },
  {
    id: 6,
    name: 'Arjun Verma',
    company: 'Instagram',
    text: `Suruchiraj spices are cheap and make my simple meals taste great. It's easy to cook delicious food without spending a lot of money.`,
    image: '/userpp/arjun.png',
    rating: 4,
  },
  {
    id: 7,
    name: 'Shanti Kale',
    company: 'Facebook',
    text: `I trust Suruchiraj because their spices are good for the Earth and sourced fairly. They make it easy to cook in a way that matches my values.`,
    image: '/userpp/shanti.png',
    rating: 4,
  },
  {
    id: 8,
    name: 'Arjun Mehta',
    company: 'Facebook',
    text: ` Suruchiraj spices always deliver great flavor, which is perfect for my tech-driven cooking. They help me try new recipes and share my creations online.`,
    image: '/userpp/karan.png',
    rating: 4,
  },
  {
    id: 9,
    name: 'Lakshmi Menon',
    company: 'Facebook',
    text: ` Suruchiraj helps me explore the rich history of food through their authentic spices. It's like taking a journey into different cultures with every dish.`,
    image: '/userpp/lakshmi.png',
    rating: 4,
  },
  {
    id: 10,
    name: 'Gopal Singh',
    company: 'Facebook',
    text: `Cooking is fun with Suruchiraj because their spices are always good quality and easy to use. They make every meal a special and enjoyable experience.`,
    image: '/userpp/gopal.png',
    rating: 4,
  },
];


const Testimonials: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ FIX: State to track if the component has mounted on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
    // ✅ FIX: This effect runs only once on the client, after initial render
    setIsClient(true);
  }, []);

  return (
    <section className="md:-mt-1 px-4 md:px-8 text-center relative font-heading">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-10 text-black dark:text-white">
        What Our <span className="text-east-side-900 dark:text-yellow-400">Customers Say</span>
      </h2>

      {/* ✅ FIX: Conditionally render the Desktop Swiper only on the client */}
      {isClient && (
        <div className="relative max-w-6xl mx-auto hidden md:block">
          {/* Navigation Arrows */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute -left-14 top-1/2 transform -translate-y-1/2 z-20 bg-gray-100 dark:bg-white/20 text-black dark:text-white hover:bg-yellow-400 hover:text-black p-3 rounded-full transition"
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute -right-14 top-1/2 transform -translate-y-1/2 z-20 bg-gray-100 dark:bg-white/20 text-black dark:text-white hover:bg-yellow-400 hover:text-black p-3 rounded-full transition"
          >
            <FiChevronRight className="text-2xl" />
          </button>

          <Swiper
            onSwiper={(swiper: SwiperType) => {
              swiperRef.current = swiper;
              setActiveIndex(swiper.realIndex);
            }}
            onSlideChange={(swiper: { realIndex: React.SetStateAction<number>; }) => setActiveIndex(swiper.realIndex)}
            effect="coverflow"
            grabCursor
            centeredSlides
            loop
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              1024: { slidesPerView: 3, spaceBetween: 90 },
            }}
            initialSlide={Math.floor(testimonials.length / 2)}
            loopAdditionalSlides={3}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="pb-10"
          >
            {testimonials.map((t, index) => {
              const isActive = index === activeIndex;
              return (
                <SwiperSlide
                  key={t.id}
                  className={`h-[380px] flex flex-col justify-between rounded-xl 
                    p-6 text-left text-black dark:text-white border border-black/10 dark:border-white/30
                    shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500
                    ${
                      isActive
                        ? 'bg-east-side-600 dark:bg-gradient-to-br dark:from-[#2e0545] dark:to-[#541d7a] backdrop-blur-lg'
                        : 'bg-east-side-600/50 backdrop-blur-md blur-[5px] opacity-50 scale-[0.95]'
                    }`}
                >
                  <div>
                    <div className="text-6xl mb-2 mt-6 ml-2 text-yellow-400 leading-none font-body">❝</div>
                    <p className="text-lg leading-relaxed whitespace-pre-line font-body">
                      {t.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-start gap-2">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold ml-2 font-body">{t.name}</p>
                        <p className="text-sm dark:text-gray-300 text-gray-900 ml-2 font-body">{t.company}</p>
                        <div className="flex space-x-1 mt-1 ml-2">
                          {[...Array(5)].map((_, i) => (
                            <AiFillStar
                              key={i}
                              className={`${
                                i < t.rating ? 'text-yellow-400' : 'text-black dark:text-white'
                              } text-xl`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* ✅ FIX: Conditionally render the Mobile Swiper only on the client */}
      {isClient && (
        <div className="md:hidden">
          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            loop
            pagination={{ clickable: true }}
            modules={[Pagination]} // Simpler modules for mobile
            className="pb-10"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="bg-east-side-600 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/20 p-4 rounded-[40px] shadow-md backdrop-blur-md">
                  <div className="text-4xl mb-2 mt-4 ml-4 text-left text-yellow-400 leading-none font-body">❝</div>
                  <p className="text-base leading-relaxed whitespace-pre-line font-body">{t.text}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold font-body">{t.name}</p>
                      <p className="text-xs text-gray-300 font-body">{t.company}</p>
                      <div className="flex space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <AiFillStar
                            key={i}
                            className={`${i < t.rating ? 'text-yellow-400' : 'text-black dark:text-white'} text-sm`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </section>
  );
};

export default Testimonials;