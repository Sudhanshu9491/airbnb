const express=require("express");
const router=express.Router();
const user=require("../models/user")
const wrapAsync=require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware")

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
        req.login(registerUser,(err)=>{
            if(err) next(err);
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    // res.send("You are signed"); 
    res.render("users/login.ejs");
})

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    // res.send("Welcome");
    req.flash("success","You Logged In Successfull");
    let redirectUrl=res.locals.redirectUrl ||  "/listings";
    // console.log(redirectUrl);
    // console.log(res.locals.redirectUrl);
    res.redirect(redirectUrl);
})

// logout
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out not");
        res.redirect("/listings");
    })
})

module.exports=router;