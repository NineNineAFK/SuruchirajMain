require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product'); // adjust as per your project

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;  // Change to your actual URI
const BASE_IMAGE_URL = 'https://suruchiraj.com/images/products/'; // Your Hostinger image URL
const IMAGE_DIR = path.join(__dirname, 'images/products'); // The local path on your VPS where images are stored

async function mapProductImages() {
  try {
    // Connect to DB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to DB');

    // Get all products
    const products = await Product.find();
    console.log(`🔍 Found ${products.length} products`);

    // Read all image filenames in the directory
    const allImageFiles = fs.readdirSync(IMAGE_DIR);

    for (const product of products) {
      // Find image files that match the product slug
      const matchingImages = allImageFiles.filter(file =>
        file.startsWith(product.slug)
      );

      
      const imageUrls = matchingImages.map(file => `${BASE_IMAGE_URL}${file}`);

      // Update product's images array (adjust 'images' field name if yours is different)
      product.images = imageUrls;

      await product.save();
      console.log(`✅ Updated ${product.name} with ${imageUrls.length} image(s)`);
    }

    console.log('🎉 All products updated successfully');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
    await mongoose.disconnect();
  }
}

mapProductImages();
