const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// const { restrictToLoggedInUserOnly } = require('../middlewares/auth'); // Temporarily commented out

// Admin routes for product management
// Temporarily removed authentication for testing
router.post('/addProduct', adminController.addProduct);
router.put('/updateProduct/:id', adminController.updateProduct);
router.delete('/deleteProduct/:id', adminController.deleteProduct);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);
router.delete('/orders/:orderId', adminController.deleteOrder);

module.exports = router; 