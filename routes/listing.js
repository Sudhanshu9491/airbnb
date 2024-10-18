const express  = require('express');
const router= express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listing =require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} =require("../middleware.js");


// All data show in all listining
router.get("/",wrapAsync(async (req,res)=>{
    const allListing=await listing.find({});
    res.render("./listings/index.ejs",{allListing})
    // res.send("All Data Will Show soon");
}))

// we write this before the listings/:id because the listings is same so it is searching the id in the database
// Created new listing
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);
    res.render("./listings/new.ejs");
})

// show
// Inside of any listed item view
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    const list = await listing.findById(id).populate("reviews").populate("owner");
    if(!list){
        req.flash("error","Listing you request for does not exist!");
        res.redirect("/listings");
    }
    console.log(list);
    res.render("./listings/show.ejs",{list});
    // res.send(";dhja");
}))

router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
    const newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings");
}))

 // Update route
 router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    // if nothing will come via hoppscotch then
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated Successful!");
    res.redirect(`/listings/${id}`);
}))

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} =req.params;
    let data=await listing.findById(id);
    if(!data){
        req.flash("error","Listing you request for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{data});
    // res.send("sldfj");
}))

// Delete
router.get("/:id/delete",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} =req.params;
    console.log(id);
    await listing.findByIdAndDelete(id);
    console.log("deleted successfully")
    req.flash("success","Listing Deleted Successful!");
    res.redirect("/listings");
    // res.send("sldfj");
}))


module.exports = router;