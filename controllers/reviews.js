const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async ( req, res ) => {
    const campground = await Campground.findById( req.params.id );
    const review = new Review( req.body.review );
    review.owner = req.user._id;
    campground.reviews.push( review ); // Adds the review to the selected campground
    await review.save();
    await campground.save();
    req.flash( "success", "You have successfully created a new review!!!" );
    res.redirect(`/campgrounds/${ campground._id }`);
}

module.exports.deleteReview = async ( req, res ) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate( id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete( reviewId);
    req.flash( "success", "The Review has successfully been deleted!!!" );
    res.redirect(`/campgrounds/${ id }`);
}