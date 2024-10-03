    const express=require('express');
    const app = express();
    const mongoose =require('mongoose');
    const listing =require('./models/listing.js');
    const path=require('path');
    const methodOverride=require('method-override');
    const ejsMate=require('ejs-mate');
    const wrapAsync=require("./utils/wrapAsync.js");
    const ExpressError=require("./utils/ExpressError.js");
    const {listingSchema} =require("./schema.js");

    // Url is taken from mongodb website -->/wanderlust is a project name
    const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
    // set up of mongo db 
    async function main(){
        await mongoose.connect(MONGO_URL);
    }
    // Execution of main 
    main().then(()=>{
        console.log("Connected to DB");
    }).catch((err)=>{
        console.error(err);
    });

    app.set("view engine",'ejs');
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));
    app.use(methodOverride("_method"));
    app.engine("ejs",ejsMate);
    app.use(express.static(path.join(__dirname,"/public")));

    // All data show in all listining
    app.get("/listings",wrapAsync(async (req,res)=>{
        const allListing=await listing.find({});
        res.render("./listings/index.ejs",{allListing})
        // res.send("All Data Will Show soon");
    }))

    // we write this before the listings/:id becouse the listings is same so it is searching the id in the database
    // Created new listing
    app.get("/listings/new",(req,res)=>{
        res.render("./listings/new.ejs");
    })

    app.post("/listings",wrapAsync(async (req,res,next)=>{
        // let {title,description,image,price,location,country}=req.body;
        // if nothing will come via hoppscotch then
        const result=listingSchema.validate(req.body);
        if(result.error){
            throw new ExpressError(404,result.error);
        }
        console.log(result);
        const newListing=new listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
        
    }))


    // Inside of any listed item view
    app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
        let {id}=req.params;
        const list =await listing.findById(id);
        console.log(list);
        res.render("./listings/show.ejs",{list});
        // res.send(";dhja");
    }))

    // Edit Route
    app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
        let {id} =req.params;
        let data=await listing.findById(id);
        res.render("./listings/edit.ejs",{data});
        // res.send("sldfj");
    }))
    app.get("/listings/:id/delete",wrapAsync(async (req,res)=>{
        let {id} =req.params;
        console.log(id);
        await listing.findByIdAndDelete(id);
        res.redirect("/listings");
        // res.send("sldfj");
    }))

    // Update route
    app.put("/listings/:id",wrapAsync(async (req,res)=>{
        // if nothing will come via hoppscotch then
        if(!req.body.listing){
            throw new ExpressError(400,"Set Valid Data For Listing");
        }
        let {id}=req.params;
        await listing.findByIdAndUpdate(id,{...req.body.listing});
        res.redirect(`/listings/${id}`);
    }))

    // Delete Route

    // for one data test
    app.get("/testlisting",wrapAsync(async (req,res)=>{
        let sampleListing=new listing({
            title:"New Home",
            description:"Neat and clean",
            // image:,
            price:1200,
            location:"Kanpur",
            country:"India"
        })
        await sampleListing.save();
        console.log("Sample was saved");
        res.send("saved in db")
    }))


    // Root of the server
    app.get("/",(req,res)=>{
        res.render("./listings/home.ejs");
        // res.send("This is the set Up of App.js");
    })


    // if any page is not found then this will get the request
    app.all("*", (req, res, next) => {
      next(new ExpressError(404, "page not found"));
    });

    // For all universal err
    app.use((err,req,res,next)=>{
        let {statusCode=500,message="Something went wrong"}=err;
        res.status(statusCode).render("./listings/error.ejs", { message });
        // res.status(statusCode).send(message);
    });

    // listenig app
    app.listen(8080,()=>{
        console.log("Server is started");
    })