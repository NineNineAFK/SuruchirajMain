const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { isAuthenticated } = require('../middlewares/isAuthenticated');

// All routes require authentication
router.use(isAuthenticated);

// Get all addresses for the user
router.get('/api/addresses', addressController.getAddresses);

// Get a specific address
router.get('/api/addresses/:addressId', addressController.getAddress);

// Add a new address
router.post('/api/addresses', addressController.addAddress);

// Update an address
router.put('/api/addresses/:addressId', addressController.updateAddress);

// Delete an address
router.delete('/api/addresses/:addressId', addressController.deleteAddress);

// Set default address
router.patch('/api/addresses/:addressId/default', addressController.setDefaultAddress);

module.exports = router; 