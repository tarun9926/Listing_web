//basic code setup
//require all the requirements
const express = require("express");
const app = express();
const mongoose = require("mongoose");

//require listing from models folder
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const MONGO_URL = process.env.ATLASDB_URL;
//require override for edit route
const methodOverride = require("method-override");
//require ejs
const path = require("path");
//require ejs-mate
const ejsMate = require("ejs-mate");

//require wrapasync
const wrapAsync = require("./utils/wrapAsync.js");
//express error
const ExpressError = require("./utils/ExpressError.js");
//require review model
const Review = require("./models/review.js");
//******************************** */
//it is for passport
const session = require("express-session");
//require passport for authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//connect flash to the project
const flash = require("connect-flash");
//requireing the islogged in 
const {isLoggedIn, saveRedirectUrl, isOwner} = require("./middleware.js");
const { register } = require("module");


//it is for addone msg to add delete update any of the listing so that use it
//for checking the wonderlust addon or not to the shell
//const { listingSchema } = require("./Schema.js");
main().then(() =>{

    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
})
//connect to the database
//this is for add wonderlust to the mongo shell
async function main(){
    await mongoose.connect(MONGO_URL);
}

//setup ejs
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
//for edit route
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
//for use public css files into the publicly
app.use(express.static(path.join(__dirname, "/public")));

// //flash npm

//********************************* */
const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

//basic api creating
//root
// app.get("/", (req,res) => {
//     res.send("HI, I am root");
// });


app.use(session(sessionOptions));
//flash use
app.use(flash());

//required for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res , next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    //for navbar signout signin logout shown
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});
//fake demo
// //for passport 
// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
//   let registeredUser = await  User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });

// app.use((req,res, next) =>{
//     res.locals.successMsg = req.flash("success");
//     res.locals.errorMsg = req.flash("error");
// });

//888888888888//
// this is for request send for authenticate the user
app.get("/signup", (req, res) =>{
    res.render("./users/signup.ejs");
});

app.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser= new User({email, username});
       const registeredUser = await User.register(newUser, password);
       console.log(registeredUser);
       req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success","welcome to wanderlust");
       res.redirect("/listings");
       });
       
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   
}));

app.get("/login", (req, res) =>{
    res.render("users/login.ejs");
});

//for login user
app.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', 
    failureFlash: true, }),async(req, res)=>{
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    });


    //logout system
    app.get("/logout", (req,res, next) =>{
        req.logout((err) =>{
            if(err){
               return next(err);
            }
            req.flash("success", "you are logged out");
            res.redirect("/listings");
        });
    });

app.get("/register", (req,res )=> {
    let { name = "Bittu" } = req.query;
    req.session.name = name;
    //flash
    if(name === "Bittu") {
        req.flash("error", "user not registered");
    }else {
        req.flash("success", "user registered successfully");
    }
    res.redirect("/hello");
});

app.get("/hello",(req, res) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("../views/page.ejs", { name: req.session.name, msg: req.flash("success") });
});

//this is index route 
app.get("/listings", wrapAsync(async (req,res) =>{
   const allListings = await Listing.find({});
   res.render("./listings/index.ejs", {allListings});
}));

//this is for crating new listing route
app.get("/listings/new",isLoggedIn ,(req,res) =>{
    //rendering the show form here
    res.render("listings/new.ejs");
});

//creating show route for showing individual details of the listing
app.get("/listings/:id", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    //id we will get in id bases we find 
    const listing = await Listing.findById(id).populate("reviews").populate("Owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists! ");
        res.redirect("/listings");
    }
    // console.log(listing);

    //for showing more details of the listing
    res.render("listings/show.ejs", { listing });
}));


//create route for add new listing request when click on add
app.post("/listings",isLoggedIn, wrapAsync( async(req, res, next) =>{
  if(!req.body.listing){
    throw new ExpressError(400,"send valid data for listing" );
  }
   // let {title, description, image, price, country, location } = req.body;
  //this is for add new listing to the listing page 
   const newListing = new Listing(req.body.listing);
   newListing.Owner = req.user._id;
   await newListing.save();
   //flash creatinh
   req.flash("success", "New Listing Created!");
   res.redirect("/listings");
  })
);

//creating edit route for edit the listing
app.get("/listings/:id/edit", isLoggedIn ,isOwner,wrapAsync( async(req, res) =>{
   //id extracting from parametre
    let {id} = req.params;
    //find out listing
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exists! ");
        res.redirect("/listings");
    }
    //render listing
    res.render("/listings/edit.ejs", {listing});
}));

//UPDATE route
app.put("/listing/:id",isLoggedIn,isOwner,wrapAsync( async (req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing" );
      }
    let { id } = req.params;
   
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash("success", "Listing Updated! ");
  return res.redirect(`/listings/${id}`);
}));

//creating delete route
app.delete("/listings/:id",isLoggedIn,isOwner,wrapAsync( async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted! ");
    res.redirect("/listings");
}));

///////////////////////////////////////////////////////////////////

//new root crating for listing 
// app.get("/testListing",async (req, res) =>{
//     //adding the information to the listing
//     let sampleListing = new Listing({
//         title: "My villa Big Villa",
//         description: "By the beach",
//         price: 2000,
//         location: "Calangute, Goa",
//         country: "india",
//     });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successfull testing");
// });

//for listing reviews 
//post route
app.post("/listings/:id/reviews", async(req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   req.flash("success", "Review Created! ");
//    console.log("new review saved");
//    res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);

});

//delete route for the review btn
app.delete("/listings/:id/reviews/:reviewId", 
    wrapAsync(async(req, res) =>{
    let { id , reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted! ");

    res.redirect(`/listings/${id}`);
})
);
//new express error
app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "page note found!"));
});
//for err handle if user inter a wrong input
app.use((err, req, res, next) =>{
    let {statusCode=500, message="something went wrong"} = err;
    //this is all possible by bootstrap alert
    res.status(statusCode).render("error.ejs" , {message});
    
    // res.status(statusCode).send(message);
});

//starting server on port 8080
app.listen(8080, () =>{
    console.log("server is listing to port 8080");
});