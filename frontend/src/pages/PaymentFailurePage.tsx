import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiXCircle, FiRefreshCw, FiHome } from 'react-icons/fi';

const PaymentFailurePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const merchantTransactionId = searchParams.get('merchantTransactionId');
  const responseCode = searchParams.get('responseCode');
  const responseMessage = searchParams.get('responseMessage');

  const handleRetry = () => {
    // Navigate back to checkout to retry payment
    navigate('/checkout');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Failure Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FiXCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600">
            We're sorry, but your payment could not be processed. Please try again or contact support if the problem persists.
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
          
          <div className="space-y-4">
            {responseCode && (
              <div>
                <p className="font-medium text-gray-900">Response Code</p>
                <p className="text-sm text-red-600 font-mono">{responseCode}</p>
              </div>
            )}

            {responseMessage && (
              <div>
                <p className="font-medium text-gray-900">Error Message</p>
                <p className="text-sm text-gray-600">{responseMessage}</p>
              </div>
            )}

            {merchantTransactionId && (
              <div>
                <p className="font-medium text-gray-900">Transaction ID</p>
                <p className="text-sm text-gray-600 font-mono">{merchantTransactionId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-yellow-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Common Issues</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Insufficient funds in your account</li>
            <li>• Network connectivity issues</li>
            <li>• Payment gateway timeout</li>
            <li>• Invalid payment details</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleRetry}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition font-medium flex items-center justify-center gap-2"
          >
            <FiHome className="w-4 h-4" />
            Go Home
          </button>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@suruchiraj.com" className="text-blue-600 hover:text-blue-800">
              support@suruchiraj.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;