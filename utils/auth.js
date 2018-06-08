require("dotenv").config();
var SpotifyStrategy = require("passport-spotify").Strategy;
var db = require("../models");

module.exports = function(passport) {
    passport.use(new SpotifyStrategy({
        clientID: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        callbackURL: process.env.SPOTIFY_CALLBACK_URL
    }, function(accessToken, refreshToken, expires_in, profile, done) {
        console.log(profile);
        console.log(profile.emails);
        console.log(profile.emails[0].value);
        var userInfo = {
            id: profile.id,
            display_name: profile.displayName,
            email: profile.emails[0].value,
            profile_image: profile.photos[0],
            access_token: accessToken,
            refresh_token: refreshToken
        }

        db.User.upsert(userInfo).then(function(user) {
            done(null, user);
        }).catch(done);

        // process.nextTick(function() {
            // console.log("\n\ncreating or updating user\n\n")
            // db.User.findOrCreate({
            //     where: {id: userId}, 
            //     defaults: userInfo
            // }).then(function(user) {
            //     console.log(user);
            //     done(null, user)
            // }).catch(done);
        // })
    }))

    passport.serializeUser(function(user, done) {
        console.log(user.id);
        console.log("\n\nserializing user\n\n")
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        console.log("\n\ndeserializing user\n\n")
        db.User.findById(id, function(err, user) {
            done(null, user);
        });
    });
}