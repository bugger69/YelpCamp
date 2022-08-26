const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.createUser = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) {return next(err);}
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
        console.log(registeredUser);
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) =>{
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err){ return next(err);}
        req.flash('success', "Goodbye!!!");
        res.redirect('/campgrounds');
    });
}