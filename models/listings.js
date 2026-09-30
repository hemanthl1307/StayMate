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
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtMua49c7AM02O5HxcpnE1XnRmcob1tkBAM_VON551hqbwBx7NgpfovH0&s=10",
        set:(v)=> v==="" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtMua49c7AM02O5HxcpnE1XnRmcob1tkBAM_VON551hqbwBx7NgpfovH0&s=10":v,
    },
    price:{
        type:Number
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
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;