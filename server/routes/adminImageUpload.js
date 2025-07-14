const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const IMAGE_UPLOAD_DIR = process.env.IMAGE_UPLOAD_DIR || path.join(__dirname, '../../images/products');

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, _, cb) {
    fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });
    cb(null, IMAGE_UPLOAD_DIR);
  },
  filename: function (req, _, cb) {
    cb(null, _.originalname);
  }
});

const upload = multer({ storage: storage });

// POST /api/admin/upload-images
router.post('/upload-images', upload.array('images', 50), async (req, res) => {
  try {
    const associateImages = require('../utils/associateImages');
    await associateImages();
  } catch (err) {
    console.error('Error running associateImages:', err);
  }
  res.json({ message: 'Images uploaded successfully', files: req.files.map(f => f.filename) });
});

module.exports = router; 