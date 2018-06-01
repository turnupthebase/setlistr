require("dotenv").config();
var SpotifyStrategy = require("passport-spotify").Strategy;
var db = require("../models");

module.exports = function(passport) {
    passport.use(new SpotifyStrategy({
        clientID: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        callbackURL: process.env.SPOTIFY_CALLBACK_URL
    }, function(accessToken, refreshToken, expires_in, profile, done) {
        var userId = profile.id
        var userInfo = {
            display_name: profile.displayName,
            profile_image: profile.photos[0],
            access_token: accessToken,
            refresh_token: refreshToken
        }

        process.nextTick(function() {
            console.log("\n\ncreating or updating user\n\n")
            db.User.findOrCreate({where: {id: userId}, defaults: userInfo}).spread(function(user, created) {
                done(null, user)
            }).catch(done);
        })
    }))

    passport.serializeUser(function(user, done) {
        console.log("\n\nserializing user\n\n")
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        console.log("\n\ndeserializing user\n\n")
        db.User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}