const express=require("express");
const router =express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        let reguser=await User.register(newUser,password);
        console.log(reguser);
        req.login(reguser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User registered!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("errormsg",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:"/login",
        failureFlash:"Invalid username or password!",
        }),
        async(req,res)=>{
            req.flash("success","Welcome To StayMate!");
            let redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
        }
);

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
});
module.exports=router;