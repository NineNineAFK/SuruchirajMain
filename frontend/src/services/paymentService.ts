const API_BASE_URL = import.meta.env.VITE_domainName;

export interface Order {
  _id: string;
  items: Array<{
    productName: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  deliveryAddress: {
    addressName: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  orderId: string;
  redirectUrl: string;
  merchantTransactionId: string;
}

// Create order and initiate payment
export const createOrderAndInitiatePayment = async (addressId: string): Promise<PaymentResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ addressId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }

    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get order status
export const getOrderStatus = async (orderId: string): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/order/${orderId}`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order status');
    }

    return data.order;
  } catch (error) {
    console.error('Error fetching order status:', error);
    throw error;
  }
};

// Get user's orders
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/orders`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return data.orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}; 