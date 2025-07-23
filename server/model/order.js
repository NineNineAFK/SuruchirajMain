const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        items: [{
            productName: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            qty_50g: {
                type: Number,
                required: false,
                default: 0
            },
            qty_100g: {
                type: Number,
                required: false,
                default: 0
            },
            totalGrams: {
                type: Number,
                required: false,
                default: 0
            }
        }],
        totalAmount: {
            type: Number,
            required: true,
        },
        deliveryAddress: {
            addressName: String,
            name: String,
            phone: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            pincode: String,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'N/A'],
            default: 'pending',
        },
        // PhonePe payment details
        phonepeTransactionId: {
            type: String,
            sparse: true,
        },
        phonepeMerchantTransactionId: {
            type: String,
            sparse: true,
        },
        phonepeResponseCode: String,
        phonepeResponseMessage: String,
        phonepePaymentInstrument: String,
        phonepeRedirectUrl: String,
        phonepeCallbackUrl: String,
    },
    { timestamps: true }
);

// Index for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ phonepeTransactionId: 1 }, { unique: true, sparse: true });
orderSchema.index({ phonepeMerchantTransactionId: 1 }, { unique: true, sparse: true });

const Order = mongoose.model('order', orderSchema);
module.exports = Order;
