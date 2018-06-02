require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var db = require("./models");
var PORT = process.env.PORT || 8080;

var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require("./routes/auth-routes"));
app.use(require("./routes/html-routes"));
app.use(require("./routes/api-routes"));

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log("App listening on: http://localhost:" + PORT);
    })
})

