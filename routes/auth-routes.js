var router = require("express").Router();

module.exports = function(passport) {
    router.get("/auth/spotify", passport.authenticate("spotify", {scope: ["playlist-modify-public"], showDialog: true}), function(req, res) {})

    router.get("/callback", passport.authenticate("spotify", { failureRedirect: "/" }, function(req, res) {
        res.redirect("/");
    }))

    return router;
}