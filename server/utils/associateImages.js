require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('../model/product'); // Adjusted path for utils folder

// Get Mongo URI from environment variable
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set in environment variables.');
  process.exit(1);
}
const IMAGE_DIR = '/var/www/SuruchirajMain/images/products'; // VPS image directory

// Utility to slugify product names and image filenames
function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function associateImages() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const products = await Product.find({});
  const allImageFiles = fs.readdirSync(IMAGE_DIR);

  for (const product of products) {
    const slug = slugify(product.product_name);
    // Find all images where the slugified filename starts with the product slug
    const images = allImageFiles.filter(file => {
      const baseName = file.replace(/\.[^/.]+$/, ""); // Remove extension
      return slugify(baseName).startsWith(slug);
    });
    product.images = images; // Just the filenames, or prepend with '/images/products/' if you want full URLs
    await product.save();
    console.log(`Updated ${product.product_name} (${slug}) with images:`, images);
  }

  mongoose.disconnect();
}

associateImages().catch(err => {
  console.error(err);
  mongoose.disconnect();
}); 