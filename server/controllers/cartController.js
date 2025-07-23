const Cart = require('../model/cart');
const Product = require('../model/product');

// Add to cart
const addToCart = async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userId = req.user._id;
        const { productId, qty_50g, qty_100g } = req.body;

        if (!productId || qty_50g === undefined || qty_100g === undefined) {
            return res.status(400).json({ success: false, message: 'Product ID and quantities are required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const totalRequiredGrams = (qty_50g * 50) + (qty_100g * 100);

        if (totalRequiredGrams > product.stock) {
            return res.status(400).json({ success: false, message: 'Not enough spice stock available' });
        }
        if (qty_50g > product.packaging_50gms) {
            return res.status(400).json({ success: false, message: `Only ${product.packaging_50gms} 50g pouches available` });
        }
        if (qty_100g > product.packaging_100gms) {
            return res.status(400).json({ success: false, message: `Only ${product.packaging_100gms} 100g pouches available` });
        }

        const productName = product.product_name;
        const price = Array.isArray(product.mrp) && product.mrp.length > 0 ? product.mrp[0] : 0;
        const totalQuantity = qty_50g + qty_100g;

        let cart = await Cart.findOne({ userId });

        const cartItem = {
            product: productId,
            productName,
            price,
            qty_50g,
            qty_100g,
            totalGrams: totalRequiredGrams,
            quantity: totalQuantity
        };

        if (!cart) {
            cart = new Cart({
                userId,
                items: [cartItem],
                totalAmount: price * totalQuantity
            });
        } else {
            const existingItem = cart.items.find(item => item.product && item.product.toString() === productId);
            if (existingItem) {
                // REPLACE the values instead of adding
                existingItem.qty_50g = qty_50g;
                existingItem.qty_100g = qty_100g;
                existingItem.quantity = totalQuantity;
                existingItem.totalGrams = totalRequiredGrams;
            } else {
                cart.items.push(cartItem);
            }
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

        res.status(200).json({ success: true, cart: cart || { items: [], totalAmount: 0 },  });
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
        const { productId, qty_50g, qty_100g } = req.body;

        if (!productId || qty_50g === undefined || qty_100g === undefined) {
            return res.status(400).json({ success: false, message: 'Product ID and new quantities are required' });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product && item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        const totalGrams = (qty_50g * 50) + (qty_100g * 100);
        const totalQty = qty_50g + qty_100g;

        if (totalQty <= 0) {
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
        } else {
            item.qty_50g = qty_50g;
            item.qty_100g = qty_100g;
            item.totalGrams = totalGrams;
            item.quantity = totalQty;
        }

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
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();

        res.status(200).json({ success: true, message: 'Item removed from cart', cart });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateQuantity,
    removeFromCart
};
