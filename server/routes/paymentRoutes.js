const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuthenticated } = require('../middlewares/isAuthenticated');

// Public routes (no authentication required)
router.post('/api/payment/webhook', paymentController.handleWebhook);

// All other routes require authentication
router.use(isAuthenticated);

// Authenticated routes
router.post('/api/payment/create-order', paymentController.createOrderAndInitiatePayment);
router.get('/api/payment/order/:orderId', paymentController.getOrderStatus);
router.get('/api/payment/orders', paymentController.getUserOrders);

module.exports = router;