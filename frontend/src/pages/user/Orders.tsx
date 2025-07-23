// src/pages/user/Orders.tsx
import React, { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import { toast } from 'react-hot-toast';

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

interface DeliveryAddress {
  addressName: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'N/A';
  createdAt: string;
  updatedAt: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await userApi.getOrders();
      setOrders(response.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'text-green-500';
      case 'pending':
      case 'confirmed':
        return 'text-yellow-500';
      case 'shipped':
        return 'text-blue-500';
      case 'failed':
      case 'cancelled':
        return 'text-red-500';
      case 'N/A':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    if (status === 'N/A') return 'N/A';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 dark:text-gray-200 text-black">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#4D6A3F]/10 dark:bg-black min-h-screen">
      <div className="max-w-6xl mx-auto py-10 px-4">
         <h1 className="text-4xl font-bold mb-6 font-heading text-black dark:text-white">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 font-body">
            <div className="text-gray-500 dark:text-gray-200 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 dark:text-gray-300">Start shopping to see your order history here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Orders List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => handleOrderClick(order)}
                  className="bg-gray-100 dark:bg-white/10 dark:backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-white/20 p-4 md:p-6 shadow-lg text-black dark:text-white max-w-3xl w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold font-sans text-black dark:text-gray-100">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-100 font-sans text-sm">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-black dark:text-gray-100 font-sans">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm font-sans text-black dark:text-gray-100">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium font-body text-black dark:text-gray-100">Payment:</span>
                      <span className={`text-sm font-body font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {getStatusText(order.paymentStatus)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium font-body text-black dark:text-gray-100">Delivery:</span>
                      <span className={`text-sm font-body font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-black dark:text-gray-100">
                          {item.productName} x {item.quantity}
                        </span>
                        <span className="text-black dark:text-gray-100 font-medium font-sans">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-black dark:text-gray-100 text-sm">
                        +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t dark:border-gray-200 border-gray-700">
                    <button>
                    <p className="dark:text-yellow-600 text-[#4D6A3F] text-sm font-semibold pointer-events-auto">
                      Click to view details →
                    </p>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-black font-body rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold font-heading dark:text-yellow-600 text-[#4D6A3F]">Order Details</h2>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-black dark:text-gray-100  hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Order Header */}
                <div className="bg-gray-100 dark:bg-black p-4 border border-gray-300 dark:border-white/20 rounded-2xl mb-6">
                  <div className="flex justify-between font-sans items-start">
                    <div>
                      <h3 className="text-lg font-sans font-semibold text-black dark:text-gray-100">
                        Order #{selectedOrder._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-100">
                        Placed on {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-sans text-gray-100">
                        ₹{selectedOrder.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-100 dark:bg-black p-4 border border-gray-300 dark:border-white/20 rounded-2xl">
                    <h4 className="font-semibold text-black dark:text-gray-100 mb-2">Payment Status</h4>
                    <span className={`text-sm font-medium ${getStatusColor(selectedOrder.paymentStatus)}`}>
                      {getStatusText(selectedOrder.paymentStatus)}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-black p-4 border border-gray-300 dark:border-white/20 rounded-2xl">
                    <h4 className="font-semibold text-black dark:text-gray-100 mb-2">Delivery Status</h4>
                    <span className={`text-sm font-medium ${getStatusColor(selectedOrder.orderStatus)}`}>
                      {getStatusText(selectedOrder.orderStatus)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-semibold dark:text-yellow-600 text-[#4D6A3F] mb-4">Order Items</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-white dark:bg-black">
                        <div>
                          <p className="font-medium text-black dark:text-gray-100">{item.productName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-100">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold font-sans text-black dark:text-gray-100">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6">
                  <h4 className="font-semibold dark:text-yellow-600 text-[#4D6A3F] mb-4">Delivery Address</h4>
                  <div className="bg-gray-100 dark:bg-black p-4 border border-gray-300 dark:border-white/20 rounded-2xl">
                    <p className="font-medium text-black dark:text-gray-100">{selectedOrder.deliveryAddress.name}</p>
                    <p className="text-black dark:text-gray-100 font-sans">{selectedOrder.deliveryAddress.phone}</p>
                    <p className="text-black dark:text-gray-100">{selectedOrder.deliveryAddress.addressLine1}</p>
                    {selectedOrder.deliveryAddress.addressLine2 && (
                      <p className="text-black dark:text-gray-100">{selectedOrder.deliveryAddress.addressLine2}</p>
                    )}
                    <p className="text-black dark:text-gray-100">
                      {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}
                    </p>
                  </div>
                </div>

                {/* Order Timeline */}
                <div>
                  <h4 className="font-semibold dark:text-yellow-600 text-[#4D6A3F] mb-4">Order Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-black dark:text-gray-100 font-medium">Order Placed</p>
                        <p className="text-black dark:text-gray-100 font-sans text-sm">{formatDate(selectedOrder.createdAt)}</p>
                      </div>
                    </div>
                    {selectedOrder.orderStatus !== 'pending' && selectedOrder.orderStatus !== 'N/A' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-black dark:text-gray-100 font-medium">Order Confirmed</p>
                          <p className="text-black dark:text-gray-100 font-sans text-sm">{formatDate(selectedOrder.updatedAt)}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.orderStatus === 'N/A' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <div>
                          <p className="text-black dark:text-gray-100 font-medium">Delivery Partner Not Integrated</p>
                          <p className="text-gray-500 dark:text-gray-100 text-sm">Delivery service will be available soon</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.orderStatus === 'shipped' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="text-black dark:text-gray-100 font-medium">Order Shipped</p>
                          <p className="text-gray-500 dark:text-gray-100 text-sm">In transit</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.orderStatus === 'delivered' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-black dark:text-gray-100 font-medium">Order Delivered</p>
                          <p className="text-black dark:text-gray-100  text-sm">Successfully delivered</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
