const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createNewCamp = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    console.log(campground);
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.displayCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author');
    if(!campground ) {
        req.flash('error', 'Campground not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground ) {
        req.flash('error', 'Campground not found.');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new : true});
    campground.images.push(...imgs);
    if(req.body.deleteImages) {
        for(let img of req.body.deleteImages) {
            campground.images.splice((campground.images.findIndex(i => i.filename == img)), 1);
            cloudinary.uploader.destroy(img);
            //using splice cuz $pull definitely not working....
        }
    }
    await campground.save();
    req.flash('success', 'Successfully updated Campground!');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Your Campground was successfully Deleted!');
    res.redirect('/campgrounds');
}