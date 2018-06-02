require("dotenv").config();
var SpotifyWebApi = require('spotify-web-api-node');

var credentials = {
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: process.env.SPOTIFY_CALLBACK_URL
}

var spotifyApi = new SpotifyWebApi(credentials);

module.exports = spotifyApi;