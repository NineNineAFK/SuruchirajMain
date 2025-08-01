const Order = require('../model/order');
const Cart = require('../model/cart');
const Address = require('../model/address');
const Product = require('../model/product');
const crypto = require('crypto');
const axios = require('axios');

// PhonePe API endpoints
const PHONEPE_API_URL = 'https://api.phonepe.com/apis/hermes';
const PHONEPE_PAY_API = '/pg/v1/pay';

// Helper function to generate PhonePe checksum
const generateChecksum = (payload, salt) => {
    const data = payload + '/pg/v1/pay' + salt;
    const checksum = crypto.createHash('sha256').update(data).digest('hex') + '###1';
    return checksum;
};

// Create order and initiate payment
const createOrderAndInitiatePayment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Get delivery address
        const address = await Address.findOne({ _id: addressId, userId });
        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Invalid delivery address'
            });
        }

        // Format cart items and calculate total
        const formattedItems = cart.items.map(item => ({
            productName: item.productName,
            price_50g: Number(item.price_50g),
            price_100g: Number(item.price_100g),
            qty_50g: Number(item.qty_50g) || 0,
            qty_100g: Number(item.qty_100g) || 0,
            totalGrams: item.totalGrams || 0
        }));

        // Calculate total amount with validation
        const totalAmount = formattedItems.reduce((sum, item) => {
            const itemTotal = (item.qty_50g * item.price_50g) + (item.qty_100g * item.price_100g);
            if (isNaN(itemTotal)) {
                throw new Error(`Invalid price or quantity for product: ${item.productName}`);
            }
            return sum + itemTotal;
        }, 0);

        if (isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid total amount calculated'
            });
        }

        // Create order
        const order = new Order({
            userId,
            items: formattedItems,
            totalAmount,
            deliveryAddress: {
                addressName: address.addressName,
                name: address.name,
                phone: address.phone,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
            },
            orderStatus: 'pending',
            paymentDetails: {
                status: 'pending',
                amount: totalAmount,
                merchantTransactionId: `ORDER_${Date.now()}_${userId}`,
            }
        });

        await order.save();

        // Create PhonePe payment payload
        const payload = {
            merchantId: process.env.PHONEPE_CLIENT_ID,
            merchantTransactionId: order.paymentDetails.merchantTransactionId,
            amount: totalAmount * 100, // Convert to paise
            redirectUrl: `${process.env.CLIENT_URL}/payment/status`,
            redirectMode: 'POST',
            callbackUrl: `${process.env.CLIENT_URL}/api/payment/webhook`,
            merchantUserId: userId.toString(),
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        // Generate checksum
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const checksum = generateChecksum(base64Payload, process.env.PHONEPE_CLIENT_SECRET);

        // Make request to PhonePe
        const response = await axios.post(`${PHONEPE_API_URL}${PHONEPE_PAY_API}`, {
            request: base64Payload
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            }
        });

        if (response.data.success) {
            // Update order with payment URL
            order.paymentDetails.status = 'processing';
            await order.save();

            res.status(200).json({
                success: true,
                paymentUrl: response.data.data.instrumentResponse.redirectInfo.url
            });
        } else {
            throw new Error('Payment initialization failed');
        }

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get order status
const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            order: {
                _id: order._id,
                items: order.items,
                totalAmount: order.totalAmount,
                deliveryAddress: order.deliveryAddress,
                orderStatus: order.orderStatus,
                createdAt: order.createdAt
            }
        });

    } catch (error) {
        console.error('Error fetching order status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .select('-phonepeTransactionId -phonepeMerchantTransactionId -phonepeResponseCode -phonepeResponseMessage -phonepePaymentInstrument -phonepeRedirectUrl -phonepeCallbackUrl');

        res.status(200).json({
            success: true,
            orders
        });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Handle PhonePe webhook
const handleWebhook = async (req, res) => {
    try {
        // Verify X-VERIFY header
        const incomingChecksum = req.headers['x-verify'];
        const payload = req.body;
        
        const generatedChecksum = generateChecksum(
            payload,
            process.env.PHONEPE_CLIENT_SECRET
        );

        if (incomingChecksum !== generatedChecksum) {
            throw new Error('Invalid webhook signature');
        }

        const {
            merchantTransactionId,
            transactionId,
            amount,
            paymentInstrument,
            responseCode
        } = payload;

        // Find and update order
        const order = await Order.findOne({
            'paymentDetails.merchantTransactionId': merchantTransactionId
        });

        if (!order) {
            throw new Error('Order not found');
        }

        // Update payment details
        order.paymentDetails = {
            ...order.paymentDetails,
            transactionId,
            status: responseCode === 'SUCCESS' ? 'completed' : 'failed',
            paymentMethod: paymentInstrument.type,
            paymentTimestamp: new Date(),
            errorMessage: responseCode === 'SUCCESS' ? null : payload.message
        };

        await order.save();

        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createOrderAndInitiatePayment,
    getOrderStatus,
    getUserOrders,
    handleWebhook
};