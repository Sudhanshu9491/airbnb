const listing =require("./models/listing");
const {listingSchema,reviewSchema} =require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a new listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let foundListing = await listing.findById(id);
    if (!foundListing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this property");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    
    if (error) {
        // Corrected message mapping
        let errMsg = error.details.map((el) => el.message).join(", ");
        // Throwing the error with the appropriate message
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); // Changed to 400 Bad Request
    } else {
        next();
    }
}