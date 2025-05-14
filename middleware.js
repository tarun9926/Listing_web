const Listing = require("./models/listing");
module.exports.isLoggedIn = (req, res , next) =>{
   // console.log(req.path , ".." , req.originalUrl); 
    //thisis for connecting the authentication to the website
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
       return res.redirect("/login");
    }
    next();
};
//middleware for save password
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) =>{
    let {id}  = req.params;
    let listing = await Listing.findById(id);
    if(!listing.Owner.equals(res.locals.currUser._id)){
       req.flash("error", "you don't have permission to edit");
       return res.redirect(`/listings/${id}`);
   }
   next();
};
