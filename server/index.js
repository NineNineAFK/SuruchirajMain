require("dotenv").config(); // ✅ Load .env variables

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./config/passport");
const { connectMongoDB } = require("./connect");
const { restrictToLoggedInUserOnly } = require("./middlewares/auth");
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// 1. CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL, // your frontend URL
  credentials: true // ✅ Send cookies across domains
}));




// 2. Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Session configuration
app.use(session({
  secret: "Aaditya@3737",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // ✅ Required for localhost
    sameSite: "lax", // or 'none' with secure:true + HTTPS
  },
}));

// 4. Passport authentication setup
app.use(passport.initialize());
app.use(passport.session());

// Other middlewares
app.use(express.json()); // Parse JSON bodies for other routes
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Serve images from the images/products directory on your VPS
app.use('/images/products', express.static('/var/www/SuruchirajMain/images/products'));


// 5. Routes
app.use("/user", require("./routes/user"));
app.use("/home", restrictToLoggedInUserOnly, require("./routes/staticRouter"));
app.use("/open", require("./routes/openRouter"));
app.use("/auth", require("./routes/auth"));
app.use('/api/queries', require("./routes/queryRoutes"));
app.use('/api/review', restrictToLoggedInUserOnly, require("./routes/reviewRoutes"));
app.use('/products', productRoutes);
app.use('/api/admin', require("./routes/adminRoutes"));
app.use('/api/admin', require('./routes/adminImageUpload'));
app.use('/cart', require("./routes/cartRoutes")); // Cart routes before catch-all
app.use('/', require("./routes/addressRoutes")); // Address routes before catch-all
app.use('/api/payment', paymentRoutes);

app.use("/", restrictToLoggedInUserOnly, require("./routes/staticRouter")); // Authenticated routes - catch-all for remaining routes

// 6. View engine (if you're using EJS for rendering pages)
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// 7. MongoDB connection
connectMongoDB(process.env.MONGO_URI).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 8. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
