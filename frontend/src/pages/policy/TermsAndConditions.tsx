import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="bg-east-side-100 dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      <div className="min-h-screen px-4 sm:px-8 py-10 max-w-5xl mx-auto font-body">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#4D6A3F] dark:text-yellow-400 text-center mb-8">
          Terms and Conditions
        </h1>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Welcome to <span className="text-east-side-800 dark:text-yellow-400 font-semibold">Suruchiraj Spices</span>! These Terms and Conditions outline the rules and regulations for the use of our website and the purchase of our products.
        </p>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          By accessing this website and/or purchasing from us, you agree to accept these terms in full. Do not continue to use our website if you do not accept all terms and conditions stated on this page.
        </p>

        <Section title="Definitions">
          <p><strong>"We", "Us", "Our", "Suruchiraj Spices"</strong> refer to Suruchiraj Spices, a proprietorship company located at Pashan, Pune, Maharashtra.</p>
          <p><strong>"You", "User", "Visitor"</strong> refers to any person using the website or purchasing our products.</p>
          <p><strong>"Product(s)"</strong> are the items offered for sale by Suruchiraj Spices.</p>
        </Section>

        <Section title="General Conditions">
          <p>We may update these Terms anytime. You are responsible for reviewing changes. Continued use after changes implies acceptance.</p>
          <p>Information on this site may contain inaccuracies. We exclude liability for such errors to the fullest extent allowed by law.</p>
        </Section>

        <Section title="Intellectual Property">
          <p>This website contains material owned by or licensed to us. Reproduction is prohibited without permission. Unauthorized use may result in claims or criminal offenses.</p>
        </Section>

        <Section title="External Links">
          <p>Links to external sites do not signify our endorsement. We are not responsible for content on those websites. You may not link to our site without prior consent.</p>
        </Section>

        <Section title="Product Information and Pricing">
          <p>While we strive for accuracy, product details or pricing errors may occur. If found, we’ll notify you and allow cancellation or confirmation at the correct price.</p>
          <p>Prices include applicable taxes unless otherwise stated. Shipping costs will be shown at checkout.</p>
        </Section>

        <Section title="Order Acceptance and Payment">
          <p>We may refuse or cancel any order for reasons such as stock availability, pricing errors, or payment issues.</p>
          <p>You agree to provide accurate purchase and account information. Payment methods are listed on our website.</p>
        </Section>

        <Section title="Limitation of Liability">
          <p>We are not liable for indirect, incidental, or consequential damages, including data loss or inability to access the site. Your use is at your own risk.</p>
        </Section>

        <Section title="Governing Law and Jurisdiction">
          <p>All disputes are governed by the laws of India. Jurisdiction for legal matters lies in Pune, Maharashtra.</p>
        </Section>

        <Section title="Disclaimer">
          <p>The site is provided "as is". We do not guarantee uninterrupted access or that all content is always accurate or complete.</p>
        </Section>

        <Section title="Contact Information">
          <p>If you have any questions about these Terms and Conditions, please contact us:</p>
          <div className="text-gray-700 dark:text-gray-300 space-y-2 mt-2">
            <p className="flex items-start gap-2">
              <FiMapPin className="text-[#4D6A3F] dark:text-yellow-400 mt-1" />
              Suruchiraj Spices, Sarala Roses, Someshwarwadi Road, Near Hotel Rajwada, Pashan, Pune, Maharashtra-411008
            </p>
            <p className="flex items-center gap-2">
              <FiPhone className="text-[#4D6A3F] dark:text-yellow-400" /><span className="font-sans">8390369630</span>
            </p>
            <p className="flex items-center gap-2">
              <FiMail className="text-[#4D6A3F] dark:text-yellow-400" /> customercare@suruchiraj.com
            </p>
            <p className="text-sm text-gray-500 italic">Website: www.suruchiraj.com</p>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default TermsAndConditions;

// Optional helper for consistent sections
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-[#4D6A3F] dark:text-yellow-400 mt-10 mb-2">{title}</h2>
    <div className="space-y-2 text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);
