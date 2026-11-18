const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
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
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtMua49c7AM02O5HxcpnE1XnRmcob1tkBAM_VON551hqbwBx7NgpfovH0&s=10",
        set:(v)=> v==="" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtMua49c7AM02O5HxcpnE1XnRmcob1tkBAM_VON551hqbwBx7NgpfovH0&s=10":v,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String
    },
    category:{
        type:String,
        required:true
    },
    State:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews }})
    }
     console.log("Reviews deleted!");
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;