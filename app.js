    const express=require('express');
    const app = express();
    const mongoose =require('mongoose');
    const path=require('path');
    const methodOverride=require('method-override');
    const ejsMate=require('ejs-mate');
    const Review =require('./models/review.js');
    const wrapAsync=require("./utils/wrapAsync.js");
    const ExpressError=require("./utils/ExpressError.js");
    const {listingSchema,reviewSchema} =require("./schema.js");
    const listing =require('./models/listing.js');

    // Router 
    const listings=require("./routes/listing.js")


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

    const validateListing=(req,res,next)=>{
        let {error} =listingSchema.validate(req.body);
        // console.log(result);
        if(error){
            throw new ExpressError(404,error);
        }else{
            next();
        }
    }
    
    const validateReview=(req,res,next)=>{
        let {error} =reviewSchema.validate(req.body);
        // console.log(result);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",")
            throw new ExpressError(404,errMsg);
        }else{
            next();
        }
    }

    app.use("/listings",listings);

    // Update route
    app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
        // if nothing will come via hoppscotch then
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


    // Reviews 
    // Post route
    app.post("/listings/:id/review",validateReview,wrapAsync( async (req, res) => {
        let Listing = await listing.findById(req.params.id);  // renamed variable
        let newReview = new Review(req.body.review);
        await newReview.save();
        Listing.reviews.push(newReview);  // ensure correct array name (reviews)
        await Listing.save();
        
        console.log("new review saved");
        // res.send("new review saved");
        res.redirect(`/listings/${Listing._id}`);
    }));

    // DElete route with list.id and reviews.id
    app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
        let{id,reviewId}=req.params;
        await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`)
    }));


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