import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-east-side-100 dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      <div className="min-h-screen px-4 sm:px-8 py-10 max-w-5xl mx-auto font-body">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-east-side-900 dark:text-yellow-400 text-center mb-8">
          Privacy Policy
        </h1>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          At <strong className="text-text-east-side-900 dark:text-yellow-400">Suruchiraj Spices</strong>, your privacy is of utmost importance to us.
          This Privacy Policy outlines how we collect, use, maintain, and disclose information from users of our website.
        </p>

        <h2 className="text-xl font-semibold text-east-side-900 dark:text-yellow-400 mt-10 mb-2">Information We Collect</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We may collect personal identification information such as name, email address, mailing address, phone number, and credit card
          details, only when Users voluntarily submit them. Non-personal identification data like browser type and device info may also be
          collected automatically.
        </p>

        <h2 className="text-xl font-semibold text-east-side-900 dark:text-yellow-400 mt-10 mb-2">How We Use Collected Information</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li>To process transactions and deliver orders.</li>
          <li>To improve customer service and site functionality.</li>
          <li>To personalize user experience and communication.</li>
          <li>To send important emails, order updates, or promotional offers.</li>
          <li>To improve our products and services based on feedback.</li>
        </ul>

        <h2 className="text-xl font-semibold text-east-side-900 dark:text-yellow-400 mt-10 mb-2">How We Protect Your Information</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We adopt secure data practices including SSL encryption and PCI-compliant storage. Sensitive data is protected from unauthorized
          access or alteration.
        </p>

        <h2 className="text-xl font-semibold text-east-side-900 dark:text-yellow-400 mt-10 mb-2">Sharing Your Personal Information</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We do not sell, rent, or trade user data. We may share limited data with trusted third-party partners (e.g., shipping, newsletters)
          for specific services, and only with your permission.
        </p>

        <h2 className="text-xl font-semibold text-east-side-900 dark:text-yellow-400 mt-10 mb-2">Cookies and Tracking Technologies</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Our site may use cookies to enhance user experience. You may choose to disable cookies via your browser, but note that some features
          may not function properly.
        </p>

        <h2 className="text-xl font-semibold text-east-side-900 dark:text-yellow-400 mt-10 mb-2">Your Rights</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
          <li><span className="font-semibold">Access</span> – View the personal data we hold about you.</li>
          <li><span className="font-semibold">Rectification</span> – Request corrections to inaccurate data.</li>
          <li><span className="font-semibold">Erasure</span> – Request deletion of your personal data.</li>
          <li><span className="font-semibold">Object</span> – Object to data processing under certain conditions.</li>
          <li><span className="font-semibold">Withdraw Consent</span> – Revoke consent at any time.</li>
        </ul>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          To exercise your rights, please contact us using the details at the bottom of this page.
        </p>

        <h2 className="text-xl font-semibold text-east-side-900 dark:text-yellow-400 mt-10 mb-2">Changes to This Policy</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We may update this policy at any time. Users are encouraged to review it periodically. Continued use of the site
          after updates constitutes acceptance of the revised policy.
        </p>

        <h2 className="text-xl font-semibold text-east-side-900 dark:text-yellow-400 mt-10 mb-2">Your Acceptance of These Terms</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          By using this Site, you accept this policy. If you do not agree, please discontinue use. Continued use signifies
          your acceptance of any updates.
        </p>

        <h2 className="text-xl font-semibold text-east-side-900 dark:text-yellow-400 mt-10 mb-2">Contacting Us</h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-2">
          <p className="flex items-start gap-2">
            <FiMapPin className="text-east-side-900 dark:text-yellow-400 mt-1" />
            Suruchiraj Spices, Sarala Roses, Someshwarwadi Road, Near Hotel Rajwada, Pashan, Pune, Maharashtra-411008
          </p>
          <p className="flex items-center gap-2">
            <FiPhone className="text-east-side-900 dark:text-yellow-400" /><span className='font-sans'>9867604406</span>
          </p>
          <p className="flex items-center gap-2">
            <FiMail className="text-east-side-900 dark:text-yellow-400" /> support@suruchiraj.com
          </p>
          <p className="text-sm text-gray-500 italic">Website: www.suruchiraj.com</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
