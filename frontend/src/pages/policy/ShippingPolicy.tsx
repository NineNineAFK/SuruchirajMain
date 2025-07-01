import React from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="min-h-screen px-4 sm:px-8 py-10 max-w-5xl mx-auto font-body">
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-yellow-400 text-center mb-8">
          Shipping and Delivery Policy
        </h1>

        <p className="mb-6 text-gray-300">
          At <span className="text-yellow-400 font-semibold">Suruchiraj Spices</span>, we're committed to getting our flavorful products to your doorstep efficiently. This policy outlines our shipping and delivery procedures, both domestically and internationally.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">1. Shipping Carriers</h2>
        <p className="mb-4 text-gray-300">
          <span className=" font-semibold">International Shipments:</span> For our valued international buyers, all orders are exclusively shipped and delivered through registered international courier companies and/or International Speed Post.
        </p>
        <p className="mb-4 text-gray-300">
          <span className=" font-semibold">Domestic Shipments:</span> For customers within India, orders are shipped via registered domestic courier companies and/or Speed Post only.
        </p>
        <p className="mb-4 text-gray-300">
          We carefully select reliable partners to ensure your spices arrive safely and on time.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">2. Order Processing and Dispatch</h2>
        <p className="mb-4 text-gray-300">
          <span className=" font-semibold">Dispatch Time:</span> Orders are typically dispatched within 0–7 business days from the date of order confirmation and payment. This timeline may vary if a specific delivery date has been mutually agreed upon at the time of order confirmation.
        </p>
        <p className="mb-4 text-gray-300">
          <span className=" font-semibold">Handover Guarantee:</span> Suruchiraj Spices guarantees to hand over your consignment to the chosen courier company or postal authorities within the stipulated 0–7 business days from the order and payment date, or as per the agreed delivery date.
        </p>
        <p className="mb-4 text-gray-300">
          <span className=" font-semibold">Delivery is Subject to Carrier Norms:</span> The final delivery of your shipment is subject to the norms and operational schedules of the respective courier company or postal authority.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">3. Delivery Liability and Address Accuracy</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
          <li>
            <span className=" font-semibold">Delivery Delays:</span> Suruchiraj Spices is not liable for courier company delays after dispatch.
          </li>
          <li>
            <span className=" font-semibold">Delivery Address:</span> It is the customer’s responsibility to provide an accurate and complete shipping address.
          </li>
          <li>
            <span className=" font-semibold">Incorrect Address:</span> Non-delivery or re-shipping due to wrong addresses will be at the customer’s expense.
          </li>
          <li>
            <span className=" font-semibold">Delivery Attempts:</span> If the parcel is unclaimed or returned after multiple delivery attempts, re-shipping costs may apply.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">4. International Shipments: Customs, Duties, and Taxes</h2>
        <p className="mb-4 text-gray-300">
          <span className=" font-semibold">Customer Responsibility:</span> Buyers are responsible for any customs duties, import taxes, or tariffs charged by the destination country.
        </p>
        <p className="mb-4 text-gray-300">
          <span className=" font-semibold">Customs Clearance:</span> Suruchiraj Spices is not responsible for delays caused by customs processes.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">5. Delivery Confirmation and Tracking</h2>
        <p className="mb-4 text-gray-300">
          <span className=" font-semibold">Service Confirmation:</span> After your order is dispatched, a confirmation email with tracking details (if available) will be sent to your registered email.
        </p>
        <p className="mb-4 text-gray-300">
          <span className=" font-semibold">Tracking:</span> You can use the provided tracking number to monitor your shipment’s progress on the carrier’s website.
        </p>

        <h2 className="text-2xl font-semibold text-yellow-400 mt-10 mb-2">6. Assistance and Support</h2>
        <p className="mb-4 text-gray-300">
          For any issues or queries regarding the utilization of our services, or for assistance with your shipment, please contact our helpdesk:
        </p>
        <p className="flex items-center gap-2">
          <FiPhone className="text-yellow-400" /><span className='font-sans'>8793796955</span>
        </p>
        <p className="flex items-center gap-2">
          <FiMail className="text-yellow-400" /> support@suruchiraj.com
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
