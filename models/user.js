const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    }
});

// Adds on a field for username and password
// and ensure that username is unique
UserSchema.plugin( passportLocalMongoose );

module.exports = mongoose.model( 'User', UserSchema );