const express=require("express");
const router =express.Router({mergeParams:true });
const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const mongoose = require("mongoose");
const Listing=require("../models/listings.js");
const {validatereview}=require("../middleware.js");
//-------------------------reviews route--------------------
//------POST----------------
router.post("/", validatereview, wrapAsync (async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved!");
    req.flash("success","Review Added Succesfully!");
    res.redirect(`/listings/${req.params.id}`);
}));

//-----------Delere-------------

router.delete("/:reviewid",wrapAsync(async(req,res)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;