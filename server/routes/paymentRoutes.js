const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/initiate', paymentController.initiatePayment);
router.get('/status/:merchantOrderId', paymentController.getOrderStatus);
router.post('/webhook', express.json({ type: '*/*' }), paymentController.phonepeWebhook);
router.post('/refund', paymentController.initiateRefund);
router.get('/refund-status/:merchantRefundId', paymentController.getRefundStatus);
router.get('/order/db/:merchantOrderId', paymentController.getOrderFromDb);
router.get('/redirect', paymentController.paymentRedirect);
module.exports = router;
