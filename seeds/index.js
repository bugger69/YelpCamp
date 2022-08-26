const mongoose = require('mongoose');
const Campground = require('./../models/campground');
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers');

const db = mongoose.connection;

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connection Open!!!");
}

main().catch(err => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    const del = await Campground.deleteMany({});
    console.log(del);
    for(let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] },
            images :[{
                url: 'https://res.cloudinary.com/djjxxzf85/image/upload/v1660210642/YelpCamp/duhzqrjyjsu9oeialuxv.png',
                filename: 'YelpCamp/ohyqm1dweloxu9c5phxl'
              },
              {
                url: 'https://res.cloudinary.com/djjxxzf85/image/upload/v1660129328/YelpCamp/qlmekokfwyphis7anfwc.png',
                filename: 'YelpCamp/vypecs0juua1wtysdyys'
              },
              {
                url: 'https://res.cloudinary.com/djjxxzf85/image/upload/v1660123715/YelpCamp/odslosdwodgboe8b84ad.png',
                filename: 'YelpCamp/rwpu0btafzqtuuyody1s'
              }],
            price: Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100)/100,
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Non laudantium molestiae, neque et nobis voluptatem deleniti quam dicta consequuntur suscipit fugit iusto incidunt nulla modi commodi eaque atque quisquam nisi!`,
            author: '62ea4aa028b1dc0c2b97ad14',
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await camp.save();
    }
}

seedDB()
.then(() => {
    db.close();
})