const express=require("express");
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listings.js");
const mongoose = require("mongoose");
// =======validating listings 
const validatelisting=(req,res,next)=>{
     let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//-----------------Index route--------------------
router.get("/", wrapAsync (async (req,res)=>{
    const allListing=await Listing.find({});
    // console.log(allListing);
    res.render("../views/listings/index.ejs",{allListing});
}));
//------------------new route-------------------
router.get("/new", (req,res)=>{
    res.render("../views/listings/new.ejs");
});
//--------------------show route-------------------

router.get("/:id", wrapAsync (async (req,res,next)=>{
    let {id}=req.params;
    if (!mongoose.isValidObjectId(id)) {
        throw new ExpressError(400, "Invalid listing ID!");
    }
    const listing=await Listing.findById(id).populate("reviews");
    if (!listing) {
    //throw new ExpressError(404, "Listing Not found");
    req.flash("errormsg","Listing Not found!");
    return res.redirect("/listings");
    }
    res.render("../views/listings/show.ejs",{listing});
}));

//--------------------------create route-----------------

router.post("/",validatelisting, wrapAsync (async (req,res)=>{
    // let {title,description,location,State,image,price,category}=req.body;
    const listing=req.body.listing;
    const newListing=new Listing(listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    // console.log(listing);
    res.redirect("/listings");
}));

//----------------------------edit route------------------
router.get("/:id/edit", wrapAsync( async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if (!listing) {
    throw new ExpressError(404, "Listing Not found");
    }
    res.render("../views/listings/edit.ejs",{listing});
}));
//----------------------update route-----------------

router.put("/:id",validatelisting, wrapAsync (async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing );
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));
//---------------------delete route==========================

router.delete("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let delList=await Listing.findByIdAndDelete(id);
    console.log(delList);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;

