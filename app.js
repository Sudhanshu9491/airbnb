const express=require('express');
const app = express();
const mongoose =require('mongoose');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.error(err);
});

app.get("/",(req,res)=>{
    res.send("This is the set Up of App.js");
})

app.listen(8080,()=>{
    console.log("Server is started");
})