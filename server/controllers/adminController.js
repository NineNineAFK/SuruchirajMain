const Product = require('../model/product');

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
            originalName
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
            originalName: originalName || 'default.jpg'
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

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct
}; 