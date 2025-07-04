import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-black text-white min-h-screen py-10 px-6 sm:px-12 lg:px-20 font-body">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl sm:text-5xl font-heading font-bold text-yellow-400 text-center mb-8">
          About Us
        </h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Welcome to Suruchiraj Spices – where tradition meets taste, and every sprinkle tells a story.</h2>
        </section>

        <section className="space-y-3">
          <h3 className="text-2xl font-semibold text-yellow-400">Our Journey</h3>
          <p className="text-gray-300 leading-relaxed">
            Suruchiraj Spices is a proprietorship company born from a passion for authentic Indian flavors and a commitment to quality. Founded in Pune, Maharashtra, our journey began with a simple yet profound vision: to bring the richness and purity of home-ground spices to every kitchen, both locally and across the globe.
          </p>
          <p className="text-gray-300">
            We believe that the heart of good cooking lies in the quality of its ingredients, and spices are undoubtedly the soul of Indian cuisine.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-2xl font-semibold text-yellow-400">Our Philosophy: Purity, Aroma, Taste</h3>
          <ul className="list-disc ml-6 text-gray-300 space-y-2">
            <li>
              <strong className="text-white">Purity:</strong> We source the finest raw ingredients directly from trusted farms. No artificial colors, preservatives, or fillers—just 100% pure spice.
            </li>
            <li>
              <strong className="text-white">Aroma:</strong> Our grinding and packaging retain natural oils and aromas so every spice adds an authentic burst of fragrance to your dishes.
            </li>
            <li>
              <strong className="text-white">Taste:</strong> Our spice blends are crafted to deliver bold, unforgettable flavors that represent the heart of Indian cuisine.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-2xl font-semibold text-yellow-400">What Makes Us Unique</h3>
          <ul className="list-disc ml-6 text-gray-300 space-y-2">
            <li>Authentic Indian Flavors perfected through generations.</li>
            <li>Quality you can trust, monitored at every step.</li>
            <li>Local roots in Pune with a global online presence.</li>
            <li>Customer-centric approach with responsive service.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-2xl font-semibold text-yellow-400">Our Commitment</h3>
          <p className="text-gray-300 leading-relaxed">
            We aim to empower home cooks and chefs with premium spices that inspire creativity and joy in every meal. Our goal is to be your go-to destination for all things spice.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-2xl font-semibold text-yellow-400">Connect With Us</h3>
          <div className="text-gray-300 space-y-2">
            <p className="flex items-start gap-2">
              <FiMapPin className="text-yellow-400 mt-1" />
              Suruchiraj Spices, Sarala Roses, Someshwarwadi Road, Near Hotel Rajwada, Pashan, Pune, Maharashtra 411008
            </p>
            <p className="flex items-center gap-2">
              <FiPhone className="text-yellow-400" /><span className='font-sans'>9867604406</span>
            </p>
            <p className="flex items-center gap-2">
              <FiMail className="text-yellow-400" /> support@suruchiraj.com
            </p>
            <p className="text-sm text-gray-500 italic">Website: www.suruchiraj.com</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
