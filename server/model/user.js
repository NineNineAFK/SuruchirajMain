const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        phone: {
            type: String,
        },
        photo: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other', 'prefer-not-to-say'],
        },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
