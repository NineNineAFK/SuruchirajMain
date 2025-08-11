const axios = require('axios');
const crypto = require('crypto');
const { BASE_URL, getToken } = require('../utils/phonepeClient');
const { v4: uuidv4 } = require('uuid');
const Cart = require('../model/cart'); // Import the Cart model
const Order = require('../model/order'); // Import the Order model

// Initiate Payment
initiatePayment = async (req, res) => {
  try {
    const { merchantOrderId: providedMerchantOrderId } = req.body;
    let { userId } = req.body;

    // Extract userId from req.user if not provided in the request body
    if (!userId && req.user) {
      userId = req.user._id;
    }

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Fetch totalAmount from the Cart model
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty or total amount is invalid',
      });
    }

    const amount = cart.totalAmount * 100; // Convert to paise

    // Generate merchantOrderId if not provided
    const merchantOrderId = providedMerchantOrderId || `ORDER_${uuidv4()}`;

    // Prepare the order data
    const orderData = {
      userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
      paymentDetails: {
        merchantTransactionId: merchantOrderId,
        status: 'pending',
        amount: cart.totalAmount,
        paymentMethod: 'PhonePe',
      },
      paymentStatus: 'pending',
    };

    // Save order to DB before payment initiation
    const order = new Order(orderData);
    await order.save();

    // Log request body for debugging
    console.log('Request Body:', req.body);

    const accessToken = await getToken();

    const paymentPayload = {
      merchantOrderId,
      amount: amount, // in paise
      paymentFlow: {
        type: 'PG_CHECKOUT',
        merchantUrls: { redirectUrl: `${process.env.MERCHANT_REDIRECT_URL}?merchantOrderId=${merchantOrderId}` },
      },
    };

    const payRes = await axios.post(`${BASE_URL}/checkout/v2/pay`, paymentPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`,
      },
    });

    res.json(payRes.data);
  } catch (error) {
    console.error('Payment API error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Payment initiation failed', details: error.response?.data || error.message });
  }
};

// Get Order Status
getOrderStatus = async (req, res) => {
  try {
    const { merchantOrderId } = req.params;
    const accessToken = await getToken();
    const statusRes = await axios.get(`${BASE_URL}/checkout/v2/order/${merchantOrderId}/status`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`
      }
    });
    res.json(statusRes.data);
  } catch (error) {
    console.error('Order Status API error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Order status check failed', details: error.response?.data || error.message });
  }
};

// Handle Webhook
phonepeWebhook = async (req, res) => {
  try {
    const authorizationHeader = req.headers['authorization'] || req.headers['Authorization'];
    const username = process.env.MERCHANT_USERNAME;
    const password = process.env.MERCHANT_PASSWORD;
    const computedHash = crypto.createHash('sha256')
      .update(`${username}:${password}`)
      .digest('hex');

    if (authorizationHeader !== computedHash) {
      console.error('Invalid webhook signature!');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload = req.body?.payload;
    // Handle payment status update based on payload.state
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook handling error:', error.message);
    res.status(500).json({ error: 'Webhook error' });
  }
};

// Initiate Refund
initiateRefund = async (req, res) => {
  try {
    const { merchantRefundId, originalMerchantOrderId, amount } = req.body;
    const accessToken = await getToken();
    const refundPayload = {
      merchantRefundId,
      originalMerchantOrderId,
      amount // in paise
    };
    const refundRes = await axios.post(`${BASE_URL}/payments/v2/refund`, refundPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`
      }
    });
    res.json(refundRes.data);
  } catch (error) {
    console.error('Refund API error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Refund initiation failed', details: error.response?.data || error.message });
  }
};

// Get Refund Status
getRefundStatus = async (req, res) => {
  try {
    const { merchantRefundId } = req.params;
    const accessToken = await getToken();
    const refundStatusRes = await axios.get(`${BASE_URL}/payments/v2/refund/${merchantRefundId}/status`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`
      }
    });
    res.json(refundStatusRes.data);
  } catch (error) {
    console.error('Refund Status API error:', error.response?.data || error.message);
    res.status(400).json({ error: 'Refund status check failed', details: error.response?.data || error.message });
  }
};

// Handle Redirect (B2: server sync first)
paymentRedirect = async (req, res) => {
  try {
    const { merchantOrderId } = req.query;
    if (!merchantOrderId) {
      return res.status(400).send('Missing merchantOrderId');
    }

    // 1) Poll PhonePe for the latest
    const accessToken = await getToken();
    const { data: statusData } = await axios.get(
      `${BASE_URL}/checkout/v2/order/${merchantOrderId}/status`,
      { headers: { 'Content-Type': 'application/json', 'Authorization': `O-Bearer ${accessToken}` } }
    );

    // 2) Map state
    const phonepeState = statusData.state; // COMPLETED | FAILED | PENDING
    const mapped =
      phonepeState === 'COMPLETED' ? 'completed' :
      phonepeState === 'FAILED'    ? 'failed'    : 'pending';

    // 3) Update your DB
    const order = await Order.findOneAndUpdate(
      { 'paymentDetails.merchantTransactionId': merchantOrderId },
      {
        $set: {
          'paymentDetails.status': mapped,
          paymentStatus: mapped,
          'paymentDetails.transactionId': statusData?.paymentDetails?.[0]?.transactionId || undefined,
          'paymentDetails.paymentMethod': statusData?.paymentDetails?.[0]?.paymentMode || 'PhonePe',
          'paymentDetails.paymentTimestamp': statusData?.paymentDetails?.[0]?.timestamp
            ? new Date(statusData.paymentDetails[0].timestamp)
            : undefined,
          'paymentDetails.errorMessage': statusData?.errorContext?.description || undefined,
        },
      },
      { new: true }
    );

    // If we didn't find it, still redirect (React will show a friendly message)
    if (!order) {
      console.warn('Order not found during redirect sync:', merchantOrderId);
    }

    // Optional: clear cart if paid
    if (order && mapped === 'completed') {
      await Cart.deleteOne({ userId: order.userId });
    }

    // 4) Redirect to frontend status page (no JSON here)
    const target = `${process.env.CLIENT_URL}/payment/status?merchantOrderId=${encodeURIComponent(merchantOrderId)}`;
    return res.redirect(302, target);

  } catch (error) {
    console.error('Redirect sync error:', error.response?.data || error.message);
    // Even if sync fails, still push user to status page; UI can retry/handle gracefully
    const fallback = `${process.env.CLIENT_URL}/payment/status?merchantOrderId=${encodeURIComponent(req.query.merchantOrderId || '')}&err=1`;
    return res.redirect(302, fallback);
  }
};


// Read order from DB only (used by React status page in B2)
getOrderFromDb = async (req, res) => {
  try {
    const { merchantOrderId } = req.params;
    if (!merchantOrderId) {
      return res.status(400).json({ success: false, message: 'merchantOrderId required' });
    }

    const order = await Order.findOne({ 'paymentDetails.merchantTransactionId': merchantOrderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (err) {
    console.error('getOrderFromDb error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};



module.exports = {
  initiatePayment,
  getOrderStatus,
  phonepeWebhook,
  initiateRefund,
  getRefundStatus,
   getOrderFromDb,
  paymentRedirect,
};
