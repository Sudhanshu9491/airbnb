const express=require("express");
const router=express.Router();
const user=require("../models/user")
const wrapAsync=require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware")
const  userController = require("../controllers/users.js");


router.get("/signup",userController.renderSignUpForm)

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.renderLogInForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login)

// logout
router.get("/logout",userController.logOut);

module.exports=router;