var path = require("path");
var router = require("express").Router();
var spotifyApi = require("../utils/spotify");

router.get("/", function(req, res) {
    if (spotifyApi.getAccessToken()) {
        res.redirect("/home");
    } else {
        res.sendFile(path.join(__dirname, "../public/login.html"));
    }
})

router.get("/home", function(req, res) {
    if (spotifyApi.getAccessToken()) {
        res.sendFile(path.join(__dirname, "../public/home.html"));
    } else {
        res.redirect("/");
    }})

module.exports = router;