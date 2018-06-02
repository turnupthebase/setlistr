require("dotenv").config();
var router = require("express").Router();
var spotifyApi = require("../utils/spotify");
var db = require("../models");

var scopes = ["user-read-email", "playlist-modify-public", "playlist-modify-private"];
var state = process.env.SPOTIFY_STATE;
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

router.get("/auth/spotify", function(req, res) {
    res.redirect(authorizeURL);
})

router.get(process.env.SPOTIFY_CALLBACK_PATH, function(req, res) {
    var code = req.query.code;

    spotifyApi.authorizationCodeGrant(code).then(function(data) {
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);  
            spotifyApi.getMe().then(function(user) {
                var userInfo = {
                    id: user.body.id,
                    display_name: user.body.display_name,
                    email: user.body.email,
                    profile_image: user.body.images[0].url,
                    access_token: spotifyApi.getAccessToken(),
                    refresh_token: spotifyApi.getRefreshToken()
                }
                
                db.User.upsert(userInfo).then(function(result) {
                    res.redirect("/home");
                })
            }, function(err) {
                console.log('Something went wrong!', err);
            });
        }, function(err) {
            console.log('Something went wrong!', err);
        }
    )
}, function(err) {
    res.status(err.code);
    res.send(err.message);
})

router.get("/auth/spotify/user", function(req, res) {

})

module.exports = router;