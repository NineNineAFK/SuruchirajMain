const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { restrictToLoggedInUserOnly } = require('../middlewares/auth');

// Cart page route
//router.get('/', restrictToLoggedInUserOnly, cartController.renderCartPage);

// API routes for cart operations
router.post('/add-to-cart', restrictToLoggedInUserOnly, cartController.addToCart);
router.get('/api/cart', restrictToLoggedInUserOnly, cartController.getCart);
router.put('/api/cart/update', restrictToLoggedInUserOnly, cartController.updateQuantity);
router.delete('/api/cart/remove/:productId', restrictToLoggedInUserOnly, cartController.removeFromCart);
//router.delete('/api/cart/clear', restrictToLoggedInUserOnly, cartController.clearCart);

module.exports = router; 