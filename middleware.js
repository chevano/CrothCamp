const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


module.exports.isLoggedIn = ( req, res, next ) => {
    if ( !req.isAuthenticated() ) {
        req.flash("error", "Please sign in to continue!" );
        req.session.returnTo = req.originalUrl; // stores the location where the user wanted to go when they were logged out

        return res.redirect( "/login" );
    }
    next();
}

// Middleware to validate a Campground on the frontend
module.exports.validateCampground = ( req, res, next ) => {
    const { error } = campgroundSchema.validate( req.body );
    if (error) {
        const msg = error.details.map( el => el.message ).join(',')
        throw new ExpressError( msg, 400 )
    } else {
        next();
    }
}

// Checks whether the current user doesn't own the campground they are currently viewing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if ( !campground.owner.equals( req.user._id ) ) {
        req.flash( "error", "Sorry, you do not have permission to update this page");
        return res.redirect( `/campgrounds/${id}` );
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById( reviewId );
    if ( !(review.owner.equals(req.user._id)) ) {
        req.flash("error", "Sorry, you do not have permission to update this page");
        return res.redirect( `/campgrounds/${id}` );
    }
    next();
}


// Middleware to validate a Review on the frontend
module.exports.validateReview = ( req, res, next ) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}