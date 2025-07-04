import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="min-h-screen px-4 sm:px-8 py-10 max-w-5xl mx-auto font-body">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-yellow-400 text-center mb-8">
          Terms and Conditions
        </h1>

        <p className="mb-6 text-gray-300">
          Welcome to <span className="text-yellow-400 font-semibold">Suruchiraj Spices</span>! These Terms and Conditions outline the rules and regulations for the use of our website and the purchase of our products.
        </p>

        <p className="mb-6 text-gray-300">
          By accessing this website and/or purchasing from us, you agree to accept these terms in full. Do not continue to use our website if you do not accept all terms and conditions stated on this page.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">1. Definitions</h2>
        <p className="mb-4 text-gray-300">
          <strong>"We", "Us", "Our", "Suruchiraj Spices"</strong> refer to Suruchiraj Spices, a proprietorship company located at Pashan, Pune, Maharashtra.
        </p>
        <p className="mb-4 text-gray-300">
          <strong>"You", "User", "Visitor"</strong> refers to any person using the website or purchasing our products.
        </p>
        <p className="mb-4 text-gray-300">
          <strong>"Product(s)"</strong> are the items offered for sale by Suruchiraj Spices.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">2. General Conditions</h2>
        <p className="mb-4 text-gray-300">
          We may update these Terms anytime. You are responsible for reviewing changes. Continued use after changes implies acceptance.
        </p>
        <p className="mb-4 text-gray-300">
          Information on this site may contain inaccuracies. We exclude liability for such errors to the fullest extent allowed by law.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">3. Intellectual Property</h2>
        <p className="mb-4 text-gray-300">
          This website contains material owned by or licensed to us. Reproduction is prohibited without permission. Unauthorized use may result in claims or criminal offenses.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">4. External Links</h2>
        <p className="mb-4 text-gray-300">
          Links to external sites do not signify our endorsement. We are not responsible for content on those websites. You may not link to our site without prior consent.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">5. Product Information and Pricing</h2>
        <p className="mb-4 text-gray-300">
          While we strive for accuracy, product details or pricing errors may occur. If found, we’ll notify you and allow cancellation or confirmation at the correct price.
        </p>
        <p className="mb-4 text-gray-300">
          Prices include applicable taxes unless otherwise stated. Shipping costs will be shown at checkout.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">6. Order Acceptance and Payment</h2>
        <p className="mb-4 text-gray-300">
          We may refuse or cancel any order for reasons such as stock availability, pricing errors, or payment issues.
        </p>
        <p className="mb-4 text-gray-300">
          You agree to provide accurate purchase and account information. Payment methods are listed on our website.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">7. Limitation of Liability</h2>
        <p className="mb-4 text-gray-300">
          We are not liable for indirect, incidental, or consequential damages, including data loss or inability to access the site. Your use is at your own risk.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">8. Governing Law and Jurisdiction</h2>
        <p className="mb-4 text-gray-300">
          All disputes are governed by the laws of India. Jurisdiction for legal matters lies in Pune, Maharashtra.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">9. Disclaimer</h2>
        <p className="mb-4 text-gray-300">
          The site is provided "as is". We do not guarantee uninterrupted access or that all content is always accurate or complete.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">10. Contact Information</h2>
        <p className="mb-4 text-gray-300">
          If you have any questions about these Terms and Conditions, please contact us:
        </p>
          <div className="text-gray-300 space-y-2">
            <p className="flex items-start gap-2">
              <FiMapPin className="text-yellow-400 mt-1" />
              Suruchiraj Spices, Sarala Roses, Someshwarwadi Road, Near Hotel Rajwada, Pashan, Pune, Maharashtra-411008
            </p>
            <p className="flex items-center gap-2">
              <FiPhone className="text-yellow-400" /><span className='font-sans'>9867604406</span>
            </p>
            <p className="flex items-center gap-2">
              <FiMail className="text-yellow-400" /> support@suruchiraj.com
            </p>
            <p className="text-sm text-gray-500 italic">Website: www.suruchiraj.com</p>
          </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
