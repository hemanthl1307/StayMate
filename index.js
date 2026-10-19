const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const Listing=require("./models/listings.js");
const MONGO_URL="mongodb://127.0.0.1:27017/StayMate";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
//-----------------Database connection-----------------
main()
.then(()=>{
    console.log("connection successfull")
})
.catch(() => {
    console.log("connection failed");
});

async function main() {
  await mongoose.connect(MONGO_URL);
}
//------------set and use part---------------------
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
//----------------------listen to port--------------
app.listen(port,()=>{
    console.log(` Server is listening to the port ${port}`);
});
//--------------------- basic route ------------------------
app.get("/",(req,res)=>{
    res.send("Hello i am hemanth");
});

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
app.get("/listings", wrapAsync (async (req,res)=>{
    const allListing=await Listing.find({});
    // console.log(allListing);
    res.render("../views/listings/index.ejs",{allListing});
}));
//------------------new route-------------------
app.get("/listings/new", (req,res)=>{
    res.render("../views/listings/new.ejs");
});
//--------------------show route-------------------

app.get("/listings/:id", wrapAsync (async (req,res,next)=>{
    let {id}=req.params;
    if (!mongoose.isValidObjectId(id)) {
        throw new ExpressError(400, "Invalid listing ID!");
    }
    const listing=await Listing.findById(id);
    if (!listing) {
    throw new ExpressError(404, "Listing Not found");
    }
    res.render("../views/listings/show.ejs",{listing});
}));

//--------------------------create route-----------------

app.post("/listings",validatelisting, wrapAsync (async (req,res)=>{
    // let {title,description,location,State,image,price,category}=req.body;
    const listing=req.body.listing;
    const newListing=new Listing(listing);
    await newListing.save();
    // console.log(listing);
    res.redirect("/listings");
}));

//----------------------------edit route------------------
app.get("/listings/:id/edit", wrapAsync( async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if (!listing) {
    throw new ExpressError(404, "Listing Not found");
    }
    res.render("../views/listings/edit.ejs",{listing});
}));
//----------------------update route-----------------

app.put("/listings/:id",validatelisting, wrapAsync (async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing );
    res.redirect(`/listings/${id}`);
}));
//---------------------delete route==========================

app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let delList=await Listing.findByIdAndDelete(id);
    console.log(delList);
    res.redirect("/listings");
}));

// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"Near to the beach",
//         price:1200,
//         location:"Calangute",
//         State:"Goa",
//         category:"Rooms"
//     });
//     await sampleListing.save();
//     console.log("saved succesfully");
//     res.send("Successfull");
// });

//404 route
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

//custom error handling middleware
app.use((err,req,res,next)=>{
    let { status = 500, message = "Something went wrong!" } = err;

    if (err.name === "ValidationError") {
        status = 400;
        message = "Invalid listing data!";
    }

    if (err.name === "CastError") {
        status = 400;
        message = "Invalid ID format!";
    }
   res.status(status).render("error.ejs", { message });
});