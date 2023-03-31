const Campground = require( '../models/campground' );
const { cloudinary } = require( '../cloudinary' );
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBox_Token = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBox_Token});


module.exports.index = async ( req, res ) => {
    const campgrounds = await Campground.find({});
    res.render( "campgrounds/index", { campgrounds } );
}

module.exports.renderNewForm =  ( req, res ) => {
    console.log( "req.session: [new] ", req.session );
    res.render( "campgrounds/new" );
}

module.exports.createCampground = async( req, res, next ) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
     }).send();
    const campground = new Campground( req.body.campground );

    const geometry = geoData.body.features[0].geometry;
    campground.geometry = geometry;
    campground.images = req.files.map( f => ({ url: f.path, filename: f.filename }));
    campground.owner = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash( "success", "You have successfully created a new campground!!!" );
    res.redirect(`/campgrounds/${ campground._id }`);
}

module.exports.showCampground = async ( req, res ) => {
    const campground = await Campground.findById( req.params.id ).populate({
        path:"reviews",
        populate: {
            path: "owner"
        }
    }).populate("owner");

    if( !campground ) {
        req.flash( "error", "Sorry, that Campground does not exist!!!" );
        return res.redirect( "/campgrounds" );
    }
    res.render("campgrounds/show", { campground } );
}

module.exports.renderEditForm = async ( req, res ) => {
    const { id } = req.params;
    const campground = await Campground.findById( id );

    if( !campground ) {
        req.flash( "error", "Sorry, that Campground doesn't exist!!!" );
        return res.redirect( "/campgrounds" );
    }
    res.render( "campgrounds/edit", { campground } );
}

module.exports.updateCampground = async( req, res ) => {
    const { id } = req.params;
    console.log( req.body );
    const campground = await Campground.findByIdAndUpdate( id, { ...req.body.campground });
    const images = req.files.map( f => ({ url: f.path, filename: f.filename })); // array of images

    campground.images.push( ...images ); // spread out the data in images
    await campground.save();

    if( req.body.deleteImages ) {
        for( let filename of req.body.deleteImages ) {
            await cloudinary.uploader.destroy( filename );
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
        console.log( campground );
    }
    req.flash( "success", "The Campground has successfully been updated!!!");
    res.redirect(`/campgrounds/${ campground._id }`);
}

module.exports.deleteCampground = async( req, res ) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete( id );
    req.flash( "success", "The Campground has successfully been deleted!!!" );
    res.redirect( "/campgrounds" );
}