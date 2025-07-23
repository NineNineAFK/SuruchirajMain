const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load environment variables
const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('../model/product');

// Get Mongo URI from environment variable
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set in environment variables.');
  process.exit(1);
}

const IMAGE_DIR = process.env.IMAGE_UPLOAD_DIR || path.join(__dirname, '../../images/products');
console.log('🗂️ Image directory being read from:', IMAGE_DIR);

// Utility to slugify product names and image filenames
function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

async function associateImages() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({});
    console.log(`📦 Total products found: ${products.length}`);

    const allImageFiles = fs.readdirSync(IMAGE_DIR);
    console.log(`🖼️ Total image files in folder: ${allImageFiles.length}`);

    for (const product of products) {
      const slug = slugify(product.product_name);
      const images = allImageFiles.filter(file => {
        const baseName = file.replace(/\.[^/.]+$/, ""); // Remove extension
        return slugify(baseName).startsWith(slug);
      });

      console.log(`🔍 ${product.product_name} → slug: "${slug}"`);
      console.log(`   Matching images: ${images.length > 0 ? images.join(', ') : 'None'}`);

      product.images = images;
      await product.save();

      if (images.length > 0) {
        console.log(`✅ Saved ${images.length} image(s) for "${product.product_name}"`);
      } else {
        console.log(`⚠️ No matching images found for "${product.product_name}"`);
      }
    }

    console.log('🎉 Done mapping all products.');
  } catch (err) {
    console.error('❌ Error in associateImages():', err);
  } finally {
    mongoose.disconnect();
  }
}

// Run only if file is executed directly
if (require.main === module) {
  associateImages();
}
