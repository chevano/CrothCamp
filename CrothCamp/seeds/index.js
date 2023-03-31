const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/croth-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Select a random element from the array (inbound)
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            owner: "636abf483d8f295da173f7e0",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dlewj240y/image/upload/v1668289839/CrothCamp/navzrhad1ysb7ro9ygky.jpg',
                    filename: 'CrothCamp/xck0obexx3ahlhag562d',
                },
                {
                    url: 'https://res.cloudinary.com/dlewj240y/image/upload/v1668289800/CrothCamp/aamezdcuthjmavgimhbe.jpg',
                    filename: 'CrothCamp/h5fuybtdapmpgmcdgitw',
                }
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});