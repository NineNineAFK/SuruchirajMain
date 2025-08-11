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

        if (!productId || productId === 'undefined' || qty_50g === undefined || qty_100g === undefined) {
            return res.status(400).json({ success: false, message: 'Product ID and quantities are required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const totalRequiredGrams = (qty_50g * 50) + (qty_100g * 100);
        const total_stock_gms = product.stock;
        const packaging_50gms = product.packaging_50gms;
        const packaging_100gms = product.packaging_100gms;

        if (totalRequiredGrams > total_stock_gms) {
            return res.status(400).json({ success: false, message: 'Not enough spice stock available' });
        }
        if (qty_50g > packaging_50gms) {
            return res.status(400).json({ success: false, message: `Only ${packaging_50gms} 50g pouches available` });
        }
        if (qty_100g > packaging_100gms) {
            return res.status(400).json({ success: false, message: `Only ${packaging_100gms} 100g pouches available` });
        }

        const productName = product.product_name;
        const price_50g = Array.isArray(product.mrp) && product.mrp.length > 0 ? Number(product.mrp[0]) || 0 : 0;
        const price_100g = Array.isArray(product.mrp) && product.mrp.length > 1 ? Number(product.mrp[1]) || 0 : 0;
        const totalQuantity = qty_50g + qty_100g;
        const totalAmount = (qty_50g * price_50g) + (qty_100g * price_100g);

        let cart = await Cart.findOne({ userId });

        const cartItem = {
            product: productId,
            productName,
            price_50g: typeof price_50g === 'number' ? price_50g : 0,
            price_100g: typeof price_100g === 'number' ? price_100g : 0,
            qty_50g,
            qty_100g,
            totalGrams: totalRequiredGrams,
            quantity: totalQuantity
        };

        if (!cart) {
            cart = new Cart({
                userId,
                items: [cartItem],
                totalAmount: totalAmount
            });
        } else {
            const existingItem = cart.items.find(item => item.product && item.product.toString() === productId);
            if (existingItem) {
                // REPLACE the values instead of adding
                existingItem.qty_50g = qty_50g;
                existingItem.qty_100g = qty_100g;
                existingItem.price_50g = Number(price_50g) || 0;
                existingItem.price_100g = Number(price_100g) || 0;
                existingItem.quantity = totalQuantity;
                existingItem.totalGrams = totalRequiredGrams;
            } else {
                cart.items.push(cartItem);
            }
            if (!cart.items || cart.items.length === 0) {
                cart.totalAmount = 0;
            } else {
                cart.totalAmount = cart.items.reduce((sum, item) => {
                    const price_50g = item.price_50g || 0;
                    const price_100g = item.price_100g || 0;
                    return sum + (item.qty_50g * price_50g) + (item.qty_100g * price_100g);
                }, 0);
            }
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

        // Ensure price_50g and price_100g are present and valid numbers for each item
        if (cart && cart.items && cart.items.length > 0) {
            cart.items = cart.items.map(item => ({
                ...item.toObject(),
                price_50g: typeof item.price_50g === 'number' ? item.price_50g : 0,
                price_100g: typeof item.price_100g === 'number' ? item.price_100g : 0
            }));
        }

        res.status(200).json({ success: true, cart: cart || { items: [], totalAmount: 0 } });
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

        if (!productId || productId === 'undefined' || qty_50g === undefined || qty_100g === undefined) {
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

        // Ensure price_50g and price_100g are present for legacy items
        if (cart.items && cart.items.length > 0) {
            for (const item of cart.items) {
                if (typeof item.price_50g !== 'number') item.price_50g = 0;
                if (typeof item.price_100g !== 'number') item.price_100g = 0;
            }
        }
        if (!cart.items || cart.items.length === 0) {
            cart.totalAmount = 0;
        } else {
            cart.totalAmount = cart.items.reduce((sum, item) => {
                const price_50g = item.price_50g || 0;
                const price_100g = item.price_100g || 0;
                return sum + (item.qty_50g * price_50g) + (item.qty_100g * price_100g);
            }, 0);
        }
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

        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }
        
        // Get initial items length to check if removal was successful
        const initialItemsCount = cart.items.length;
        
        // Filter items, checking both product reference and string ID
        // Filter items, checking both product reference and string ID
        const previousLength = cart.items.length;
        cart.items = cart.items.filter(item => {
            const itemProductId = item.product ? item.product.toString() : null;
            return itemProductId !== productId;
        });
        
        if (cart.items.length === previousLength) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

       // const initialItemsCount = cart.items.length;
        cart.items = cart.items.filter(item => item.product && item.product.toString() !== productId);
        
        if (cart.items.length === initialItemsCount) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        // Ensure price_50g and price_100g are present for legacy items
        if (cart.items && cart.items.length > 0) {
            for (const item of cart.items) {
                if (typeof item.price_50g !== 'number') item.price_50g = 0;
                if (typeof item.price_100g !== 'number') item.price_100g = 0;
            }
        }
        if (!cart.items || cart.items.length === 0) {
            cart.totalAmount = 0;
        } else {
            cart.totalAmount = cart.items.reduce((sum, item) => {
                const price_50g = item.price_50g || 0;
                const price_100g = item.price_100g || 0;
                return sum + (item.qty_50g * price_50g) + (item.qty_100g * price_100g);
            }, 0);
        }

        await cart.save();

        res.status(200).json({ success: true, message: 'Item removed from cart', cart });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Helper function to fetch cart data
const getCartData = async (req) => {
    if (!req.isAuthenticated() || !req.user || !req.user._id) {
        throw new Error('User not authenticated');
    }

    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });

    if (cart && cart.items && cart.items.length > 0) {
        cart.items = cart.items.map(item => ({
            ...item.toObject(),
            price_50g: typeof item.price_50g === 'number' ? item.price_50g : 0,
            price_100g: typeof item.price_100g === 'number' ? item.price_100g : 0
        }));
    }

    return cart || { items: [], totalAmount: 0 };
};

module.exports = {
    addToCart,
    getCart,
    updateQuantity,
    removeFromCart,
    getCartData
};
