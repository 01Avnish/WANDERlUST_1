const Listing = require("./models/listing");
const review = require("./models/review.js");
const {listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req,res , next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};

module.exports.validatereview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id,reviewId} = req.params;
    let review1 = await review.findById(reviewId);
    if(!review1.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not create the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
