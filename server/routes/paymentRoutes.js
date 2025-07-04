const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuthenticated } = require('../middlewares/isAuthenticated');

// Public routes (no authentication)
router.post('/api/payment/callback', paymentController.handlePaymentCallback);
router.get('/api/payment/redirect', paymentController.handlePaymentRedirect);
router.get('/api/payment/mock-success', paymentController.handleMockPaymentSuccess);
router.get('/api/payment/test-qr', paymentController.getTestQRInfo);
router.get('/api/payment/check-status/:merchantOrderId', paymentController.checkPaymentStatus);

// All other routes require authentication
router.use(isAuthenticated);

// Authenticated routes
router.post('/api/payment/create-order', paymentController.createOrderAndInitiatePayment);
router.get('/api/payment/order/:orderId', paymentController.getOrderStatus);
router.get('/api/payment/orders', paymentController.getUserOrders);

module.exports = router; 