const mongoose =require('mongoose');
const initData=require('./data.js');
const listing=require("../models/listing.js");
const users=require("../models/user.js");
const reviews=require("../models/review.js");

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


const initDB=async ()=>{
    await listing.deleteMany({}).then(()=>{
        console.log("Listing Data Deleted Sucessful");
    }).catch((err)=>{
        console.error(err);
    })
    await users.deleteMany({}).then(()=>{
        console.log("User Data Deleted Sucessful");
    }).catch((err)=>{
        console.error(err);
    })
    await reviews.deleteMany({}).then(()=>{
        console.log("Review Data Deleted Sucessful");
    }).catch((err)=>{
        console.error(err);
    })
    await listing.insertMany(initData.data);
    console.log("Previous Data is Deleted and sample data is added in db");
}

initDB();