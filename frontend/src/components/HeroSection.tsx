import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from "react-router-dom";

// ✅ Mobile Slide - Updated to use same props as desktop
const MobileHeroSlide = ({ image, link }: { image: string; link: string }) => (
  <Link to={link}>
    <section className="relative h-[250px] md:hidden px-4 py-6">
      <div
        className="h-full w-full rounded-3xl overflow-hidden flex shadow-lg"
        style={{
          background: `url(${image})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
        }}
      >  
      </div>
    </section>
  </Link>
);

// ✅ Desktop Slide (unchanged)
const DesktopHeroSlide = ({ image, link }: { image: string; link: string }) => (
  <Link to={link}>
    <section
      className="relative bg-cover bg-center h-[670px] hidden md:flex items-center"
      style={{ backgroundImage: `url(${image})` }}
    >
    </section>
  </Link>
);

// ✅ Slides data
const slides = [
  {
    image: '/hero/fries1.webp',
    link: 'https://suruchiraj.com/product/685d95f426012d91ad3aee5a'
    // heading: <>Explore India's <span className="text-[#F98C18]">Rich Flavors.</span></>,
    // subheading: "Unlock authentic tastes with Suruchiraj's diverse masalas.",
  },
  {
    image: '/hero/chhole1.webp',
    link: 'https://suruchiraj.com/product/685d95f426012d91ad3aee63'
  //   heading: <>Wok up your <span className="text-[#DCC79D]">Taste Buds!</span></>,
  //   subheading: 'Authentic Chinese flavors, made easy with Suruchiraj masalas.',
  },
  {
    image: '/hero/samosa1.webp',
    link: 'https://suruchiraj.com/product/685d95f426012d91ad3aeefc'
  //   heading: <>Your American <span className="text-[#FED48E]">Feast Awaits!</span></>,
  //   subheading: 'Effortlessly create iconic comfort food with Suruchiraj.',
  },
  //{
  //  image: '/hero/paneer.png',
  //   heading: <>Taste the soul of <span className="text-[#E88635]">Biryani.</span></>,
  //   subheading: 'Suruchiraj makes hearty meals unforgettable.',
  //},
  //{
  //  image: '/hero/fries1.png',
  //   heading: <>The essence of Italy. <span className="text-[#FCC971]">Simplified.</span></>,
  //   subheading: 'Achieve culinary excellence with Suruchiraj spices.',
  //},
  // {
  //   image: '/hero/thai-hero.png',
  //   heading: <>Vibrant Thai. <span className="text-palegold">Simply done.</span></>,
  //   subheading: 'Balance bold aromas with Suruchiraj spices.',
  // },
];

// ✅ Hero Carousel Component
const HeroCarousel: React.FC = () => {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      autoplay={{ delay: 7000 }}
      loop
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <>
            <MobileHeroSlide {...slide} />
            <DesktopHeroSlide {...slide} />
          </>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousel;
