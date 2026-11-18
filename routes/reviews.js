const express=require("express");
const router =express.Router({mergeParams:true });
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const mongoose = require("mongoose");
const Listing=require("../models/listings.js");

const validatereview=(req,res,next)=>{
     let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//-------------------------reviews route--------------------
//------POST----------------
router.post("/", validatereview, wrapAsync (async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved!");
    res.redirect(`/listings/${req.params.id}`);
}));

//-----------Delere-------------

router.delete("/:reviewid",wrapAsync(async(req,res)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);

    res.redirect(`/listings/${id}`);
}));

module.exports = router;