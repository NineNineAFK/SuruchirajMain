const Order = require('../model/order');
const Cart = require('../model/cart');
const Address = require('../model/address');
const phonepeService = require('../service/phonepeService');

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

        // Calculate total amount
        const totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order
        const order = new Order({
            userId,
            items: cart.items,
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
            paymentStatus: 'pending',
            orderStatus: 'pending'
        });

        await order.save();

        // Prepare order data for PhonePe
        const orderData = {
            userId: userId.toString(),
            totalAmount,
            deliveryAddress: order.deliveryAddress
        };

        // Initiate PhonePe payment
        const paymentResponse = await phonepeService.initiatePayment(orderData);

        // Update order with PhonePe details
        order.phonepeMerchantTransactionId = paymentResponse.merchantTransactionId;
        order.phonepeTransactionId = paymentResponse.transactionId;
        order.phonepeRedirectUrl = paymentResponse.redirectUrl;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order created and payment initiated',
            orderId: order._id,
            redirectUrl: paymentResponse.redirectUrl,
            merchantTransactionId: paymentResponse.merchantTransactionId
        });

    } catch (error) {
        console.error('Error creating order and initiating payment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// PhonePe callback handler
const handlePaymentCallback = async (req, res) => {
    try {
        const { merchantOrderId, transactionId, amount, responseCode, responseMessage, paymentInstrument } = req.body;

        // Find order by merchant transaction ID
        const order = await Order.findOne({ phonepeMerchantTransactionId: merchantOrderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order with payment details
        order.phonepeResponseCode = responseCode;
        order.phonepeResponseMessage = responseMessage;
        order.phonepePaymentInstrument = paymentInstrument;

        // Check payment status
        if (responseCode === 'PAYMENT_SUCCESS' || responseCode === 'SUCCESS') {
            order.paymentStatus = 'completed';
            order.orderStatus = 'N/A';
            
            // Clear user's cart after successful payment
            await Cart.findOneAndDelete({ userId: order.userId });
        } else {
            order.paymentStatus = 'failed';
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Payment callback processed successfully'
        });

    } catch (error) {
        console.error('Error processing payment callback:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Handle payment redirect (for frontend)
const handlePaymentRedirect = async (req, res) => {
    try {
        console.log('Payment Redirect - Query Parameters:', req.query);
        console.log('Payment Redirect - Body:', req.body);
        console.log('Payment Redirect - Headers:', req.headers);

        // PhonePe can send parameters in different ways, let's handle all possibilities
        const merchantOrderId = req.query.merchantOrderId || req.query.merchantTransactionId || req.query.orderId;
        const transactionId = req.query.transactionId || req.query.phonepeTransactionId;
        const responseCode = req.query.responseCode || req.query.code || req.query.status;
        const responseMessage = req.query.responseMessage || req.query.message || req.query.description;

        console.log('Extracted Parameters:', {
            merchantOrderId,
            transactionId,
            responseCode,
            responseMessage
        });

        // If no merchantOrderId is provided, this might be a direct redirect from PhonePe
        // In this case, we need to check the session or use a different approach
        if (!merchantOrderId) {
            // No merchantOrderId, cannot verify payment status
            return res.redirect('http://localhost:5173/payment/failure?error=missing_parameters');
        }

        // Find order by merchant transaction ID
        const order = await Order.findOne({ phonepeMerchantTransactionId: merchantOrderId });
        if (!order) {
            console.log('Order not found for merchantOrderId:', merchantOrderId);
            return res.redirect('http://localhost:5173/payment/failure?error=order_not_found');
        }

        console.log('Found Order:', {
            orderId: order._id,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus
        });

        // Update order with payment details
        order.phonepeResponseCode = responseCode;
        order.phonepeResponseMessage = responseMessage;
        order.phonepeTransactionId = transactionId;

        // Check payment status - PhonePe might send different status codes
        const successCodes = ['PAYMENT_SUCCESS', 'SUCCESS', 'COMPLETED', 'SUCCESSFUL'];
        // Only treat as success if responseCode is present and matches a success code
        const isSuccess = responseCode && successCodes.includes(responseCode.toUpperCase());

        console.log('Payment Status Check:', {
            responseCode,
            isSuccess,
            successCodes
        });

        if (isSuccess) {
            order.paymentStatus = 'completed';
            order.orderStatus = 'N/A';
            
            // Clear user's cart after successful payment
            await Cart.findOneAndDelete({ userId: order.userId });
            
            console.log('Payment Successful - Redirecting to success page');
            // Redirect to success page
            res.redirect(`http://localhost:5173/payment/success?merchantTransactionId=${merchantOrderId}&transactionId=${transactionId || 'TXN_' + Date.now()}`);
        } else {
            order.paymentStatus = 'failed';
            
            console.log('Payment Failed - Redirecting to failure page');
            // Redirect to failure page
            res.redirect(`http://localhost:5173/payment/failure?merchantTransactionId=${merchantOrderId}&transactionId=${transactionId}&responseCode=${responseCode}&responseMessage=${responseMessage}`);
        }

        await order.save();

    } catch (error) {
        console.error('Error handling payment redirect:', error);
        res.redirect('http://localhost:5173/payment/failure?error=server_error');
    }
};

// Mock payment success handler for development mode
const handleMockPaymentSuccess = async (req, res) => {
    try {
        const { merchantTransactionId } = req.query;

        // Find order by merchant transaction ID
        const order = await Order.findOne({ phonepeMerchantTransactionId: merchantTransactionId });
        if (!order) {
            return res.redirect('http://localhost:5173/payment/failure?error=order_not_found');
        }

        // Update order with mock payment success details
        order.paymentStatus = 'completed';
        order.orderStatus = 'N/A';
        order.phonepeResponseCode = 'PAYMENT_SUCCESS';
        order.phonepeResponseMessage = 'Mock payment successful';
        order.phonepeTransactionId = 'MOCK_TXN_' + Date.now();
        
        // Clear user's cart after successful payment
        await Cart.findOneAndDelete({ userId: order.userId });
        
        await order.save();

        // Redirect to success page
        res.redirect(`http://localhost:5173/payment/success?merchantTransactionId=${merchantTransactionId}&transactionId=${order.phonepeTransactionId}`);

    } catch (error) {
        console.error('Error processing mock payment success:', error);
        res.redirect('http://localhost:5173/payment/failure?error=server_error');
    }
};

// Get test QR information
const getTestQRInfo = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'PhonePe UAT Test Information',
            testCredentials: {
                upi: {
                    success: 'success@upi',
                    failure: 'failure@upi',
                    pending: 'pending@upi'
                },
                card: {
                    number: '4111 1111 1111 1111',
                    expiry: '12/25',
                    cvv: '123',
                    name: 'Test User'
                },
                netbanking: 'Use any test bank credentials'
            },
            instructions: [
                '1. Scan the QR code with any UPI app',
                '2. Use success@upi for successful payment',
                '3. Use failure@upi for failed payment',
                '4. Use pending@upi for pending payment',
                '5. Or use the test card details provided'
            ],
            environment: 'PhonePe UAT (User Acceptance Testing)',
            note: 'This is a test environment. No real money will be charged.'
        });
    } catch (error) {
        console.error('Error getting test QR info:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Check payment status using PhonePe SDK
const checkPaymentStatus = async (req, res) => {
    try {
        const { merchantOrderId } = req.params;
        const userId = req.user._id;

        console.log('Checking payment status for:', merchantOrderId);

        // Find order
        const order = await Order.findOne({ phonepeMerchantTransactionId: merchantOrderId, userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check status using PhonePe SDK
        const phonepeService = require('../service/phonepeService');
        const statusResponse = await phonepeService.verifyPayment(merchantOrderId);

        console.log('PhonePe Status Response:', statusResponse);

        // Update order with latest status
        if (statusResponse.success) {
            order.phonepeResponseCode = statusResponse.state;
            order.phonepeResponseMessage = statusResponse.message;

            if (statusResponse.state === 'PAYMENT_SUCCESS' || statusResponse.state === 'COMPLETED') {
                order.paymentStatus = 'completed';
                order.orderStatus = 'N/A';
                
                // Clear cart if payment is successful
                await Cart.findOneAndDelete({ userId: order.userId });
            } else if (statusResponse.state === 'PAYMENT_ERROR' || statusResponse.state === 'FAILED') {
                order.paymentStatus = 'failed';
            }

            await order.save();
        }

        res.status(200).json({
            success: true,
            order: {
                _id: order._id,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus,
                phonepeResponseCode: order.phonepeResponseCode,
                phonepeResponseMessage: order.phonepeResponseMessage,
                phonepeTransactionId: order.phonepeTransactionId
            },
            phonepeStatus: statusResponse
        });

    } catch (error) {
        console.error('Error checking payment status:', error);
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
                paymentStatus: order.paymentStatus,
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

module.exports = {
    createOrderAndInitiatePayment,
    handlePaymentCallback,
    handlePaymentRedirect,
    handleMockPaymentSuccess,
    getTestQRInfo,
    checkPaymentStatus,
    getOrderStatus,
    getUserOrders
}; 