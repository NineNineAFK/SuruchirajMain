import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface Feature {
  icon: string;
  text: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '/why choose us/I1.png',
    text: '100% Pure Ingredients',
    description: 'We use only the finest raw spices with no fillers or substitutes.',
  },
  {
    icon: '/why choose us/l2new.png',
    text: 'No Preservative',
    description: 'Our blends are 100% natural with no chemicals or preservatives.',
  },
  {
    icon: '/why choose us/I3new.png',
    text: 'Hygienic Packaging',
    description: 'Packed in clean, food-grade materials to retain freshness.',
  },
  {
    icon: '/why choose us/l4new.png',
    text: 'Traditional Blend',
    description: 'Time-tested recipes crafted by experts for authentic taste.',
  },
];

const WhyChooseUs: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="px-4 md:px-8 md:mt-10 text-center relative font-heading">
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-10 text-black dark:text-white">
        Why <span className="text-yellow-500 dark:text-yellow-400">Choose Us</span>
      </h2>

      {/* 🖥️ Desktop Layout */}
      <div className="hidden md:flex max-w-4xl mx-auto relative">
        <div className="flex backdrop-blur-md rounded-3xl p-6 md:p-5 items-center justify-between gap-4 border border-black/10 dark:border-white/20 shadow-md dark:shadow-[0_0_10px_rgba(255,255,255,0.3)] bg-white/60 dark:bg-transparent w-full z-10">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className="flex flex-col items-center text-black dark:text-white w-full md:w-1/4 font-body cursor-pointer"
            >
              <img
                src={feature.icon}
                className="h-20 w-20 object-contain mb-3 transition-transform duration-300 hover:scale-110"
                alt={feature.text}
              />
              <p className="text-sm md:text-base font-medium text-center">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Backdrop + Active Tile */}
        {activeIndex !== null && (
          <>
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 rounded-3xl"
              onClick={() => setActiveIndex(null)}
            />

            <div
              className="absolute top-1/2 left-1/2 z-40 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-white/20 backdrop-blur-md border border-black/10 dark:border-white/30 shadow-md dark:shadow-yellow-400/40 w-[60%] p-6 rounded-2xl text-black dark:text-white flex flex-col items-center transition-all duration-300 cursor-pointer"
              onClick={() => setActiveIndex(null)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(null);
                }}
                className="absolute top-2 right-2 text-black dark:text-white text-lg"
              >
                <FiX />
              </button>

              <img
                src={features[activeIndex].icon}
                className="h-24 w-24 object-contain mb-3"
                alt={features[activeIndex].text}
              />
              <p className="text-lg font-body font-semibold text-center">
                {features[activeIndex].text}
              </p>
              <p className="mt-2 text-sm text-black/80 dark:text-white/90 text-center font-body">
                {features[activeIndex].description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* 📱 Mobile Layout */}
      <div className="md:hidden relative grid grid-cols-2 gap-4 max-w-md mx-auto">
        {features.map((feature, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              onClick={() => setActiveIndex(isActive ? null : index)}
              className={`flex flex-col items-center justify-center text-black dark:text-white border border-black/10 dark:border-white/20 rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden ${
                isActive
                  ? 'absolute top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 dark:bg-white/20 shadow-md dark:shadow-yellow-400/40 w-[90%] p-6'
                  : 'p-4 bg-white/50 dark:bg-white/10 shadow-sm dark:shadow-[0_0_10px_rgba(255,255,255,0.2)]'
              }`}
            >
              {isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(null);
                  }}
                  className="absolute top-2 right-2 text-black dark:text-white text-lg"
                >
                  <FiX />
                </button>
              )}

              <img
                src={feature.icon}
                className={`object-contain mb-3 transition-all duration-300 ${
                  isActive ? 'h-24 w-24' : 'h-16 w-16'
                }`}
                alt={feature.text}
              />
              <p
                className={`font-normal font-body text-center transition-all duration-300 ${
                  isActive ? 'text-base' : 'text-sm'
                }`}
              >
                {feature.text}
              </p>

              {isActive && (
                <p className="mt-2 text-[12px] text-black/80 dark:text-white/90 text-center font-body">
                  {feature.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUs;
