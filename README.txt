1) touch README.txt app.js
2) npm init
3) npm i express mongoose ejs path
4) Require express and open a channel to listen
4a) const express = require("express"); const app = express(); app.listen(3000,() => { console.log("port 3000");
5) Write restful routes
5a) app.get("/", (req,res) => { res.send ("Croth Camp Homepage") })
6) Start the server
6a) nodemon app.js
6b) localhost:3000
--------------------- TEST --------------------
7) Setup ejs to work, therefore create the view folder and create home.ejs inside
7a) mkdir views
7b) touch home.ejs
8) Put some data in the home.ejs file for testing later
9) Set the view engine to ejs, and allow the computer to find the views folder
9a) const path = require('path');
9b) app.set('view engine', 'ejs');
9c) app.set('views', path.join(__dirname, 'views'));
10) Render home.ejs
10a) app.get('/home', (req,res) => { res.render("home")})
11) Check whether the views folder is setup by rendering home.ejs
11a) localhost:3000/home
--------------------- TEST --------------------
12) mkdir models
13) cd models
14) touch campground.js
15) Create a mongoose Schema inside campground.js
15a) const mongoose = require('mongoose');
15b) const Schema = mongoose.Schema;
15c) const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
})
16) Export Schema
16a) module.exports = mongoose.model("Campground", CampgroundSchema);
17) Require mongoose in app.js and set up the database
17a) const mongoose = require('mongoose');
18) Connect to mongodb default port
18a) mongoose.connect('mongodb://localhost:27017/croth-camp');
19) Check for error or successful connection after connecting
19a) const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
20) Start mongodb server in terminal
20a) brew services start mongodb-community@6.0
20aa) brew services stop mongodb-community@6.0 (stop)
--------------------- TEST --------------------
21) Check whether the campground model works
21a) const Campground = require('./models/campground');
21b) app.get('/makeCampground', async(req, res) => {
    const campground = new Campground({
        title: "My Backyard",
        description: "Camping with the family"
    });
    await campground.save();
    res.send(campground);
});
--------------------- TEST --------------------
22) type 'mongosh' in terminal
23) use croth-camp
24) db.campgrounds.find()
--------------------- TEST --------------------
25) Create a seed folder with sample data which includes cities.js, seedHelper.js
26) Delete the sample campground and insert another
26a) const seedDB = async() => {
    await Campground.deleteMany({});
    const campground = new Campground({ title: "pink field"});
    await campground.save();
}
27) Create 50 new campground at random
--------------------- TEST --------------------
28) Remove makeCampground route that was use for testing the campground model from app.js
29) Create a route to access all campgrounds (GET) in app.js
29a) app.get('/campgrounds', async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds } );
});
30) Create a detail route (GET) in app.js
30a) app.get('/campgrounds/:id', async(req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", { campground } );
});
--------------------- TEST --------------------
31) Create another route (GET) in app.js
31a) app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/new");
});
32) Create another route (POST) in app.js
app.post('/campgrounds', async(req, res) => {
    res.send(req.body);
});
33) Make sure that we get access to the body in req.body in app.js
33a) app.use(express.urlencoded({ extended: true }))
34)) Create a POST form in new.ejs to submit data to /campgrounds
34a) app.post('/campgrounds', async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${ campground._id }`);
});
--------------------- TEST --------------------
35) Create an edit route (GET) in app.js
35a) app.get('campgrounds/:id/edit', async(req, res) => {
    const campground = await Campground.findById( req.params.id );
    res.render("campgrounds/edit", { campground } );
});
36) Create an edit page (edit.ejs) in campgrounds
37) Install method-override to send (PUT) or (PATH) request throught the browser
37a) npm i method-override
38) Require method-override in app.js
38a) const methodOverride = require('method-override');
39) Tell the server (express) to always use it
39a) app.use(methodOverride('_method'));
--------------------- TEST --------------------
40) Create a PUT route to store changes made on the edit page
40a) app.put('/campgrounds/:id', async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate( id, { ...req.body.campground });
    res.redirect(`/campgrounds/${ campground._id }`);
});
--------------------- TEST --------------------
41) Create a DELETE route in app.js
41a) app.delete('/campgrounds/:id', async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});
--------------------- TEST --------------------
42) Install ejs mate for the layout folder
42a) npm i ejs-mate
43) require ejs-mate in app.js
44) set view engine to use ejs-mate
45) Create the layouts folder inside views
46) Create a boilerplate.ejs file inside layout
47) Create a partials folder inside views
48) Create a footer.ejs and a navbar.ejs file inside partials
49) Replace the boilerplate code in all the .ejs files with <% layout('layouts/boilerplate')%>
--------------------- TEST --------------------
50) Go to source.unsplash.com for images
50a) source.unsplash.com/collection/483251
51) Run seeds/index.js to seed the mongodb
--------------------- TEST --------------------
52) Create a utils folder and inside create an Error class and a class to pass the error to the error handler
52a) mkdir utils
52b) touch ExpressError.js catchAsync.js
53) wrap all async functions inside catchAsync
54) Check for errors on the user side using
(54a) app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
(55) Create an Error handler
(55a) app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
(56) Make an error template inside CrothCamp namely error.js
(57) Create an error handler function inside app.js
-------------------- TEST --------------------
(58) install Joi ( npm i joi)
(59) Add the joi validation to the campgroundSchema inside schemas.js
(60) Create a review model inside models (review.js)
(61) Update campground.js to have reviews as a field inside CampgroundSchema
(62) Update show.ejs to have a review section
(63) Add a post route for /campgrounds/:igvbc       bbb vbCd/reviews inside app.js
(64) Go to schemas.js and add the Joi validation for reviewSchema to prevent
wrong submission on the frontend using postman or similar tools
(65) Create a Middleware to validate reviewSchema in app.js
(66) Pass the middleware to the post route of '/campgrounds/:id/reviews'
(67) Add a delete button for each review
(68) Add a delete route in app.js to remove a review from the database
-------------------- TEST --------------------
(69) Install cookie-parser to use cookie in the application
(69a) npm install cookie-parser
(70) Install express-session to log info on the server side
that will flash message to the user and we will also use it for
authentication
(70a) npm i express-session
(71) Install connect-flash to flash a message to the user
(71a) npm install connect-flash
-------------------- TEST --------------------
(72) Restructure the entire application by placing the routes 
in app.js into a routes folder where each routes get separated
-------------------- TEST --------------------
(73) Set up flash to work in app.js, views/layout/boilerplate, and 
views/partials/flash
-------------------- TEST --------------------
(74) Set up Authentication and Authorization for the app using passport
(75) npm i passport passport-local passport-local-mongoose
(76) Create a user model in models/user.js and configure it 
to use passportLocalMongoose
(77) Config our application to use passport, and passport-local
(LocalStrategy) in app.js
-------------------- TEST --------------------
(78) Create a user route that will login and register a user in routes/user.js
(79) Go to LunarLogic/starability on github
(80) navigate to starability/ starability-css/starability-basic.css and copy the file
(81) Store the file in public/stylesheet/stars.css
(82) Update views/campgrounds/show to display the stars
(83) Check out demo at https://lunarlogic.github.io/starability/
(84) Set the form to accept file by changing the enctype from
application/x-www-form-urlencoded to multipart/form-data 
in views/campgrounds/new.ejs
(85) Install the Multer middleware to parse multi-part forms
(85a) npm i multer
(86) Set the post route in route/campgrounds to accept multiple files 
(86a) .post( upload.array('image'), (req, res) => {
    });
(86b) And add multiple at the end of the file input tag
    <input type="file" name="image" id="image" multiple>
(86c) console.log(req.files) to see the files when using multiple files else req.file
(87) Sign up for cloudinary and go click on the dashboard icons on the top left corner
(88) Install  dotenv middleware to side the api-key and others you get from cloudinary
(88a) npm i dovenv
(88b) Create a dotenv file at CrothCamp/.env
(89) Go to app.js and above require dotenv if we are not in production mode
(90) COPY the credentials from cloudinary and paste them into the .env file
(91) Take the files that multer is parsing and upload them to cloudinary,
to do this we must install another middleware called Multer Storage Cloudinary
(91a) npm i cloudinary multer-storage-cloudinary
(91b) Create cloudinary/index.js
(91c) require the necessary packages, and setup the config method refer to 
cloudinary npm and multer-storage-cloudinary for more details
(92) Copy the cdn link from a library (bs-custom-file-input) that will allow us
 to see how many files are uploaded and paste it in a script tag in views/layout/boilerplate
 -------------------- TEST --------------------
 (93) SIGN UP for MapBox and copy the token in .env file
 (94) npm install @mapbox/mapbox-sdk 
 (95) Go to controllers/campgrounds and import const mbxGeocoding =  @mapbox/mapbox-sdk/services/geocoding 
 to use the geocoding feature
 (96) Retrieve the mapbox token from the .env file
 (96a) const mapBox_Token = process.env.MAPBOX_TOKEN;
 (97) Create an instance of mbxGeocoding and set accessToken to mapBox_Token
 (97a) const geocoder = mbxGeocoding({ accessToken: mapBox_Token });
 (98) Retrieve the longitude and latitue for a given location in controller/campgrounds [createCampground]
 (98a) const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1 // Shows only 1 result
 }).send();
 (99) Update the model to accept geodata and name the field geometry, which has a type and coordinates
 (100) Set campground.geometry to geoData.body.features[0].geometry;
 (101) Copy the cdn from https://docs.mapbox.com/mapbox-gl-js/guides/install/
and paste it in views/layouts/boilerplate
(101a) <script src='https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.js'></script>
    <link href='https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css' rel='stylesheet' />
(102) Follow the code listed below on the cdn page and paste it in views/campgrounds/show.ejs 
-------------------- TEST --------------------
(103) npm i express-mongo-sanitize
(103a) The above installation removes . and $ from a query
(104) npm i sanitize-html
(104a) The above installation sanitize the html input
-------------------- TEST --------------------
(105) Deploy
(105a) heroku login, heroku create
(106) touch .gitignore ( github .gitignore node)
(107) git init
(107) git remote -v