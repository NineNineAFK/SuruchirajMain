import React from 'react';
import WhyChooseUs from '../../components/WhyChooseUs';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutUs: React.FC = () => {
  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      once: true,     // Whether animation should happen only once
      offset: 100,    // Offset (in px) from the original trigger point
    });
  }, []);
  return (
    <div className="bg-east-side-100 dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300 py-10 px-6 sm:px-10 lg:px-20 font-body">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* --- Hero Section --- */}
        <section className="relative h-[350px] sm:h-[450px] rounded-lg overflow-hidden flex items-center justify-center text-center p-6 bg-cover bg-center" style={{ backgroundImage: "url('spices.png')" }}>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 space-y-4">
            <h1 className="text-white text-3xl sm:text-4xl font-heading font-bold">
              Welcome to <span className="text-yellow-400">Suruchiraj Spices</span>
            </h1>
            <p className="text-gray-200 text-lg sm:text-xl max-w-2xl mx-auto">
              where every sprinkle tells a story of tradition and health.
            </p>
            <button className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-md hover:bg-yellow-500 transition-colors">
              Explore Products
            </button>
          </div>
        </section>
        
        {/* --- Who Are We Section --- */}
        <section className="text-left">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Who Are <span className="text-[#4D6A3F] dark:text-yellow-400">We</span>
          </h2>
          <div className="max-w-3xl space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Suruchiraj Spices was born from the passion of Dr. Madhuri Gangrediwar — a scientist and home chef — who sought pure, flavorful, and healthy alternatives to store-bought spices. Starting in her own kitchen, she crafted unique blends using premium ingredients sourced from across India.
            </p>
            <p>
              Inspired by her daughter's longing for home-cooked flavors while abroad, Dr. Madhuri created travel-friendly mixes to share that authentic taste worldwide. With support from her husband and food industry expert Mr. Pradeep Gangrediwar, the brand officially launched in Pune in 2012.
            </p>
            <p>
              Today, Suruchiraj Spices offers 120+ handcrafted products across categories and is loved in India and countries like the USA, Singapore, Germany, and Jordan. Now led by the next generation, the brand continues to blend tradition with innovation.
            </p>
          </div>
        </section>

        {/* --- Our Philosophy Section --- */}
        <section className="space-y-8">
            <h2 className="text-left text-3xl sm:text-4xl font-heading font-bold">
                Our <span className="text-[#4D6A3F] dark:text-yellow-400">Philosophy</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {/* Purity Card */}
                <div className="flex flex-col items-center">
                    <div className="w-full h-48 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-4"></div>
                    <h3 className="text-2xl font-semibold mb-2">Purity</h3>
                    <p className="text-gray-700 dark:text-gray-300">Sourced from the best farms, our spices are 100% natural.</p>
                </div>
                {/* Aroma Card */}
                <div className="flex flex-col items-center">
                    <div className="w-full h-48 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-4"></div>
                    <h3 className="text-2xl font-semibold mb-2">Aroma</h3>
                    <p className="text-gray-700 dark:text-gray-300">Our unique blending process locks in the rich, natural aroma.</p>
                </div>
                {/* Taste Card */}
                <div className="flex flex-col items-center">
                    <div className="w-full h-48 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-4"></div>
                    <h3 className="text-2xl font-semibold mb-2">Taste</h3>
                    <p className="text-gray-700 dark:text-gray-300">Crafted to perfection for an authentic and unforgettable flavor.</p>
                </div>
            </div>
        </section>

        {/* --- What Makes Us Unique --- */}
        <section className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 space-y-4">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold">
                    What Makes Us <span className="text-[#4D6A3F] dark:text-yellow-400">Unique</span>
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <li><span className='font-semibold text-[#4D6A3F] dark:text-yellow-400'>Authentic Indian Recipes:</span> Crafted with traditional methods and modern expertise.</li>
                  <li><span className='font-semibold text-[#4D6A3F] dark:text-yellow-400'>Quality-Controlled:</span> From sourcing to packaging, every step ensures hygiene and consistency.
                  </li>
                  <li><span className='font-semibold text-[#4D6A3F] dark:text-yellow-400'>Global Reach, Local Heart:</span> Proudly rooted in Pune, available across the world.</li>
                  <li><span className='font-semibold text-[#4D6A3F] dark:text-yellow-400'>Customer First:</span> We value every customer's trust and strive to exceed expectations in taste and service.</li>
                </ul>
            </div>
            <div className="w-full lg:w-1/2 h-80 bg-gray-200 dark:bg-zinc-800 rounded-lg">
                {/* Placeholder for an image */}
            </div>
        </section>

        {/* --- Our Commitment --- */}
        <section className="text-center">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
                Our <span className="text-[#4D6A3F] dark:text-yellow-400">Commitment</span>
            </h2>
            <p className="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed">
                We are committed to quality, transparency, and customer satisfaction. Every pack of Suruchiraj Spices is a promise of good health and great taste. We strive to bring the authentic flavors of India to your kitchen, making every meal a celebration.
            </p>
            <p className="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Thank you for being a part of our journey.
            </p>
            <div className="mt-8 w-full h-64 bg-gray-200 dark:bg-zinc-800 rounded-lg">
                {/* Placeholder for a commitment-related image */}
            </div>
        </section>

        {/* --- Meet Our Founders --- */}
        <section className="space-y-8">
          <h2 className="text-center text-3xl sm:text-4xl font-heading font-bold">
            Meet our <span className="text-[#4D6A3F] dark:text-yellow-400">Founders</span>
          </h2>
          <div className="w-full h-80 bg-zinc-800/50 dark:bg-zinc-900 rounded-lg p-8 flex items-center justify-center">
            <p className="text-gray-400">Founder information and story will be displayed here.</p>
          </div>
        </section>

        {/* --- Why choose us --- */}
        <div className="mt-16">
          <WhyChooseUs />
        </div>

        {/* --- Contact Section --- */}
        <section className="space-y-3">
          <h3 className="text-3xl sm:text-4xl font-heading font-bold">
            Connect With <span className="text-[#4D6A3F] dark:text-yellow-400">Us</span>
          </h3>
          <div className="text-gray-700 dark:text-gray-300 space-y-2 pt-4">
            <p className="flex items-start gap-3">
              <FiMapPin className="text-[#4D6A3F] dark:text-yellow-400 mt-1 flex-shrink-0" size={20} />
              <span>Suruchiraj Spices, Sarala Roses, Someshwarwadi Road, Near Hotel Rajwada, Pashan, Pune, Maharashtra 411008</span>
            </p>
            <p className="flex items-center gap-3">
              <FiPhone className="text-[#4D6A3F] dark:text-yellow-400" size={20} /><span className="font-sans">9867604406</span>
            </p>
            <p className="flex items-center gap-3">
              <FiMail className="text-[#4D6A3F] dark:text-yellow-400" size={20} /> <span>support@suruchiraj.com</span>
            </p>
            <p className="text-sm text-gray-500 italic dark:text-gray-400 pt-2">Website: www.suruchiraj.com</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;