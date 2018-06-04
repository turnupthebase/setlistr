var router = require("express").Router();
var spotifyApi = require("../utils/spotify");
var setlistfmClient = require("../utils/setlistfm");
var db = require("../models");

var userInfo = {
    userId: "",
    displayName: "",
    profileImage: ""
}

router.get("/api/user", function(req, res) {
    db.User.findOne({ where: { access_token: spotifyApi.getAccessToken() }}).then(function(user) {
        userInfo.userId = user.id;
        userInfo.displayName = user.display_name;
        userInfo.profileImage = user.profile_image;

        res.json(userInfo);
    })
})

router.post("/api/setlist", function(req, res) {
    var artist = req.body.artist;
    setlistfmClient.searchSetlists({
        artistName: artist
    }).then(function(results) {
        if (results.code == 404) {
            res.json({ error: "Setlist not found." });
        } else {
            res.json(results)
        }
    }).catch(function(error) {});
});

router.post("/api/playlist", function (req, res) {
    var artist = req.body.artist;
    var setlistSongs = req.body.setlistSongs;
    var playlistId = "";
    var trackIds = [];

    spotifyApi.createPlaylist(userInfo.userId, artist + " Setlist").then(function(data) {
        console.log("Playlist created.");
        playlistId = data.body.id;

        setlistSongs.forEach(function(song, index) {
            spotifyApi.searchTracks(`track:${song} artist:${artist}`).then(function(data) {
                if (data.body.tracks.items.length) {
                    console.log("Song Found: " + song);
                    var trackId = data.body.tracks.items[0].uri;
                    trackIds.push(trackId);
                    console.log(trackIds.length);
                    console.log(setlistSongs.length);

                    checkIfSearchComplete(trackIds, setlistSongs, userInfo.userId, playlistId, res);
                } else {
                    setlistSongs.splice(index, 1);
                    console.log("Song Not Found: " + song);
                    console.log(trackIds.length);
                    console.log(setlistSongs.length);

                    checkIfSearchComplete(trackIds, setlistSongs, userInfo.userId, playlistId, res);
                }
            }, function(err) {
                console.log("Search Error: ", err);

                spotifyApi.unfollowPlaylist(userInfo.userId, playlistId).then(function(data) {
                    console.log("Playlist removed.");
                }, function(err) {
                    console.log("Playlist Unfollow Error: ", err);
                });
            })
        })
    }, function (err) {
        console.log("Playlist Creation Error: ", err);
    })
})

module.exports = router;

// Helper Functions

function checkIfSearchComplete(trackIds, setlistSongs, userId, playlistId, res) {
    if (trackIds.length === setlistSongs.length) {
        console.log("Search complete.");

        spotifyApi.addTracksToPlaylist(userId, playlistId, trackIds).then(function(data) {
            console.log("Tracks added.");
            res.end();
        }, function (err) {
            console.log("Track Add Error: ", err);
        })
    } else {
        console.log("Search not yet complete.");
        return;
    }
}