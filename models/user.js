const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
    // user and password will automatically store in passport npm 
})

User.plugin(passportLocalMongoose);
module.exports=mongoose.model('User',userSchema);