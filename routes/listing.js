const express  = require('express');
const router= express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listing =require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} =require("../middleware.js");
const listingController  = require("../controllers/listings.js");


// All data show in all listining
router.get("/",wrapAsync(listingController.index));

// we write this before the listings/:id because the listings is same so it is searching the id in the database
// Created new listing
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);
    res.render("./listings/new.ejs");
})

// show
// Inside of any listed item view
router.get("/:id",wrapAsync(listingController.show));

router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.newListing))

 // Update route
 router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.update))

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit))

// Delete
router.get("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingController.delete))


module.exports = router;