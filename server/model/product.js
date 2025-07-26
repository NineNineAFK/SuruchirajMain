const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    product_name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    preservatives: { type: String },
    nutrition_facts_per_100gm_approx: {
        Energy: { type: String },
        Fat: { type: String },
        Protein: { type: String },
        Carbohydrate: { type: String },
        Sugar: { type: String }
    },
    fssai_reg_no: { type: String },
    recipe: [{ type: String }],
    manufactured_marketed_by: { type: String },
    address: { type: String },
    email: { type: String },
    customer_care_no: { type: String },
    mrp: [{ type: Number }],
    net_wt: [{
        value: { type: Number },
        unit: { type: String }
    }],
    best_before: { type: String },
    category: [{ type: String }],
    why_you_will_love_it: [{ type: String }],
    images: [{ type: String }], // Array of image URLs or filenames
    stock: { type: Number, default: 0 }, // Stock in grams
    packaging_50gms: { type: Number, default: 0 },
    packaging_100gms: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },

}, { timestamps: true });



module.exports = mongoose.model('Product', ProductSchema);