import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const MobileHeroSlide = ({
  image,
  heading,
  subheading,
  align,
  headingClass,
  subheadingClass,
  cta,
}: {
  image: string;
  heading: React.ReactNode;
  subheading: React.ReactNode;
  align: 'left' | 'right';
  headingClass: string;
  subheadingClass: string;
  cta?: React.ReactNode;
}) => (
  <section className="relative h-[250px] md:hidden px-4 py-6">
    <div
      className="h-full w-full rounded-3xl overflow-hidden flex items-center shadow-lg"
      style={{
        background: `linear-gradient(to right, rgba(0,0,0,0.2) 10%, transparent 100%), url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`text-stone-200 p-4 w-full ${align === 'left' ? 'text-left' : 'text-right'}`}>
        <h2 className={`${headingClass}`}>{heading}</h2>
        <p className={`${subheadingClass} mt-1`}>{subheading}</p>
        {cta && <div className="mt-2">{cta}</div>}
      </div>
    </div>
  </section>
);


const DesktopHeroSlide = ({
  image,
  heading,
  subheading,
  align,
  headingClass,
  subheadingClass,
  cta,
}: {
  image: string;
  heading: React.ReactNode;
  subheading: React.ReactNode;
  align: 'left' | 'right';
  headingClass: string;
  subheadingClass: string;
  cta?: React.ReactNode;
}) => (
  <section className="relative h-[700px] hidden md:flex items-center overflow-hidden">
    <img
      src={image}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-10" />

    <div className={`relative z-10 px-12 w-full max-w-screen-xl mx-auto flex justify-${align === 'left' ? 'start' : 'end'}`}>
      <div className={`text-white max-w-md ${align === 'left' ? 'text-left' : 'text-right'}`}>
        <h1 className={`${headingClass}`}>{heading}</h1>
        <p className={`${subheadingClass} mt-4`}>{subheading}</p>
        {cta && <div className="mt-5">{cta}</div>}
      </div>
    </div>
  </section>
);


// ✅ Slides data
type Slide = {
  image: string;
  heading: string | React.ReactNode;
  subheading: string | React.ReactNode;
  align: 'left' | 'right';
  headingClass: string;
  subheadingClass: string;
  cta?: React.ReactNode;
};


const slides: Slide[] = [
  {
    image: '/hero/Maharashtrian.webp',
    heading: (
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-white to-green-600 leading-tight">
        <span className="block">The Soul of</span>
        <span className="block">Maharashtra.</span>
        <span className="block">Elevated</span>
      </h1>
    ),
    subheading: 'Experience Authentic \nCKP Flavors \nwith Suruchiraj Masala..',
    align: 'left' as const,
    headingClass: 'font-bold md:text-5xl text-xl font-heading leading-tight',
    subheadingClass: 'md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-2 bg-orange-300 hover:bg-orange-500 text-gray-800 font-semibold px-3 py-1.5 text-sm rounded-lg md:px-4 md:py-2 md:text-base">
        Shop Now
      </button>
    ),
  },
  {
    image: '/hero/Veg.webp',
    heading: (
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-orange-500 to-red-400 leading-tight">
        <span className="block">Taste the Heart</span>
        <span className="block">of India. Naturally.</span>
      </h1>
    ),
    subheading: 'Discover Suruchiraj’s \nPremium Blends for \nVegetarian Delights.',
    align: 'right' as const,
    headingClass: 'font-bold md:text-5xl text-xl font-heading leading-tight',
    subheadingClass: 'md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-2 bg-orange-700 hover:bg-orange-800 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-xl md:px-4 md:py-2 md:text-base">
        Shop Veg Spices
      </button>
    ),
  },

  {
    image: '/hero/American.webp',
    heading: (
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-red-500 leading-tight">
        <span className="block">American Taste,</span>
        <span className="block">Fiery Heart.</span>
      </h1>
    ),
    subheading: 'Ignite Your Taste Buds \nwith Suruchiraj \nPeri-Peri Spice Mix',
    align: 'right' as const,
    headingClass: 'font-bold md:text-5xl text-xl leading-tight font-heading',
    subheadingClass: 'md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-2 bg-orange-900 hover:bg-orange-950 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-xl md:px-4 md:py-2 md:text-base">
        Get Peri-Peri Mix
      </button>
    ),
  },

  {
    image: '/hero/Lebanese.webp',
    heading: (
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-black leading-tight">
        <span className="block">Taste the</span>
        <span className="block">Mediterranean</span>
      </h1>
    ),
    subheading: (
      <p className="text-stone-600 font-body font-light whitespace-pre-line">
        {'Authentic Falafel \nWraps Made \nEasy with \nSuruchiraj Spice Mix.'}
      </p>
    ),
    align: 'left' as const,
    headingClass: 'font-bold md:text-5xl text-xl font-heading leading-tight',
    subheadingClass: 'md:text-2xl text-xs mt-2',
    cta: (
      <button className="mt-0 bg-red-700 hover:bg-red-800 text-gray-200 font-semibold px-2 py-1.5 text-sm rounded-md md:px-4 md:py-2 md:text-base">
        Shop Falafel Mix
      </button>
    ),
  },

  {
    image: '/hero/Chinese.webp',
    heading: (
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-green-600 leading-tight">
        <span className="block">Taste Asia’s</span>
        <span className="block">Signature Spice.</span>
      </h1>
    ),
    subheading: 'Effortless \nManchurian Masterpiece \nwith Suruchitaj Spice Mix.',
    align: 'right' as const,
    headingClass: 'font-bold md:text-5xl text-xl leading-tight font-heading',
    subheadingClass: 'md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-0 bg-yellow-600 hover:bg-yellow-700 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-xl md:px-4 md:py-2 md:text-base">
        Shop Manchurian Mix
      </button>
    ),
  },

  {
    image: '/hero/Mexican.webp',
    heading: (
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-white to-red-600 leading-tight">
        <span className="block">Fiesta of Flavors.</span>
        <span className="block">Unleashed.</span>
      </h1>
    ),
    subheading: 'Create Authentic \nMexican Tacos \nwith Suruchiraj Spice Mix.',
    align: 'right' as const,
    headingClass: 'font-bold md:text-5xl text-xl font-heading leading-tight',
    subheadingClass: 'md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-0 bg-red-600 hover:bg-red-700 text-gray-300 font-semibold px-3 py-1.5 text-sm rounded-lg md:px-4 md:py-2 md:text-base">
        Get Mexican Spice
      </button>
    ),
  },

  {
    image: '/hero/Misal.webp',
    heading: (
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-100 leading-tight">
        <span className="block">Authentic</span>
        <span className="block">Misal Pav</span>
      </h1>
    ),
    subheading: 'Taste the Sificy \nTradition \nof Maharashtra.',
    align: 'right' as const,
    headingClass: 'font-bold md:text-5xl text-xl font-heading leading-tight',
    subheadingClass: 'md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-0 bg-yellow-700 hover:bg-yellow-800 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-lg md:px-4 md:py-2 md:text-base">
        Shop Misal Masala
      </button>
    ),
  },

  {
    image: '/hero/Italian.webp',
    heading: (
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-red-600 to-red-600 leading-tight">
        <span className="block">Taste Italy’s</span>
        <span className="block">Golden Slice.</span>
      </h1>
    ),
    subheading: 'Effortless Garlic \nBread Perfection \nwith Suruchiraj Spice Mix.',
    align: 'left' as const,
    headingClass: 'font-bold md:text-5xl text-xl font-heading leading-tight',
    subheadingClass: 'md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-2 bg-lime-600 hover:bg-lime-800 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-xl md:px-4 md:py-2 md:text-base">
        Get Italian Mix
      </button>
    ),
  },

  {
    image: '/hero/Non-Veg.webp',
    heading: (
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-700 via-yellow-400 to-rose-700 leading-tight">
        <span className="block">Unleash Bold</span>
        <span className="block">Non-Veg Flavors.</span>
      </h1>
    ),
    subheading: 'Master Authentic \nChicken Chettinad \nwith Suruchiraj Masala.',
    align: 'left' as const,
    headingClass: 'font-bold md:text-5xl text-xl font-heading leading-tight',
    subheadingClass: 'md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-2 bg-orange-800 hover:bg-orange-900 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-md md:px-4 md:py-2 md:text-base">
        Shop Chettinad Masala
      </button>
    ),
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
      pagination={{
        type: 'fraction',
        renderFraction: (currentClass:string, totalClass:string) => `
          <span class="${currentClass} dark:text-white text-black font-semibold text-xs"></span>
          /
          <span class="${totalClass} dark:text-white text-black font-semibold text-xs"></span>
        `,
      }}
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
