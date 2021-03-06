const Passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys')
const User = require('../models/user-models')

Passport.serializeUser((user, done) => {
    done(null, user.id);
});

Passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    });
});

Passport.use(
    new GoogleStrategy({
        //options for the strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret

    }, (accessToken, refreshToken, profile, done) => {
        //check if user already exists
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                //already have the user
                console.log('user is: ', currentUser);
                done(null, currentUser)
            } else {
                //if not, create new user
                new User({
                    username: profile.displayName,
                    googleId: profile.id
                }).save().then((newUser) => {
                    console.log('new user created:' + newUser);
                    done(null, newUser);
                })
            }
        })

    }));