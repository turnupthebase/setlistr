var router = require("express").Router();
var db = require("../models");

router.get("/api/user", function(req, res) {
    db.User.findById("carladdg").then(function(user) {
        res.json(user);
    })
})

module.exports = router;