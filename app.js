    const express=require('express');
    const app = express();
    const mongoose =require('mongoose');
    const path=require('path');
    const methodOverride=require('method-override');
    const ejsMate=require('ejs-mate');
    // const Review =require('./models/review.js');
    // const wrapAsync=require("./utils/wrapAsync.js");
    const ExpressError=require("./utils/ExpressError.js");
    // const {listingSchema,reviewSchema} =require("./schema.js");
    // const listing =require('./models/listing.js');

    // Router 
    const listings=require("./routes/listing.js")
    const reviews=require("./routes/review.js")


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

    // const validateListing=(req,res,next)=>{
    //     let {error} =listingSchema.validate(req.body);
    //     // console.log(result);
    //     if(error){
    //         throw new ExpressError(404,error);
    //     }else{
    //         next();
    //     }
    // }
    
    

    app.use("/listings",listings);
    app.use("/listings/:id/review",reviews);



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