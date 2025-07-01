import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiMapPin, FiClock } from 'react-icons/fi';
import { getOrderStatus, type Order } from '../services/paymentService';
import toast from 'react-hot-toast';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  const merchantTransactionId = searchParams.get('merchantTransactionId');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const fetchPaymentStatus = async () => {
      if (!merchantTransactionId) {
        toast.error('Invalid payment response');
        navigate('/');
        return;
      }
      try {
        setLoading(true);
        // Poll the backend for payment status
        const res = await fetch(`/api/payment/check-status/${merchantTransactionId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!data.success || !data.order) {
          toast.error('Order not found');
          navigate('/');
          return;
        }
        setOrder(data.order);
        if (data.order.paymentStatus === 'completed') {
          setPolling(false);
          setLoading(false);
        } else if (data.order.paymentStatus === 'failed') {
          setPolling(false);
          navigate(`/payment/failure?merchantTransactionId=${merchantTransactionId}&transactionId=${transactionId}`);
        } else {
          setLoading(true);
        }
      } catch (error) {
        toast.error('Error checking payment status');
        setPolling(false);
        navigate('/');
      }
    };
    if (merchantTransactionId) {
      fetchPaymentStatus();
      interval = setInterval(() => {
        if (polling) fetchPaymentStatus();
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantTransactionId, polling]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FiPackage className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Order Status</p>
              <p className="text-sm text-gray-600">{order.orderStatus}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiClock className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Payment Status</p>
              <p className="text-sm text-green-600">{order.paymentStatus}</p>
            </div>
          </div>
          {merchantTransactionId && (
            <div>
              <p className="font-medium text-gray-900">Transaction ID</p>
              <p className="text-sm text-gray-600 font-mono">{merchantTransactionId}</p>
            </div>
          )}
          {transactionId && (
            <div>
              <p className="font-medium text-gray-900">PhonePe Transaction ID</p>
              <p className="text-sm text-gray-600 font-mono">{transactionId}</p>
            </div>
          )}
        </div>
        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• You'll receive an order confirmation email shortly</li>
            <li>• We'll start processing your order within 24 hours</li>
            <li>• You'll receive tracking information once your order ships</li>
            <li>• Estimated delivery: 3-5 business days</li>
          </ul>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/user/dashboard/orders')}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage; 