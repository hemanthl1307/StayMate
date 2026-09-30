const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        set:(v)=>v===""? "images\img2.jpg":v,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    state:{
        type:String
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;