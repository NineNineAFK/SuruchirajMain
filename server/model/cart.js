// model/cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      price_50g: { type: Number, default: 0 },
      price_100g: { type: Number, default: 0 },
      quantity: { type: Number, default: 1 },
      qty_50g: { type: Number, default: 0 },
      qty_100g: { type: Number, default: 0 },
      totalGrams: { type: Number, default: 0 },
    },
  ],
  totalAmount: { type: Number, default: 0 },
});


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
