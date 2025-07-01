const Cart = require('../model/cart');

// Add to cart
const addToCart = async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        // Look up product details
        const Product = require('../model/product');
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const productName = product.product_name;
        const price = Array.isArray(product.mrp) && product.mrp.length > 0 ? product.mrp[0] : 0;
        const addQuantity = quantity && quantity > 0 ? quantity : 1;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create new cart if it doesn't exist
            cart = new Cart({
                userId,
                items: [{ product: productId, productName, price, quantity: addQuantity }],
                totalAmount: price * addQuantity
            });
        } else {
            // Check if item already exists in cart by product ObjectId
            const existingItem = cart.items.find(item => item.product && item.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity += addQuantity;
            } else {
                cart.items.push({ product: productId, productName, price, quantity: addQuantity });
            }
            // Recalculate total amount
            cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        await cart.save();

        res.status(200).json({ success: true, message: 'Item added to cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get cart
const getCart = async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.user._id;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [], totalAmount: 0 } });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update quantity
const updateQuantity = async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.user._id;
        const { productName, quantity } = req.body;

        if (!productName || quantity === undefined) {
            return res.status(400).json({ success: false, message: 'Product name and quantity are required' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.productName === productName);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items = cart.items.filter(item => item.productName !== productName);
        } else {
            item.quantity = quantity;
        }

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();

        res.status(200).json({ success: true, message: 'Cart updated', cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.user._id;
        const { productName } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productName !== productName);

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();

        res.status(200).json({ success: true, message: 'Item removed from cart', cart });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalAmount = 0;

        await cart.save();

        res.status(200).json({ success: true, message: 'Cart cleared', cart });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Render cart page
const renderCartPage = async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.user._id;
        const cart = await Cart.findOne({ userId });

        res.render('cart', { cart: cart || { items: [], totalAmount: 0 } });
    } catch (error) {
        console.error('Error rendering cart page:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    renderCartPage
}; 