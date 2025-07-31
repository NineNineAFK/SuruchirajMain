import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentStatusPage: React.FC = () => {
    const [status, setStatus] = useState<'success' | 'failure' | 'pending'>('pending');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const merchantTransactionId = urlParams.get('merchantTransactionId');
        const transactionId = urlParams.get('transactionId');

        if (!merchantTransactionId) {
            setStatus('failure');
            setMessage('Invalid payment session');
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                const response = await axios.get(`/api/payment/order/${merchantTransactionId}`);
                if (response.data.success) {
                    const order = response.data.order;
                    setStatus(order.paymentDetails.status === 'completed' ? 'success' : 'failure');
                    setMessage(order.paymentDetails.status === 'completed' 
                        ? 'Payment successful! Your order has been confirmed.'
                        : order.paymentDetails.errorMessage || 'Payment failed. Please try again.');
                } else {
                    setStatus('failure');
                    setMessage('Could not verify payment status');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                setStatus('failure');
                setMessage('Could not verify payment status');
            }
        };

        checkPaymentStatus();
    }, [location]);

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleViewOrders = () => {
        navigate('/orders');
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="text-center">
                        {status === 'pending' && (
                            <div>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                                    Verifying Payment...
                                </h2>
                            </div>
                        )}
                        
                        {status === 'success' && (
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="mt-4 text-xl font-semibold text-gray-900">Payment Successful!</h2>
                            </div>
                        )}
                        
                        {status === 'failure' && (
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h2 className="mt-4 text-xl font-semibold text-gray-900">Payment Failed</h2>
                            </div>
                        )}
                        
                        <p className="mt-2 text-gray-600">{message}</p>
                        
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleContinueShopping}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Continue Shopping
                            </button>
                            
                            {status === 'success' && (
                                <button
                                    onClick={handleViewOrders}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-primary-light hover:bg-primary-lighter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    View Orders
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatusPage;
