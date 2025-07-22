const Product = require('../model/product');
const Order = require('../model/order');
const User = require('../model/user');

// Add a new product
const addProduct = async (req, res) => {
    try {
        const {
            name,
            category,
            price,
            weight,
            ingredients,
            recipe,
            nutritionValue,
            fileName,
            originalName,
            stock
        } = req.body;

        // Validate required fields
        if (!name || !category || !price || !weight || !ingredients || !recipe || !nutritionValue) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate nutrition values
        const { energy, fat, protein, carbohydrates, sugar } = nutritionValue;
        if (!energy || !fat || !protein || !carbohydrates || !sugar) {
            return res.status(400).json({ error: 'All nutrition values are required' });
        }

        // Create new product
        const product = new Product({
            name,
            category,
            price,
            weight,
            ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
            recipe,
            nutritionValue: {
                energy: Number(energy),
                fat: Number(fat),
                protein: Number(protein),
                carbohydrates: Number(carbohydrates),
                sugar: Number(sugar)
            },
            fileName: fileName || 'default.jpg',
            originalName: originalName || 'default.jpg',
            stock: stock || 0
        });

        const savedProduct = await product.save();
        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product: savedProduct
        });

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete product
        await Product.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid order status' });
        }
        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete order (admin)
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
}; 