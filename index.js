const express=require("express");
const app=express();
const port=8080;

const mongoose=require("mongoose");
const Listing=require("./models/listings.js");
const MONGO_URL="mongodb://127.0.0.1:27017/StayMate";
const path=require("path");
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
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
//----------------------listen to port--------------
app.listen(port,()=>{
    console.log(` Server is listening to the port ${port}`);
});
//--------------------- basic route ------------------------
app.get("/",(req,res)=>{
    res.send("Hello i am hemanth");
});

//-----------------Index route--------------------
app.get("/listings",async (req,res)=>{
    const allListing=await Listing.find({});
    console.log(allListing);
    res.render("../views/listings/index.ejs",{allListing});
});
//------------------new route-------------------
app.get("/listings/new", (req,res)=>{
    res.render("../views/listings/new.ejs");
});
//--------------------show route-------------------

app.get("/listings/:id", async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("../views/listings/show.ejs",{listing});
});

//--------------------------create route-----------------

app.post("/listings", async (req,res)=>{
    // let {title,description,location,State,image,price,category}=req.body;
    const listing=req.body.listing;
    const newListing=new Listing(listing);
    await newListing.save();
    console.log(listing);
    res.redirect("/listings");
});
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