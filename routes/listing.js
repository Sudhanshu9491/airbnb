const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const listing =require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// All data show in all listining
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.newListing));
  // .post( upload.single('listing[image]'),(req,res)=>{res.send(req.file);});

// we write this before the listings/:id because the listings is same so it is searching the id in the database
// Created new listing
router.get("/new", isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render("./listings/new.ejs");
});

// show
// Inside of any listed item view
router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

// Delete
router.get(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.delete)
);

module.exports = router;
