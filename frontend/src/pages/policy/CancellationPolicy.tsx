import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const CancellationPolicy: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
        <div className="min-h-screen bg-black text-white px-4 sm:px-8 py-10 max-w-5xl mx-auto font-body">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-yellow-400 text-center mb-8">
            Cancellation & Refund Policy
        </h1>

        <p className="mb-6 text-gray-300">
            At <strong className="text-white">Suruchiraj Spices</strong>, we believe in providing our customers with a seamless and satisfactory experience.
            We understand that sometimes plans change, and we aim to be as fair and transparent as possible with our cancellation
            and refund process.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-8 mb-2">1. General Policy</h2>
        <p className="mb-4 text-gray-300">
            Suruchiraj Spices upholds a liberal cancellation policy designed to assist our customers wherever possible. This policy
            outlines the conditions under which cancellations and refunds may be considered. By placing an order with us, you agree
            to the terms set forth in this policy.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-6 mb-2">2. Order Cancellation</h2>
        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
            <li><strong className="text-white">Timely Requests:</strong> Cancellations must be requested on the same calendar day as the order (before 11:59 PM IST).</li>
            <li><strong className="text-white">Order Processing:</strong> If your order is already processed or dispatched, cancellation may not be possible.</li>
            <li><strong className="text-white">How to Cancel:</strong> Contact us at <em className="font-bold">support@suruchiraj.com</em> or <em className="font-bold font-sans">9867604406</em> with your order details.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-6 mb-2">3. Refunds for Damaged or Defective Items</h2>
        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
            <li><strong className="text-white">Reporting Damages:</strong> Report any damages on the same day of delivery (before 11:59 PM IST).</li>
            <li><strong className="text-white">Verification Process:</strong> We may request clear photos or videos of the damaged/defective item.</li>
            <li><strong className="text-white">Resolution:</strong> A refund or replacement will be processed based on product availability and your preference.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-6 mb-2">4. Refunds for Product Discrepancies</h2>
        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
            <li><strong className="text-white">Reporting Discrepancies:</strong> Notify us on the same calendar day of delivery.</li>
            <li><strong className="text-white">Review and Decision:</strong> We will assess the complaint and offer a fair resolution.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-6 mb-2">5. Non-Cancellable/Non-Refundable Items</h2>
        <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
            <li><strong className="text-white">Perishable Goods:</strong> These cannot be cancelled or refunded unless quality concerns are reported.</li>
            <li><strong className="text-white">Quality Concerns:</strong> A refund or replacement can be considered if quality issues are evident.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-6 mb-2">6. Manufacturer Warranties</h2>
        <p className="mb-4 text-gray-300">
            For items with manufacturer warranties, please contact the manufacturer directly.
            Suruchiraj Spices can assist in sharing their contact details.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-6 mb-2">7. Return Shipping Costs</h2>
        <p className="mb-4 text-gray-300">
            If the return is due to our error (damaged/incorrect item), we will cover the return shipping.
            If it’s for other reasons (e.g., change of mind), the customer may bear the return cost.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-6 mb-2">8. Refund Processing Time</h2>
        <p className="mb-4 text-gray-300">
            Approved refunds will be processed on the same day.
            The refunded amount may take 5-7 business days to reflect, depending on your payment provider.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-6 mb-2">9. Contact Information</h2>
        <p className="mb-4 text-gray-300">
            For cancellation or refund assistance, reach out to us at:
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

export default CancellationPolicy;
