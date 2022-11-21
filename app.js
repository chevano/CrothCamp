if( process.env.NODE_ENV !== "production" ) {
    require( 'dotenv' ).config();
}

const express = require( 'express' );
const path = require( 'path' );
const mongoose = require( 'mongoose' );
const methodOverride = require( 'method-override' );
const ejsMate = require( 'ejs-mate' );
const session = require('express-session');
const flash = require( 'connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const User = require( './models/user' );
const ExpressError = require( './utils/ExpressError' );


const userRoutes = require( './routes/users' );
const campgroundRoutes = require( './routes/campgrounds' );
const reviewRoutes = require( './routes/reviews' );

const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/croth-camp';
const secret = process.env.SECRET || "mysecret";

const app = express(); // Creates an instance of the server

mongoose.connect( dbUrl );


// Check for errors or successful connection after connecting
const db = mongoose.connection;
db.on( "error", console.error.bind( console, "connection error:" ));
db.once( "open", () => {
    console.log( "Database connected" );
});

app.engine( 'ejs', ejsMate ); // Allow us to use additional functionality of ejs like <% body %>

app.set( 'view engine', 'ejs' ); // Allow us to use ejs
app.set( 'views', path.join(__dirname,'views' )); // Execute the views dir from anywhere



app.use( express.urlencoded({ extended: true })); // To gain access to req.body
app.use( methodOverride('_method') ); // Execute other http request methods like PUT or PATCH
app.use( express.static( path.join(__dirname, 'public' )));
app.use( mongoSanitize() ); // Removes special characters

// stores the session in MongoDB 
const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on( "error", function (error) {
    console.log( "SESSION STORE ERROR", error );
});

const sessionConfig = {
    store,
    secret,
    name: "session", 
    resave: false,
    saveUninitialized: true,
    cookie: {
        // expires a week from now
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.use( session(sessionConfig) );
app.use( flash() );


//Passport Setup 
app.use( passport.initialize() );
app.use( passport.session() );
passport.use( new localStrategy( User.authenticate() ) );

passport.serializeUser( User.serializeUser() ); // tells how to store a user in a session
passport.deserializeUser( User.deserializeUser() ); // tells how to get a user out of a session

// Middleware that stores the flashes from req to res in a key 
// called success so that we can access it globally ( views/layout/boilerplate )
app.use(( req, res, next ) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash( "success" );
    res.locals.error = req.flash( "error" );
    next();
});


// Route Handlers
app.use( '/', userRoutes );
app.use( '/campgrounds', campgroundRoutes );
app.use( '/campgrounds/:id/reviews', reviewRoutes );

// home route
app.get( '/', ( req, res ) => {
    res.render( "home" );
});

// * matches an unknown route and 
// displays an error to the user for having an incorrect url
app.all("*", ( req, res, next ) => {
    next(new ExpressError( "Page Not Found", 404 ));
});

// Error Handler, sets the default status code 
// to have a server side error and a default message
app.use(( err, req, res, next ) => {
    const { statusCode = 500 } = err;
    if ( !err.message ) 
        err.message = 'Oh No, Something Went Wrong!'
    res.status( statusCode ).render( 'error', { err } );
});

const port = process.env.PORT || 3000;
app.listen( port, () => {
    console.log( `Listening on port ${port}` );
});