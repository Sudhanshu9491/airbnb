const user=require("../models/user");

module.exports.signup=async (req,res)=>{
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
};

module.exports.login=async(req,res)=>{
    // res.send("Welcome");
    req.flash("success","You Logged In Successfull");
    let redirectUrl=res.locals.redirectUrl ||  "/listings";
    // console.log(redirectUrl);
    // console.log(res.locals.redirectUrl);
    res.redirect(redirectUrl);
};

module.exports.renderSignUpForm=(req,res)=>{
    // res.send("You are signed"); 
    res.render("users/signup.ejs");
}

module.exports.renderLogInForm=(req,res)=>{
    // res.send("You are signed"); 
    res.render("users/login.ejs");
}

module.exports.logOut=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out now!");
        res.redirect("/listings");
    })
}