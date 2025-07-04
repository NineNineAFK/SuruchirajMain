const express = require("express");
const { handleUserSignUP, 
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
    moveWishlistItemToCart } = require("../controllers/user");
const User = require("../model/user");
const router = express.Router();
const { isAuthenticated } = require('../middlewares/isAuthenticated');

//router.post("/",);

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", handleUserSignUP);
router.post("/login", handleUserlogin);
router.get("/login", (req, res) => {
    res.render("login");
});

// Logout route
router.post("/logout", handleUserLogout);
router.get("/logout", handleUserLogout);

// Forgot password routes
router.get("/forgot-password", (req, res) => {
    res.render("forgotPassword");
});
router.post("/forgot-password", handleForgotPassword);

// Reset password routes
router.get("/reset-password/:token", (req, res) => {
    res.render("resetPassword", { token: req.params.token });
});
router.post("/reset-password/:token", handleResetPassword);

// ✅ API endpoint to return JSON user data
router.get("/userinfo", async (req, res) => {
  if (req.isAuthenticated() && req.user) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({
        user: {
          name: user.name,
          email: user.email,
          photo: user.photo,
          phone: user.phone || null,
          profilePicture: user.profilePicture || null,
          dateOfBirth: user.dateOfBirth || null,
          gender: user.gender || null,
          walletBalance: user.walletBalance || 0,
        },
      });
    } catch (err) {
      console.error("❌ Error fetching user info:", err);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});


// Mobile login routes
const { sendOTP, verifyOTP } = require("../service/otp");
router.get("/login-mobile", (req, res) => {
  res.render("loginMobile"); // ✅ Shows phone input
});

router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  console.log("Phone received:", phone);

  const user = await User.findOne({ phone });
  if (!user) return res.render("loginMobile", { error: "Phone not registered" });

  await sendOTP(phone);
  res.render("verifyOtp", { phone });
});

router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!verifyOTP(phone, otp)) {
    return res.render("verifyOtp", { phone, error: "Invalid or expired OTP" });
  }

  const user = await User.findOne({ phone });
  const token = setUser(user);
  res.cookie("uid", token, { httpOnly: true });
  res.redirect("/home");

});

// All routes require authentication
router.use(isAuthenticated);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/profile-picture', updateProfilePicture);

// Address management routes
router.get('/addresses', getUserAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Order management routes
router.get('/orders', getUserOrders);
router.get('/orders/:orderId', getOrderDetails);

// Admin route for updating order status
router.put('/orders/:orderId/status', updateOrderDeliveryStatus);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);
router.post('/wishlist/move-to-cart/:productId', moveWishlistItemToCart);

module.exports = router;
