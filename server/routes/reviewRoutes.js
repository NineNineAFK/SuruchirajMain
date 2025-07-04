const express = require("express");

const router = express.Router();

const {submitReview} = require("../controllers/reviewController")

router.post('/', submitReview);

router.get("/", (req, res)=>{
    res.send("review route")
})
module.exports = router;