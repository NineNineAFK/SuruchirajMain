import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentCheck: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const messageParam = searchParams.get('message');
    if (messageParam === 'redirect_received') {
      setMessage('Payment redirect received. Please check your recent orders below.');
      // You could also automatically fetch recent orders here
    }
  }, [searchParams]);

  const handleCheckRecentOrders = async () => {
    setLoading(true);
    try {
      // This would typically fetch user's recent orders
      // For now, we'll redirect to the orders page
      navigate('/user/orders');
    } catch (error) {
      console.error('Error checking orders:', error);
      setMessage('Error checking orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Status Check
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message || 'Please check your payment status below.'}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleCheckRecentOrders}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Recent Orders'}
            </button>

            <button
              onClick={handleGoHome}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Home
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              If you have any issues with your payment, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheck; 