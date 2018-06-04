var router = require("express").Router();
var spotifyApi = require("../utils/spotify");
var setlistfmClient = require("../utils/setlistfm");
var db = require("../models");

// Grab user in the beginning and store pertinent info in global vars? Then use that for all other requests? And can strip out of create playlist
var userId;
var accessToken;
router.get("/api/user", function(req, res) {
    res.json();
})

router.post("/api/setlist", function(req, res) {
    var artist = req.body.artist;
    setlistfmClient.searchSetlists({
        artistName: artist
    }).then(function(results) {
        res.json(results)
    }).catch(function(error) {});
});

router.post("/api/playlist", function (req, res) {
    var artist = req.body.artist;
    var setlistSongs = req.body.setlistSongs;

    db.User.findOne({ where: { access_token: spotifyApi.getAccessToken() } }).then(function(user) {
        var userId = user.id;

        spotifyApi.createPlaylist(userId, artist + " Setlist").then(function(data) {
            playlistId = data.body.id;

            setlistSongs.forEach(function(song) {
                spotifyApi.searchTracks(`track:${song} artist:${artist}`).then(function(data) {
                    if (data.body.tracks.items.length) {
                        console.log(song);
                        var trackId = data.body.tracks.items[0].uri;
                        
                        spotifyApi.addTracksToPlaylist(userId, playlistId, [trackId]).then(function(data) {
                            console.log('Added tracks to playlist!');
                        }, function (err) {
                            console.log('Something went wrong!', err);
                        })
                    } else {
                        return;
                    }
                }, function(err) {
                    console.log(err);
                })
            })
        }, function (err) {
            console.log('Something went wrong!', err);
        }).then(function(data) {
            res.end();
        })
    })
})

module.exports = router;