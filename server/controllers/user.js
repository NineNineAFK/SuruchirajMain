const express = require("express");

const router = express.Router();
const User = require("../model/user")
const {getUser, setUser, } = require("../service/auth")
const {v4: uuidv4} = require("uuid");
const {restrictToLoggedInUserOnly} = require("../middlewares/auth")
const nodemailer = require("nodemailer");
const Address = require('../model/address');
const Order = require('../model/order');
const Product = require('../model/product');
const Cart = require('../model/cart');

//user signup no hashing here
async function handleUserSignUP(req, res){

   const { name, email, password} = req.body;

   await User.create({
    name,
    email,
    password,

   });
   return res.render("home")
}



//user login

async function handleUserlogin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.render("login", {
                error: "Invalid username or password", // Corrected key to lowercase 'error'
            });
        }

       
        const token = setUser(user);
        res.cookie("uid", token,{ httpOnly: true });  // Cookie with name "uid" points to the sessionId

        return res.redirect("/home");
    } catch (error) {
        console.error("Error during user login:", error); // Added error logging
        return res.status(500).json({ message: "Internal server error" });
    }
}


async function handleUserLogout(req, res) {
    res.clearCookie("uid");
    req.logout((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.redirect("/open");
    });
  }



// Forgot password
async function handleForgotPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.render("forgotPassword", {
          message: "Email not found",
        });
      }
  
      const token = uuidv4();
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "dawkarad2002@gmail.com",
          pass: "rrmh aodn oydg qeoj",
        },
      });
  
      const mailOptions = {
        to: user.email,
        from: 'dawkarad2002@gmail.com',
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `http://${req.headers.host}/user/reset-password/${token}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      await transporter.sendMail(mailOptions);
  
      return res.render("forgotPassword", {
        message: "An e-mail has been sent to " + user.email + " with further instructions.",
      });
    } catch (error) {
      console.error("Error during forgot password:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  
  // Reset password
  async function handleResetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.render("resetPassword", {
          token,
          message: "Password reset token is invalid or has expired.",
        });
      }
  
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      return res.render("login", {
        message: "Password has been reset. You can now log in with the new password.",
      });
    } catch (error) {
      console.error("Error during reset password:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  
  // Get user profile
  const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
  };

  // Update user profile
  const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone, dateOfBirth, gender } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
        if (gender) updateData.gender = gender;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
  };

  // Update profile picture
  const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id;
        const { profilePicture } = req.body;

        if (!profilePicture) {
            return res.status(400).json({
                success: false,
                message: 'Profile picture URL is required'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { profilePicture },
            { new: true }
        ).select('-password -resetPasswordToken -resetPasswordExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
  };

  // Get user addresses
  const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            addresses
        });
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
  };

  // Add new address
  const addAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressName, name, phone, addressLine1, addressLine2, city, state, pincode } = req.body;

        const address = new Address({
            userId,
            addressName,
            name,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode
        });

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

  // Update address
  const updateAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.params;
        const { addressName, name, phone, addressLine1, addressLine2, city, state, pincode } = req.body;

        const address = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            { addressName, name, phone, addressLine1, addressLine2, city, state, pincode },
            { new: true, runValidators: true }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            address
        });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
  };

  // Delete address
  const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { addressId } = req.params;

        const address = await Address.findOneAndDelete({ _id: addressId, userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

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

  // Get user order history
  const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .select('-phonepeTransactionId -phonepeMerchantTransactionId -phonepeResponseCode -phonepeResponseMessage -phonepePaymentInstrument -phonepeRedirectUrl -phonepeCallbackUrl');

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
  };

  // Get specific order details
  const getOrderDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
  };

  // Update order delivery status (for admin use)
  const updateOrderDeliveryStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
  };

  // Add product to wishlist
  const addToWishlist = async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId } = req.params;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (user.wishlist.includes(productId)) {
        return res.status(400).json({ success: false, message: 'Product already in wishlist' });
      }
      user.wishlist.push(productId);
      await user.save();
      res.status(200).json({ success: true, message: 'Added to wishlist' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId } = req.params;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
      await user.save();
      res.status(200).json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // Get user's wishlist
  const getWishlist = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate('wishlist');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // Move wishlist item to cart
  const moveWishlistItemToCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const { productId } = req.params;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
      await user.save();
      // Add to cart (assume quantity 1)
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
      // Look up product details
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      const productName = product.product_name;
      const price = Array.isArray(product.mrp) && product.mrp.length > 0 ? product.mrp[0] : 0;
      const existingItem = cart.items.find(item => item.product && item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ product: productId, productName, price, quantity: 1 });
      }
      // Recalculate total amount
      cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await cart.save();
      res.status(200).json({ success: true, message: 'Moved to cart' });
    } catch (error) {
      console.error('Error in moveWishlistItemToCart:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  module.exports = {
    handleUserSignUP,
    handleUserlogin,
    handleUserLogout,
    handleForgotPassword,
    handleResetPassword,
    getUserProfile,
    updateUserProfile,
    updateProfilePicture,
    getUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getUserOrders,
    getOrderDetails,
    updateOrderDeliveryStatus,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    moveWishlistItemToCart
  };