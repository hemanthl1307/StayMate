const express=require("express");
const router =express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        let reguser=await User.register(newUser,password);
        console.log(reguser);
        req.flash("success","User registered!");
        res.redirect("/listings");
    }catch(e){
        req.flash("errormsg",e.message);
        res.redirect("/signup");
    }
}));

module.exports=router;