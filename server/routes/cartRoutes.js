const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const paymentController = require('../controllers/paymentController');
const { restrictToLoggedInUserOnly } = require('../middlewares/auth');

// Cart page route
//router.get('/', restrictToLoggedInUserOnly, cartController.renderCartPage);
// Render cart page
router.get('/', restrictToLoggedInUserOnly, async (req, res) => {
    try {
        const cart = await cartController.getCartData(req);
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error rendering cart page:', error);
        res.status(500).send('Internal Server Error');
    }
});
// API routes for cart operations
router.post('/add-to-cart', restrictToLoggedInUserOnly, cartController.addToCart);
router.get('/cart', restrictToLoggedInUserOnly, cartController.getCart);
router.put('/update', restrictToLoggedInUserOnly, cartController.updateQuantity);
router.delete('/remove/:productId', restrictToLoggedInUserOnly, cartController.removeFromCart);
//router.delete('/api/cart/clear', restrictToLoggedInUserOnly, cartController.clearCart);

// Payment routes
router.post('/checkout', restrictToLoggedInUserOnly, paymentController.initiatePayment);

module.exports = router; 