var path = require("path");
var router = require("express").Router();

router.get("/", function(req, res) {
    if (req.user) {
        console.log("There is a user in the session.");
        res.sendFile(path.join(__dirname, "../public/home.html"));
    } else {
        console.log("There is no user in the session.");
        res.sendFile(path.join(__dirname, "../public/login.html"));
    }
})

router.get("/home", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
})

module.exports = router;