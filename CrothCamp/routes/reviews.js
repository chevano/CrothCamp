const express = require('express');
const router = express.Router({ mergeParams: true }); // Allows us to get the id in app.js
const { validateReview, isLoggedIn, isReviewOwner } = require('../middleware');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const reviews = require( '../controllers/reviews' );


// Creates a new review for a single campground
router.post('/', isLoggedIn, validateReview, catchAsync( reviews.createReview));

// Delete a review from a campground
router.delete('/:reviewId', isLoggedIn, isReviewOwner, catchAsync( reviews.deleteReview ));

module.exports = router;