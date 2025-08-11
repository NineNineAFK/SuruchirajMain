import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

type UiStatus = 'success' | 'failure' | 'pending';

type OrderItem = {
  productName: string;
  qty_50g?: number;
  qty_100g?: number;
  totalGrams?: number;
};

type OrderResponse = {
  success: boolean;
  order?: {
    paymentDetails?: {
      merchantTransactionId?: string;
      status?: 'completed' | 'failed' | 'pending';
      paymentMethod?: string;
      amount?: number;
      paymentTimestamp?: string;
      transactionId?: string;
      errorMessage?: string;
    };
    _id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    paymentStatus: 'completed' | 'failed' | 'pending';
    orderStatus: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
};

const PaymentStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = useMemo(() => {
    // Ensure your .env contains: VITE_domainName=http://localhost:3000
    const url = import.meta.env.VITE_domainName as string | undefined;
    if (!url) {
      // Helpful console warning for local dev if the env var is missing
      console.warn(
        'VITE_domainName is not set. Set VITE_domainName=http://localhost:3000 in your frontend .env'
      );
    }
    return (url ?? '').replace(/\/+$/, ''); // trim trailing slash
  }, []);

  const [uiStatus, setUiStatus] = useState<UiStatus>('pending');
  const [message, setMessage] = useState('Verifying Payment...');
  const [merchantOrderId, setMerchantOrderId] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const merchantOrderIdFromQuery = urlParams.get('merchantOrderId');

    if (!merchantOrderIdFromQuery) {
      setUiStatus('failure');
      setMessage('Invalid payment session');
      return;
    }

    setMerchantOrderId(merchantOrderIdFromQuery);

    let cancelled = false;
    let retryTimer: number | undefined;

    const fetchOrderFromDB = async () => {
      try {
        const endpoint = `${API_BASE}/api/payment/order/db/${merchantOrderIdFromQuery}`;
        const { data } = await axios.get<OrderResponse>(endpoint, {
          withCredentials: true, // if you rely on cookies/session
        });

        if (cancelled) return;

        if (data.success && data.order) {
          const s = data.order.paymentStatus; // 'completed' | 'failed' | 'pending'
          const ui: UiStatus =
            s === 'completed' ? 'success' : s === 'failed' ? 'failure' : 'pending';

          setUiStatus(ui);
          setMessage(
            s === 'completed'
              ? 'Payment successful! Your order has been confirmed.'
              : s === 'failed'
              ? data.order.paymentDetails?.errorMessage || 'Payment failed. Please try again.'
              : 'Payment pending...'
          );
          setItems(data.order.items || []);
          setTotalAmount(data.order.totalAmount || 0);

          // Safety net: if somehow still pending, refetch once after 3s
          if (ui === 'pending') {
            retryTimer = window.setTimeout(fetchOrderFromDB, 3000);
          }
        } else {
          setUiStatus('failure');
          setMessage(data.message || 'Could not fetch order');
        }
      } catch (err) {
        console.error('Error loading order from DB:', err);
        setUiStatus('failure');
        setMessage('Could not fetch order');
      }
    };

    fetchOrderFromDB();

    return () => {
      cancelled = true;
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [API_BASE, location.search]);

  const handleContinueShopping = () => navigate('/');
  const handleViewOrders = () => navigate('/orders');

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="text-center">
            {uiStatus === 'pending' && (
              <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  Verifying Payment...
                </h2>
              </div>
            )}

            {uiStatus === 'success' && (
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">Payment Successful!</h2>
              </div>
            )}

            {uiStatus === 'failure' && (
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">Payment Status</h2>
              </div>
            )}

            <p className="mt-2 text-gray-600">{message}</p>

            {merchantOrderId && (
              <p className="mt-2 text-gray-800">
                Merchant Order ID: {merchantOrderId}
              </p>
            )}

            {items.length > 0 && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-900">Ordered Products:</h2>
                <ul className="mt-2 text-gray-700">
                  {items.map((item, index) => (
                    <li key={index} className="flex justify-between py-1">
                      <span>{item.productName}</span>
                      <span>
                        {(item.qty_50g ?? 0)} x 50g, {(item.qty_100g ?? 0)} x 100g
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-4 text-xl font-bold text-gray-900">
              Total Amount: ₹{totalAmount}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContinueShopping}
                className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Continue Shopping
              </button>

              {uiStatus === 'success' && (
                <button
                  onClick={handleViewOrders}
                  className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none"
                >
                  View Orders
                </button>
              )}
            </div>

            {/* Optional: tiny debug hint */}
            {!import.meta.env.VITE_domainName && (
              <p className="mt-4 text-xs text-red-500">
                Warning: VITE_domainName is not set; API calls may fail.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;
