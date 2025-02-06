const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {validateReview,isLoggedIn,isReviewAuthor} =require("../middleware.js");
const  reviewController = require("../controllers/reviews.js");


// Reviews 
// Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete route with list.id and reviews.id
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;