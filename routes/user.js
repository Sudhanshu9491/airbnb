const express=require("express");
const router=express.Router();
const user=require("../models/user")
const wrapAsync=require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware")
const  userController = require("../controllers/users.js");

// signup
router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup));

// login
router.route("/login")
.get(userController.renderLogInForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userController.login);

// logout
router.get("/logout",userController.logOut);

module.exports=router;