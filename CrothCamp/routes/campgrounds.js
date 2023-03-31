const express = require( 'express' );
const router = express.Router();
const catchAsync = require( '../utils/catchAsync' );
const { isLoggedIn, isOwner, validateCampground } = require( '../middleware' );
const Campground = require( '../models/campground' );
const campgrounds = require( '../controllers/campgrounds' );
const multer  = require('multer');
const { storage } = require( '../cloudinary' );
const upload = multer({ storage});

router.route( '/')
    .get(catchAsync( campgrounds.index ))  // View all campgrounds
    .post(isLoggedIn, upload.array('image'), validateCampground,  catchAsync( campgrounds.createCampground)); // Creates a new campground

router.get( '/new', isLoggedIn, campgrounds.renderNewForm ); // Fill out a new campground

router.route( '/:id')
    .get( catchAsync( campgrounds.showCampground)) // details route
    .put( isLoggedIn, isOwner, upload.array('image'), validateCampground, catchAsync( campgrounds.updateCampground )) // Stores edit changes of a campground
    .delete( isLoggedIn, isOwner, catchAsync( campgrounds.deleteCampground)); // Removes a campground and its reviews 

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync( campgrounds.renderEditForm )) // Edit route to change a campground


module.exports = router;