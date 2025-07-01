const Address = require('../model/address');

// Add a new address
const addAddress = async (req, res) => {
    try {
        const { addressName, name, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!addressName || !name || !phone || !addressLine1 || !city || !state || !pincode) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const addressData = {
            userId,
            addressName,
            name,
            phone,
            addressLine1,
            addressLine2: addressLine2 || '',
            city,
            state,
            pincode,
            isDefault: isDefault || false
        };

        const address = new Address(addressData);
        await address.save();

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            address
        });
    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all addresses for a user
const getAddresses = async (req, res) => {
    try {
        const userId = req.user._id;
        const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            addresses
        });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update an address
const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const address = await Address.findOne({ _id: addressId, userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            address: updatedAddress
        });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete an address
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user._id;

        const address = await Address.findOne({ _id: addressId, userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        await Address.findByIdAndDelete(addressId);

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Set default address
const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user._id;

        const address = await Address.findOne({ _id: addressId, userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Set all addresses to non-default first
        await Address.updateMany({ userId }, { isDefault: false });

        // Set the selected address as default
        address.isDefault = true;
        await address.save();

        res.status(200).json({
            success: true,
            message: 'Default address updated successfully',
            address
        });
    } catch (error) {
        console.error('Error setting default address:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get a specific address
const getAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const userId = req.user._id;

        const address = await Address.findOne({ _id: addressId, userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        res.status(200).json({
            success: true,
            address
        });
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getAddress
}; 