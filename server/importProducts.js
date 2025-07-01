const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Product = require('./model/product');

// Update this if your connection string is different
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Aaditya:admin@cluster0.kxn151h.mongodb.net/d9';

async function importProducts() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const filePath = path.join(__dirname, '../suruchiraj_products_mongodb.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(data);

    if (!Array.isArray(products)) {
      throw new Error('JSON file must contain an array of products');
    }

    const result = await Product.insertMany(products, { ordered: false });
    console.log(`Imported ${result.length} products successfully!`);
  } catch (err) {
    console.error('Error importing products:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

importProducts(); 