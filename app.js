const express=require('express');
const app = express();
const mongoose =require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");

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


// Router routes
app.use("/listings",listings);
app.use("/listings/:id/review",reviews);

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000 ,
        httpOnly:true // for scripting attack
    }
}


app.use(session(sessionOptions));


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