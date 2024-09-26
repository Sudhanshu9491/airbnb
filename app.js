const express=require('express');
const app = express();
const mongoose =require('mongoose');
const listing =require('./models/listing.js');

// Url is taken from mongodb website -->/wanderlust is a project name
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.error(err);
});

app.get("/testlisting",async (req,res)=>{
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
})


app.get("/",(req,res)=>{
    res.send("This is the set Up of App.js");
})

app.listen(8080,()=>{
    console.log("Server is started");
})