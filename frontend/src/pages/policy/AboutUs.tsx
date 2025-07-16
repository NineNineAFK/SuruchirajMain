import React from 'react';
import WhyChooseUs from '../../components/WhyChooseUs';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300 py-10 px-6 sm:px-10 lg:px-20 font-body">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* --- About Us Title --- */}
        <h1 className="text-left text-4xl sm:text-5xl font-heading font-bold mb-5">
          About <span className="text-yellow-600 dark:text-yellow-400">us</span>
        </h1>

        {/* --- Who Are We Section --- */}
        <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          {/* Image */}
          <div className="relative w-full lg:w-1/2">
            <div className="border-l-[16px] border-b-[16px] border-yellow-600 dark:border-yellow-400 w-fit">
              <img
                src="spices.png"
                alt="Spice jars"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-body font-bold">
              Who Are <span className="text-yellow-600 dark:text-yellow-400">We</span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We are Suruchiraj Spices – a family-driven Indian brand dedicated to delivering pure,
              authentic, and flavorful spice blends. Founded by Dr. Madhuri Gangrediwar out of
              love for home-cooked food and a passion for health, our journey began in Pune and now
              reaches kitchens across the globe.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At Suruchiraj, we combine tradition, science, and quality to bring you over 110+ 
              handcrafted spices that add aroma, taste, and purity to every dish.
            </p>
          </div>
        </section>

        {/* --- Meet Our Team --- */}
        <section className="space-y-8">
          <h2 className="text-left text-3xl sm:text-4xl font-bold">
            Meet our <span className="text-yellow-600 dark:text-yellow-400">team</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Zane Sorell',
                role: 'CEO',
                desc: 'Enjoys adventurous travel, seeks new cultures and offbeat destinations',
              },
              {
                name: 'Maya Mathy',
                role: 'Founder',
                desc: 'Pop music lover, seeks joy and exciting pop concerts',
              },
              {
                name: 'Alexis Jensen',
                role: 'CTO',
                desc: 'Bookworm, creative software developer with precision',
              },
              {
                name: 'Keira Battye',
                role: 'Product Designer',
                desc: 'Creative painter capturing beauty with imaginative artwork',
              },
              {
                name: 'Dominic Game',
                role: '3D Artist',
                desc: 'Football enthusiast, enjoys movie nights with friends',
              },
              {
                name: 'James Vial',
                role: 'Head of Front-End',
                desc: 'Culinary artist, explores diverse flavors, skilled in cooking',
              },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-4 shadow hover:shadow-xl transition-colors duration-300"
              >
                <img
                  src={`/images/team/${idx + 1}.jpg`}
                  alt={member.name}
                  className="w-full h-60 object-cover rounded-md mb-4"
                />
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-blue-500 dark:text-blue-400">{member.role}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{member.desc}</p>
                  {/* Icons row */}
                  <div className="flex gap-3 mt-3 text-gray-500 dark:text-gray-400 text-lg">
                    <i className="fab fa-linkedin"></i>
                    <i className="fab fa-github"></i>
                    <i className="fab fa-facebook"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Why choose us --- */}
        <div className="mt-16">
          <WhyChooseUs />
        </div>

        {/* --- Contact Section --- */}
        <section className="space-y-3">
          <h3 className="text-2xl font-semibold">
            Connect With <span className="text-yellow-600 dark:text-yellow-400">Us</span>
          </h3>
          <div className="text-gray-700 dark:text-gray-300 space-y-2">
            <p className="flex items-start gap-2">
              <FiMapPin className="text-yellow-600 dark:text-yellow-400 mt-1" />
              Suruchiraj Spices, Sarala Roses, Someshwarwadi Road, Near Hotel Rajwada, Pashan, Pune, Maharashtra 411008
            </p>
            <p className="flex items-center gap-2">
              <FiPhone className="text-yellow-600 dark:text-yellow-400" /><span className="font-sans">9867604406</span>
            </p>
            <p className="flex items-center gap-2">
              <FiMail className="text-yellow-600 dark:text-yellow-400" /> support@suruchiraj.com
            </p>
            <p className="text-sm text-gray-500 italic dark:text-gray-400">Website: www.suruchiraj.com</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
