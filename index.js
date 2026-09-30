const express=require("express");
const app=express();
const port=8080;

const mongoose=require("mongoose");
const Listing=require("./models/listings.js");
const MONGO_URL="mongodb://127.0.0.1:27017/StayMate"
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

app.listen(port,()=>{
    console.log(` Server is listening to the port ${port}`);
});

app.get("/testListing",async (req,res)=>{
    let sampleListing=new Listing({
        title:"My new Villa",
        description:"Near to the beach",
        price:1200,
        location:Calangute,
        State:Goa
    });
    await sampleListing.save();
    console.log("saved succesfully");
    res.send("Successfull");
})
app.get("/",(req,res)=>{
    res.send("Hello i am hemanth");
});