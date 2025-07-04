const express = require("express");
const router = express.Router();
const Order = require('../model/order'); // Make sure the path is correct for the Order model

// Controller to handle authentication check and retrieve user orders
exports.checkAuth = async (req, res) => {
  try {
    if (req.isAuthenticated() && req.user && req.user._id) {
      // The user is authenticated and has a MongoDB _id in the session
      const userId = req.user._id;

      // Fetch all orders for the authenticated user using MongoDB ObjectId
      const userOrders = await Order.find({ userId: userId });

      // Send both authentication status and order data to the frontend
      res.status(200).send({
        authenticated: true,
        googleId: req.user.googleId,
        userId: userId,
        orders: userOrders, // Send the user's orders to the frontend
      });
    } else {
      // The user is not authenticated or _id is missing
      res.status(401).send({
        authenticated: false,
        message: req.isAuthenticated() ? 'User ID missing from session' : 'User not authenticated',
      });
    }
  } catch (error) {
    // Handle errors such as issues with fetching orders from the database
    console.error('Error fetching user orders:', error);
    res.status(500).send({
      error: 'An error occurred while retrieving orders. Please try again later.',
    });
  }
};
