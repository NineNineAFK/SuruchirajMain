import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// ✅ Mobile Slide - Updated to use same props as desktop
const MobileHeroSlide = ({ image, heading, subheading }: { image: string; heading: React.ReactNode; subheading: string }) => (
  <section className="relative h-[250px] md:hidden px-4 py-6">
    <div
      className="h-full w-full rounded-3xl overflow-hidden flex shadow-lg"
      style={{
        background: `linear-gradient(to right, rgba(0,0,0,0.6) 40%, transparent 100%), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col justify-center pl-4 pr-3 text-white w-3/5 space-y-2">
        <h1 className="text-xl font-semibold font-heading leading-tight">
          {heading}
        </h1>
        <p className="text-[10px] text-white/80">{subheading}</p>
        <a
          href="#trending"
          className="self-start -ml-1 mt-2 inline-block px-2.5 py-1.5 text-white font-semibold font-button text-xs rounded-full 
            bg-gray-900 border border-white/10 shadow-md overflow-hidden group
            transition-transform duration-300 transform hover:scale-105"
        >
          <span className="relative z-10 font-button">Shop Now</span>
          <span
            className="absolute top-0 left-[-75%] w-[150%] h-full bg-gradient-to-r 
              from-transparent via-white/30 to-transparent opacity-0 
              group-hover:opacity-100 transition-opacity duration-200 
              pointer-events-none animate-none group-hover:animate-shine font-button"
          />
        </a>
      </div>
    </div>
  </section>
);

// ✅ Desktop Slide (unchanged)
const DesktopHeroSlide = ({ image, heading, subheading }: { image: string; heading: React.ReactNode; subheading: string }) => (
  <section
    className="relative bg-cover bg-center h-[550px] hidden md:flex items-center"
    style={{ backgroundImage: `url(${image})` }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-30" />

    <div className="relative container mx-auto px-6 z-10">
      <div className="max-w-xl text-left text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 font-heading">
          {heading}
        </h1>

        <p className="text-lg md:text-xl text-[#B8A8A8] mb-8 font-body">{subheading}</p>

        <a
          href="#trending"
          className="relative inline-block px-8 py-3 text-white font-semibold rounded-full 
            bg-gray-900 border border-white/10 shadow-md overflow-hidden group
            transition-transform duration-300 transform hover:scale-105 font-button"
        >
          <span className="relative z-10 font-button">Shop Now</span>
          <span
            className="absolute top-0 left-[-75%] w-[150%] h-full bg-gradient-to-r 
              from-transparent via-white/30 to-transparent opacity-0 
              group-hover:opacity-100 transition-opacity duration-200 
              pointer-events-none animate-none group-hover:animate-shine font-button"
          />
        </a>
      </div>
    </div>
  </section>
);

// ✅ Slides data
const slides = [
  {
    image: '/hero/indian-hero.png',
    heading: <>Explore India's <span className="text-[#F98C18]">Rich Flavors.</span></>,
    subheading: "Unlock authentic tastes with Suruchiraj's diverse masalas.",
  },
  {
    image: '/hero/chinese-hero.png',
    heading: <>Wok up your <span className="text-[#DCC79D]">Taste Buds!</span></>,
    subheading: 'Authentic Chinese flavors, made easy with Suruchiraj masalas.',
  },
  {
    image: '/hero/american-hero.png',
    heading: <>Your American <span className="text-[#FED48E]">Feast Awaits!</span></>,
    subheading: 'Effortlessly create iconic comfort food with Suruchiraj.',
  },
  {
    image: '/hero/biryani-hero.png',
    heading: <>Taste the soul of <span className="text-[#E88635]">Biryani.</span></>,
    subheading: 'Suruchiraj makes hearty meals unforgettable.',
  },
  {
    image: '/hero/italian-hero.png',
    heading: <>The essence of Italy. <span className="text-[#FCC971]">Simplified.</span></>,
    subheading: 'Achieve culinary excellence with Suruchiraj spices.',
  },
  {
    image: '/hero/thai-hero.png',
    heading: <>Vibrant Thai. <span className="text-palegold">Simply done.</span></>,
    subheading: 'Balance bold aromas with Suruchiraj spices.',
  },
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
