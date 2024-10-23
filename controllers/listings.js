const listing = require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListing=await listing.find({});
    res.render("./listings/index.ejs",{allListing})
};

module.exports.show=async (req,res,next)=>{
    let {id}=req.params;
    const list = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!list){
        req.flash("error","Listing you request for does not exist!");
        res.redirect("/listings");
    }
    console.log(list);
    res.render("./listings/show.ejs",{list});
    // res.send(";dhja");
};

module.exports.newListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url," . ",filename);
    const newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created !");
    res.redirect("/listings");
};

module.exports.update=async (req,res)=>{
    // if nothing will come via hoppscotch then
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated Successful!");
    res.redirect(`/listings/${id}`);
};

module.exports.edit=async (req,res)=>{
    let {id} =req.params;
    let data=await listing.findById(id);
    if(!data){
        req.flash("error","Listing you request for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{data});
    // res.send("sldfj");
};

module.exports.delete=async (req,res)=>{
    let {id} =req.params;
    console.log(id);
    await listing.findByIdAndDelete(id);
    console.log("deleted successfully")
    req.flash("success","Listing Deleted Successful!");
    res.redirect("/listings");
    // res.send("sldfj");
};