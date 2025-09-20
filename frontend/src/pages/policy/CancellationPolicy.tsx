import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';


const CancellationPolicy: React.FC = () => {
  return (
    <div className="bg-east-side-100 dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-300">
      <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto font-body">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-[#4D6A3F] dark:text-yellow-400 text-center mb-8">
          Cancellation & Refund Policy
        </h1>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          At <strong className="text-black dark:text-white">Suruchiraj Spices</strong>, we believe in providing our customers with a seamless and satisfactory experience.
          We understand that sometimes plans change, and we aim to be as fair and transparent as possible with our cancellation
          and refund process.
        </p>

        <Section title="General Policy">
          Suruchiraj Spices upholds a liberal cancellation policy designed to assist our customers wherever possible. This policy
          outlines the conditions under which cancellations and refunds may be considered. By placing an order with us, you agree
          to the terms set forth in this policy.
        </Section>

        <Section title="Order Cancellation">
          <BulletList items={[
            `<strong class="text-black dark:text-white">Timely Requests:</strong> Cancellations must be requested on the same calendar day as the order (before 11:59 PM IST).`,
            `<strong class="text-black dark:text-white">Order Processing:</strong> If your order is already processed or dispatched, cancellation may not be possible.`,
            `<strong class="text-black dark:text-white">How to Cancel:</strong> Contact us at <em class="font-bold">support@suruchiraj.com</em> or <em class="font-bold font-sans">8390369630</em> with your order details.`
          ]} />
        </Section>

        <Section title="Refunds for Damaged or Defective Items">
          <BulletList items={[
            `<strong class="text-black dark:text-white">Reporting Damages:</strong> Report any damages on the same day of delivery (before 11:59 PM IST).`,
            `<strong class="text-black dark:text-white">Verification Process:</strong> We may request clear photos or videos of the damaged/defective item.`,
            `<strong class="text-black dark:text-white">Resolution:</strong> A refund or replacement will be processed based on product availability and your preference.`
          ]} />
        </Section>

        <Section title="Refunds for Product Discrepancies">
          <BulletList items={[
            `<strong class="text-black dark:text-white">Reporting Discrepancies:</strong> Notify us on the same calendar day of delivery.`,
            `<strong class="text-black dark:text-white">Review and Decision:</strong> We will assess the complaint and offer a fair resolution.`
          ]} />
        </Section>

        <Section title="Non-Cancellable/Non-Refundable Items">
          <BulletList items={[
            `<strong class="text-black dark:text-white">Perishable Goods:</strong> These cannot be cancelled or refunded unless quality concerns are reported.`,
            `<strong class="text-black dark:text-white">Quality Concerns:</strong> A refund or replacement can be considered if quality issues are evident.`
          ]} />
        </Section>

        <Section title="Manufacturer Warranties">
         For warranties related to items manufactured by entities other than Suruchiraj Spices, please contact the manufacturer directly.
          Suruchiraj Spices can assist in sharing their contact details.
        </Section>

        <Section title="Return Shipping Costs">
          If the return is due to our error (damaged/incorrect item), we will cover the return shipping.
          If it’s for other reasons (e.g., change of mind), no returns are encouraged.
        </Section>

        <Section title="Refund Processing Time">
          Approved refunds will be credited within 3-5 days.
          Replacements and Exchanges will be delivered within 7 days. depending on your payment provider.
        </Section>
           <Section title="Replacement & Exchanges">
          Replacement and exchanges if approved, will be delivered within 7 days depnding on the availability of the logistics partner.
        </Section>
        <Section title="Contact Information">
          For cancellation or refund assistance, reach out to us at:
          <div className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
            <p className="flex items-start gap-2">
              <FiMapPin className="text-[#4D6A3F] dark:text-yellow-400 mt-1" />
              Suruchiraj Spices, Sarala Roses, Someshwarwadi Road, Near Hotel Rajwada, Pashan, Pune, Maharashtra-411008
            </p>
            <p className="flex items-center gap-2">
              <FiPhone className="text-[#4D6A3F] dark:text-yellow-400" /> <span className="font-sans">8390369630</span>
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

export default CancellationPolicy;

// ⬇️ Optional helper components to keep code clean:
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-[#4D6A3F] dark:text-yellow-400 mt-8 mb-2">{title}</h2>
    <div className="text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="list-disc list-inside space-y-2">
    {items.map((item, idx) => (
      <li
        key={idx}
        className="text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: item }}
      />
    ))}
  </ul>
);
