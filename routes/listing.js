const express  = require('express');
const router= express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema} =require("../schema.js");
const listing =require('../models/listing.js');


const validateListing=(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    // console.log(result);
    if(error){
        throw new ExpressError(404,error);
    }else{
        next();
    }
}

// All data show in all listining
router.get("/",wrapAsync(async (req,res)=>{
    const allListing=await listing.find({});
    res.render("./listings/index.ejs",{allListing})
    // res.send("All Data Will Show soon");
}))

// we write this before the listings/:id becouse the listings is same so it is searching the id in the database
// Created new listing
router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
})

// show
// Inside of any listed item view
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    const list = await listing.findById(id).populate("reviews");
    if(!list){
        req.flash("error","Listing you request for does not exist!");
        res.redirect("/listings");
    }
    console.log(list);
    res.render("./listings/show.ejs",{list});
    // res.send(";dhja");
}))

router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    const newListing=new listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings");
}))

 // Update route
 router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    // if nothing will come via hoppscotch then
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated Successful!");
    res.redirect(`/listings/${id}`);
}))

// Edit Route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
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
router.get("/:id/delete",wrapAsync(async (req,res)=>{
    let {id} =req.params;
    console.log(id);
    await listing.findByIdAndDelete(id);
    console.log("deleted successfully")
    req.flash("success","Listing Deleted Successful!");
    res.redirect("/listings");
    // res.send("sldfj");
}))


module.exports = router;