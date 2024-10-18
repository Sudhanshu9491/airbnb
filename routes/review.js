const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const listing = require('../models/listing.js');
const Review = require('../models/review.js');
const {validateReview,isLoggedIn} =require("../middleware.js");


// Reviews 
// Post route
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ExpressError(404, "Listing ID is required");
    }

    const Listing = await listing.findById(id);  
    if (!Listing) {
        throw new ExpressError(404, "Listing not found");
    }
    
    const { review } = req.body;
    if (!review) {
        throw new ExpressError(400, "Review is required");
    }

    const newReview = new Review(review);
    newReview.author=req.user._id;
    // console.log("something about user"+req.user._id);
    Listing.reviews.push(newReview);  
    
    try {
        await newReview.save();
        await Listing.save();
    } catch (err) {
        throw new ExpressError(500, "Error saving review");
    }
    
    console.log("new review saved");
    req.flash("success","New Review Added Successful!");
    res.redirect(`/listings/${Listing._id}`);
}));

// Delete route with list.id and reviews.id
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    if (!id || !reviewId) {
        throw new ExpressError(404, "Listing ID and Review ID are required");
    }

    try {
        const Listing = await listing.findById(id);
        if (!Listing) {
            throw new ExpressError(404, "Listing not found");
        }

        const reviewIndex = Listing.reviews.findIndex((review) => review._id.toString() === reviewId);
        if (reviewIndex === -1) {
            throw new ExpressError(404, "Review not found");
        }

        Listing.reviews.splice(reviewIndex, 1);
        await Listing.save();

        await Review.findByIdAndDelete(reviewId);
    } catch (err) {
        throw new ExpressError(500, "Error deleting review");
    }
    req.flash("success","Review Is Deleted Successful!");
    res.redirect(`/listings/${id}`);  
}));

module.exports = router;