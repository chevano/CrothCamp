const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review" // Reference the Review model inside review.js
        }
    ]
});

// Middleware that delete all the reviews of a single campground that matches the campground id
CampgroundSchema.post( "findOneAndDelete", async function ( doc ) {
    if( doc ) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model( "Campground", CampgroundSchema );