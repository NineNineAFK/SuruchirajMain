const express = require("express");
const router = express.Router();


// Middleware to handle authentication check
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user) {
        // The user is authenticated
        return next();
    } else {
        // The user is not authenticated
        res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }
};

module.exports = { isAuthenticated };