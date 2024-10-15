const express=require("express");
const router=express.Router();
const user=require("../models/user")
const wrapAsync=require("../utils/wrapAsync");
router.get("/signup",(req,res)=>{
    // res.send("You are signed"); 
    res.render("users/signup.ejs");
})

router.post("/signup",wrapAsync(async (req,res)=>{
    try {
        let {username,password,email}=req.body;
        const newUser=new user({email,username});
        const registerUser = await user.register(newUser,password);
        console.log(registerUser);
        req.flash("success","Welcome to wanderlust");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

module.exports=router;