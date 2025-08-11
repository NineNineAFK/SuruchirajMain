import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from "react-router-dom";

const MobileHeroSlide = ({
  image,
  heading,
  subheading,
  align,
  headingClass,
  subheadingClass,
  link, 
  cta
}: Slide) => {
  const navigate = useNavigate();

  return (
    <section
      className="relative h-[250px] md:hidden px-4 py-6 cursor-pointer"
      onClick={() => navigate(link)}
    >
      <div
        className="h-full w-full rounded-3xl overflow-hidden flex items-center shadow-lg"
        style={{
          background: `linear-gradient(to right, rgba(0,0,0,0.2) 10%, transparent 100%), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={`text-stone-200 p-4 w-full ${align === 'left' ? 'text-left' : 'text-right'}`}>
          {/* Heading */}
          {typeof heading === "string" ? (
            <h1 className={headingClass}>{heading}</h1>
          ) : (
            heading
          )}

          {/* Subheading */}
          {typeof subheading === "string" ? (
            <p className={subheadingClass}>{subheading}</p>
          ) : (
            subheading
          )}
          {cta && <div className="mt-2">{cta}</div>}
        </div>
      </div>
    </section>
  );
};

const DesktopHeroSlide = ({
  image,
  heading,
  subheading,
  align,
  headingClass,
  subheadingClass,
  cta,
  link
}: Slide) => {
  const navigate = useNavigate();

  return (
    <section
      className="relative hidden md:flex items-center w-full cursor-pointer"
      onClick={() => navigate(link)}
    >
      <img src={image} alt="" className="w-full h-auto object-contain" />
      <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none" />
      <div className={`absolute inset-0 flex items-center justify-${align === 'left' ? 'start' : 'end'} px-12`}>
        <div className={`text-white w-full ${align === 'left' ? 'text-left' : 'text-right'}`}>
          {/* Heading */}
          {typeof heading === "string" ? (
            <h1 className={headingClass}>{heading}</h1>
          ) : (
            heading
          )}

          {/* Subheading */}
          {typeof subheading === "string" ? (
            <p className={subheadingClass}>{subheading}</p>
          ) : (
            subheading
          )}
          {cta && <div className="mt-5">{cta}</div>}
        </div>
      </div>
    </section>
  );
};



// ✅ Slides data
type Slide = {
  image: string
  heading: React.ReactNode | string
  subheading: React.ReactNode | string
  headingClass?: string
  subheadingClass?: string
  align: 'left' | 'right';
  cta?: React.ReactNode
  link: string;
};


const slides: Slide[] = [
  {
    image: '/hero/Maharashtrian.webp',
    heading: (
      <div className="font-heading text-xl font-bold md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 leading-tight">
        <span className="block">The Soul of</span>
        <span className="block whitespace-nowrap">Maharashtra. Elevated.</span>
      </div>
    ),
    subheading: (
      <>
        <span className="block md:hidden whitespace-pre-line text-xs font-light">
          {"Experience Authentic CKP Flavors \nwith Suruchiraj Masala.."}
        </span>
        <span className="hidden md:block whitespace-pre-line text-3xl font-light">
          {"Experience Authentic CKP Flavors\nwith Suruchiraj Masala.."}
        </span>
      </>
    ),
    align: 'left' as const,
    headingClass: 'font-semibold md:text-6xl text-xl font-heading leading-tight',
    subheadingClass: 'md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className=" mt-2 bg-orange-300 hover:bg-orange-500 text-gray-800 font-semibold px-3 py-1.5 text-sm rounded-lg md:px-4 md:py-2 md:text-base">
        Shop Now
      </button>
    ),
    link: '/product/685d95f426012d91ad3aee72'
  },
  {
    image: '/hero/Veg.webp',
    heading: (
      <div className="font-heading text-xl font-bold md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-orange-500 to-red-400 leading-tight">
        <span className="block">Taste the Heart</span>
        <span className="block">of India. Naturally.</span>
      </div>
    ),
    subheading: (
      <>
        {/* Mobile version */}
        <span className="block md:hidden whitespace-pre-line text-xs font-light">
          {"Discover Suruchiraj’s Premium Blends for \nVegetarian Delights."}
        </span>

        {/* Desktop version */}
        <span className="hidden md:block whitespace-pre-line text-3xl font-light">
          {"Discover Suruchiraj’s Premium Blends\nfor Vegetarian Delights."}
        </span>
      </>
    ),
    align: 'right' as const,
    headingClass: 'font-bold md:text-6xl text-xl font-heading leading-tight',
    subheadingClass: ' md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className=" mt-2 bg-orange-700 hover:bg-orange-800 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-xl md:px-4 md:py-2 md:text-base">
        Shop Now
      </button>
    ),
    link: '/product/685d95f426012d91ad3aee9f'
  },

  {
    image: '/hero/American.webp',
    heading: (
      <div className="font-heading text-xl font-bold md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-red-500 leading-tight">
        <span className="block">Tangy Taste, Fiery Heart.</span>
      </div>
    ),
    subheading: (
      <>
        {/* Mobile version */}
        <span className="block md:hidden whitespace-pre-line text-xs font-light">
          {"Ignite Your Taste Buds with Suruchiraj \nPeri-Peri Spice Mix"}
        </span>

        {/* Desktop version */}
        <span className="hidden md:block whitespace-pre-line text-3xl font-light">
          {"Ignite Your Taste Buds with Suruchiraj\nPeri-Peri Spice Mix"}
        </span>
      </>
    ),
    align: 'right' as const,
    headingClass: 'font-bold md:text-6xl text-xl leading-tight font-heading',
    subheadingClass: ' md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className=" mt-2 bg-orange-900 hover:bg-orange-950 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-xl md:px-4 md:py-2 md:text-base">
        Get Peri-Peri Mix
      </button>
    ),
    link: '/product/685d95f426012d91ad3aee5a'
  },

  {
    image: '/hero/Lebanese.webp',
    heading: (
      <div className="font-heading text-xl font-bold md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-green-600 to-black leading-tight">
        <span className="block">Taste the</span>
        <span className="block">Mediterranean</span>
      </div>
    ),
    subheading: (
      <>
        {/* Mobile version */} 
        <span className="block md:hidden whitespace-pre-line text-xs font-light">
          {'Authentic Falafel Wraps Made\n Easy with Suruchiraj Spice Mix.'}
        </span>
        {/* Desktop version */}
        <span className="hidden md:block whitespace-pre-line text-3xl font-light">
          {'Authentic Falafel Wraps Made Easy \nwith Suruchiraj Spice Mix.'}
        </span>
      </>
    ),
    align: 'left' as const,
    headingClass: 'font-bold md:text-6xl text-xl font-heading leading-tight',
    subheadingClass: 'md:text-2xl text-xs mt-2',
    cta: (
      <button className=" mt-0 bg-red-700 hover:bg-red-800 text-gray-200 font-semibold px-2 py-1.5 text-sm rounded-md md:px-4 md:py-2 md:text-base">
        Shop Falafel Mix
      </button>
    ),
    link: '/product/685d95f426012d91ad3aee6f'
  },

  {
    image: '/hero/Chinese.webp',
    heading: (
      <div className="font-heading text-xl font-bold md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-green-600 leading-tight">
        <span className="block">Taste Asia’s</span>
        <span className="block">Signature Spice.</span>
      </div>
    ),
    subheading: (
      <>
        {/* Mobile version */}
        <span className="block md:hidden whitespace-pre-line text-xs font-light">
          {"Effortless Manchurian Masterpiece \nwith Suruchitaj Spice Mix."}
        </span>

        {/* Desktop version */}
        <span className="hidden md:block whitespace-pre-line text-3xl font-light">
          {"Effortless Manchurian Masterpiece \nwith Suruchitaj Spice Mix."}
        </span>
      </>
    ),
    align: 'right' as const,
    headingClass: 'font-bold md:text-6xl text-xl leading-tight font-heading',
    subheadingClass: ' md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className=" mt-0 bg-yellow-600 hover:bg-yellow-700 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-xl md:px-4 md:py-2 md:text-base">
        Shop Manchurian Mix
      </button>
    ),
    link: '/product/685d95f426012d91ad3aef0e'
  },

  {
    image: '/hero/Mexican.webp',
    heading: (
      <div className="font-heading text-xl font-bold md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-white to-red-600 leading-tight">
        <span className="block">Fiesta of Flavors.</span>
        <span className="block">Unleashed.</span>
      </div>
    ),
    subheading: (
      <>
        {/* Mobile version */}
        <span className="block md:hidden whitespace-pre-line text-xs font-light">
          {"Create Authentic Mexican Tacos \nwith Suruchiraj Spice Mix."}
        </span>

        {/* Desktop version */}
        <span className="hidden md:block whitespace-pre-line text-3xl font-light">
          {"Create Authentic Mexican Tacos\nwith Suruchiraj Spice Mix."}
        </span>
      </>
    ),
    align: 'right' as const,
    headingClass: 'font-bold md:text-6xl text-xl font-heading leading-tight',
    subheadingClass: ' md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-0 bg-red-600 hover:bg-red-700 text-gray-300 font-semibold px-3 py-1.5 text-sm rounded-lg md:px-4 md:py-2 md:text-base">
        Shop Now
      </button>
    ),
    link: '/product/685d95f426012d91ad3aeecf'
  },

  {
    image: '/hero/Misal.webp',
    heading: (
      <div className="font-heading text-xl font-bold md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-100 leading-tight">
        <span className="block">Authentic Misal Pav</span>
        <span className="block"></span>
      </div>
    ),
    subheading: (
      <>
        {/* Mobile version */}
        <span className="block md:hidden whitespace-pre-line text-xs font-light">
          {"Taste the Sificy Tradition \nof Maharashtra."}
        </span>

        {/* Desktop version */}
        <span className="hidden md:block whitespace-pre-line text-3xl font-light">
          {"Taste the Sificy Tradition\nof Maharashtra."}
        </span>
      </>
    ),
    align: 'right' as const,
    headingClass: 'font-bold md:text-6xl text-xl font-heading leading-tight',
    subheadingClass: ' md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className="mt-0 bg-yellow-700 hover:bg-yellow-800 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-lg md:px-4 md:py-2 md:text-base">
        Shop Misal Masala
      </button>
    ),
    link: '/product/685d95f426012d91ad3aee69'
  },

  {
    image: '/hero/Italian.webp',
    heading: (
      <div className="font-heading text-xl font-bold md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-red-600 to-red-600 leading-tight">
        <span className="block">Taste Italy’s Golden Slice.</span>
        <span className="block"></span>
      </div>
    ),
    subheading: (
      <>
        {/* Mobile version */}
        <span className="block md:hidden whitespace-pre-line text-xs font-light">
          {"Effortless Garlic Bread Perfection \nwith Suruchiraj Spice Mix."}
        </span>

        {/* Desktop version */}
        <span className="hidden md:block whitespace-pre-line text-3xl font-light">
          {"Effortless Garlic Bread Perfection\nwith Suruchiraj Spice Mix."}
        </span>
      </>
    ),
    align: 'left' as const,
    headingClass: 'font-bold md:text-6xl text-xl font-heading leading-tight',
    subheadingClass: ' md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className=" mt-2 bg-lime-600 hover:bg-lime-800 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-xl md:px-4 md:py-2 md:text-base">
        Get Italian Mix
      </button>
    ),
    link: '/product/685d95f426012d91ad3aef20'
  },

  {
    image: '/hero/Non-Veg.webp',
    heading: (
      <div className="font-heading text-xl font-bold md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-orange-700 via-yellow-400 to-rose-700 leading-tight">
        <span className="block">Unleash Bold</span>
        <span className="block">Non-Veg Flavors.</span>
      </div>
    ),
    subheading: (
      <>
        {/* Mobile version */}
        <span className="block md:hidden whitespace-pre-line text-xs font-light">
          {"Master Authentic Chicken Chettinad \nwith Suruchiraj Masala."}
        </span>

        {/* Desktop version */}
        <span className="hidden md:block whitespace-pre-line text-3xl font-light">
          {"Master Authentic Chicken Chettinad\nwith Suruchiraj Masala."}
        </span>
      </>
    ),
    align: 'left' as const,
    headingClass: 'font-bold md:text-6xl text-xl font-heading leading-tight',
    subheadingClass: ' md:text-2xl text-xs mt-2 font-light font-body whitespace-pre-line',
    cta: (
      <button className=" mt-2 bg-orange-800 hover:bg-orange-900 text-gray-200 font-semibold px-3 py-1.5 text-sm rounded-md md:px-4 md:py-2 md:text-base">
        Shop Now
      </button>
    ),
    link: '/product/685d95f426012d91ad3aee7b'
  },

];


// ✅ Hero Carousel Component
const HeroCarousel: React.FC = () => {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      //autoplay={{ delay: 7000 }}
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
