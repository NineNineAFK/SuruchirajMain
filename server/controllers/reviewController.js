const express = require("express");
const REVIEW = require("../model/review");
// onlly loggged in can access the query and review === UPDAtE
// Controller function to handle the submission of a review
async function submitReview(req, res) {
  let { name, email, message, product, rating } = req.body;
  rating = parseInt(rating, 10);

  if (!name || !email || !message || !product || isNaN(rating)) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['GaramMasala', 'PaneerTikkaMasala'].includes(product)) {
    return res.status(400).json({ message: 'Invalid product type' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const newReview = new REVIEW({ name, email, message, product, rating });
    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}



module.exports = {
  submitReview,
}