require("dotenv").config();

var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

var session = require("express-session");
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var passport = require("passport");

var db = require("./models");
var PORT = process.env.PORT || 8080;

var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    store: new SequelizeStore({
        db: db.sequelize
    }),
    resave: false,
    proxy: true
}))

require("./utils/auth")(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(require("./routes/auth-routes")(passport));

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log("App listening on: http://localhost:" + PORT);
    })
})

