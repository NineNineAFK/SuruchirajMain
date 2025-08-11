// Get trending products (isVisible: true, trendingRank != null, sorted by trendingRank)
const getTrendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ isVisible: true, trendingRank: { $ne: null } })
            .sort({ trendingRank: 1 })
            .limit(10);
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching trending products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const Product = require('../model/product');


// New API endpoint to get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json({
            success: true,
            products: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// New API endpoint to get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// API to get unique categories and quantities
const getUniqueCategoriesAndQuantities = async (req, res) => {
  try {
    const products = await Product.find({});
    // Collect all categories
    const categorySet = new Set();
    const quantitySet = new Set();
    products.forEach(product => {
      // Categories
      if (Array.isArray(product.category)) {
        product.category.forEach(cat => categorySet.add(cat));
      } else if (product.category) {
        categorySet.add(product.category);
      }
      // Quantities
      if (Array.isArray(product.net_wt)) {
        product.net_wt.forEach(wt => {
          if (wt && wt.value && wt.unit) {
            quantitySet.add(`${wt.value} ${wt.unit}`);
          }
        });
      }
    });
    res.json({
      success: true,
      categories: Array.from(categorySet),
      quantities: Array.from(quantitySet)
    });
  } catch (error) {
    console.error('Error fetching unique categories/quantities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Render all products page
const renderProductsPage = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Render product details page
const renderProductDetailsPage = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('productDetails', { product });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    //name,
    getAllProducts,
    getProductById,
    getUniqueCategoriesAndQuantities,
    getTrendingProducts,
    renderProductsPage,
    renderProductDetailsPage
};