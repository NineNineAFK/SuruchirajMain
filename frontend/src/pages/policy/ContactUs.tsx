import React from 'react';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import axios from 'axios';

const ContactUs: React.FC = () => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name: (document.getElementById('name') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      message: (document.getElementById('message') as HTMLTextAreaElement).value,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_domainName}/api/queries`, formData);
      console.log('Form submitted successfully:', response.data);
      alert('Your message has been sent successfully!');
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-east-side-100 dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto font-body">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#4D6A3F] dark:text-yellow-400 text-center mb-8">
          Contact Us
        </h1>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We’d love to hear from you! Whether you have questions about our products, need help with an order, or want to share feedback — our team at <strong className="text-black dark:text-white">Suruchiraj Spices</strong> is here to assist.
        </p>

        <h2 className="text-xl font-semibold text-[#4D6A3F] dark:text-yellow-400 mt-8 mb-2">Customer Support</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Need help with your order or have a general query? Reach out to our friendly support team.
        </p>

        <h2 className="text-xl font-semibold text-[#4D6A3F] dark:text-yellow-400 mt-6 mb-2">✍️ Drop Us a Message</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">Name</label>
            <input id="name" type="text" className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-800 rounded text-black dark:text-white" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-800 rounded text-black dark:text-white" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="message">Message</label>
            <textarea id="message" rows={5} className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-800 rounded text-black dark:text-white" placeholder="How can we help?" />
          </div>
          <button type="submit" className="w-full dark:bg-yellow-400 bg-[#4D6A3F] text-black font-semibold py-2 rounded hover:bg-east-side-600 transition">
            Send Message
          </button>
        </form>

        <h2 className="text-xl font-semibold text-[#4D6A3F] dark:text-yellow-400 mt-6 mb-2">Business Inquiries</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Interested in collaborating, bulk orders, or becoming a distributor? We’d be glad to connect.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Please write to us at <span className="font-bold text-black dark:text-white">support@suruchiraj.com</span> with your proposal or query.
        </p>

        <h2 className="text-xl font-semibold text-[#4D6A3F] dark:text-yellow-400 mt-6 mb-2">Feedback & Suggestions</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We value your input. If you have ideas or suggestions to help us improve, don’t hesitate to let us know.
        </p>

        <h2 className="text-xl font-semibold text-[#4D6A3F] dark:text-yellow-400 mt-6 mb-2">Social Media</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Follow us for updates, offers, and spice stories:
        </p>
        <ul className="list-none space-y-3 text-gray-700 dark:text-gray-300 mb-6">
          <li className="flex items-center space-x-2">
            <FaInstagram className="text-[#4D6A3F] dark:text-yellow-400 text-lg" />
            <a
              href="https://instagram.com/suruchiraj"
              className="font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              @suruchiraj
            </a>
          </li>
          <li className="flex items-center space-x-2">
            <FaFacebookF className="text-[#4D6A3F] dark:text-yellow-400 text-lg" />
            <a
              href="https://facebook.com/suruchiraj"
              className="font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              /suruchiraj
            </a>
          </li>
          <li className="flex items-center space-x-2">
            <FaLinkedinIn className="text-[#4D6A3F] dark:text-yellow-400 text-lg" />
            <a
              href="https://linkedin.com/company/suruchiraj"
              className="font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              /suruchiraj
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-[#4D6A3F] dark:text-yellow-400 mt-6 mb-2">Our Office Address</h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-1 mb-6">
          <p><strong className="text-black dark:text-white">Suruchiraj Spices</strong></p>
          <p>Sarala Roses, Someshwarwadi Road,</p>
          <p>Near Hotel Rajwada, Pashan, Pune, Maharashtra 411008</p>
        </div>

        {/* Embedded Google Map */}
        <h2 className="text-xl font-semibold text-[#4D6A3F] dark:text-yellow-400 mt-6 mb-2">Our Location on Map</h2>
        <div className="mb-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.1612993030436!2d73.79956367515408!3d18.54704848255217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf1e05dcd209%3A0x8b26d38e13f412b!2sSarala%20Roses%2C%20Someshwarwadi%20Rd%2C%20Pashan%2C%20Pune%2C%20Maharashtra%20411008!5e0!3m2!1sen!2sin!4v1719383581476!5m2!1sen!2sin"
            width="100%"
            height="400"
            className="w-full rounded-lg border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
