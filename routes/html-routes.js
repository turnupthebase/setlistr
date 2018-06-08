var path = require("path");
var router = require("express").Router();
var spotifyApi = require("../utils/spotify");

router.get("/", function(req, res) {
    if (req.user) {
        console.log("There is a user in the session.");
        spotifyApi.setAccessToken(req.user.access_token);
        spotifyApi.setRefreshToken(req.user.refresh_token);
        res.redirect("/home");
    } else {
        console.log("There is no user in the session.");
        res.sendFile(path.join(__dirname, "../public/login.html"));
    }
})

router.get("/home", function(req, res) {
    if (req.user) {
        res.sendFile(path.join(__dirname, "../public/home.html"));
    } else {
        res.redirect("/");
    }
})

module.exports = router;