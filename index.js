const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/StayMate";
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const ReviewRouter = require("./routes/reviews.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const UserRouter=require("./routes/user.js");
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
const sessionOptions={
    secret:"Hemanth@12345",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.errormsg=req.flash("errormsg");
    res.locals.errormsg = req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"student45"
//     });
//     let reguser=await User.register(fakeUser,"securedpassword");
//     res.send(reguser);
// });

//----------------------listen to port--------------
app.listen(port,()=>{
    console.log(` Server is listening to the port ${port}`);
});
//--------------------- basic route ------------------------
app.get("/",(req,res)=>{
    res.send("Hello i am hemanth");
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",ReviewRouter)
app.use("/",UserRouter);

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