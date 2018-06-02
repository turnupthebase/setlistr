require("dotenv").config();
var setlistfm = require("setlistfm-js");

var setlistfmClient = new setlistfm({
    key: process.env.SETLISTFM_KEY,
    format: "json",
    language: "en",
});

module.exports = setlistfmClient;