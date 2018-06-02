var router = require("express").Router();
var spotifyApi = require("../utils/spotify");
var db = require("../models");

// Grab user in the beginning and store pertinent info in vars? Then use that for all other requests?

router.get("/api/playlist", function(req, res) {
    db.User.findOne({ where: {access_token: spotifyApi.getAccessToken()} }).then(function(user) {
        spotifyApi.createPlaylist(user.id, 'My Cool Playlist').then(function(data) {
            var playlistId = data.body.id;
            console.log('Created playlist!');

            // Need to loop through setlist tracks and search
            spotifyApi.searchTracks('track:Give Yourself A Try artist:The 1975').then(function (data) {
                var trackId = data.body.tracks.items[0].uri;

                // Add to playlist after search
                spotifyApi.addTracksToPlaylist(user.id, playlistId, [trackId]).then(function (data) {
                    console.log('Added tracks to playlist!');
                }, function (err) {
                    console.log('Something went wrong!', err);
                });
                
                res.end();
            }, function (err) {
                console.log('Something went wrong!', err);
            });
        }, function(err) {
            console.log('Something went wrong!', err);
        });
    })
})

module.exports = router;