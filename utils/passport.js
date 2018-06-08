require("dotenv").config();
var SpotifyStrategy = require("passport-spotify").Strategy;
var db = require("../models");

module.exports = function(passport) {
    passport.use(new SpotifyStrategy({
        clientID: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        callbackURL: process.env.SPOTIFY_CALLBACK_URL
    }, function(accessToken, refreshToken, profile, done) {
        var userInfo = {
            id: profile.id,
            display_name: profile.displayName,
            email: profile.emails[0].value,
            profile_image: profile.photos[0],
            access_token: accessToken,
            refresh_token: refreshToken
        }

        db.User.upsert(userInfo).then(function(result) {
            db.User.findById(userInfo.id).then(function(user) {
                done(null, user);
            })
        }).catch(done);
    }))

    passport.serializeUser(function(user, done) {
        console.log("Serializing user.");
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done) {
        console.log("Deserializing user.");
        db.User.findById(id).then(function(user) {
            done(null, user);
        })
    })
}