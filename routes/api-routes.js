var router = require("express").Router();
var spotifyApi = require("../utils/spotify");
var setlistfmClient = require("../utils/setlistfm");
var db = require("../models");

var userInfo = {
    userId: "",
    displayName: "",
    profileImage: "",
    playlists: []
}

router.get("/api/user", function(req, res) {
    db.User.findOne({ 
        where: { access_token: spotifyApi.getAccessToken() }
    }).then(function(user) {
        userInfo.userId = user.id;
        userInfo.displayName = user.display_name;
        userInfo.profileImage = user.profile_image;

        getUserPlaylists(userInfo, res);
    })
})

router.get("/api/user/playlists", function(req, res) {
    getUserPlaylists(userInfo, res);
})

router.get("/api/playlists", function(req, res) {
   var query = db.Playlist.findAll({
       attributes: ["artist", [db.sequelize.literal("COUNT(*)"), "count"]],
       group: "artist",
       order: [[db.sequelize.literal("count"), "DESC"]],
       limit: 3
   }).then(function(playlists) {
        console.log(query);
        res.json(playlists);
   })
})

router.get("/api/setlist/:artist", function(req, res) {
    var artist = req.params.artist;
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
        playlistLink = data.body.external_urls.spotify;

        setlistSongs.forEach(function(song, index) {
            spotifyApi.searchTracks(`track:${song} artist:${artist}`).then(function(data) {
                if (data.body.tracks.items.length) {
                    console.log("Song Found: " + song);
                    var trackId = data.body.tracks.items[0].uri;
                    trackIds.push(trackId);
                    console.log(trackIds.length);
                    console.log(setlistSongs.length);

                    checkIfSearchComplete(artist, trackIds, setlistSongs, userInfo.userId, playlistId, playlistLink, res);
                } else {
                    setlistSongs.splice(index, 1);
                    console.log("Song Not Found: " + song);
                    console.log(trackIds.length);
                    console.log(setlistSongs.length);

                    checkIfSearchComplete(artist, trackIds, setlistSongs, userInfo.userId, playlistId, playlistLink, res);
                }
            }, function(err) {
                console.log("Search Error: ", err);

                spotifyApi.unfollowPlaylist(userInfo.userId, playlistId).then(function(data) {
                    console.log("Playlist removed.");
                    res.json({ error: "Playlist creation failed." })
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

function checkIfSearchComplete(artist, trackIds, setlistSongs, userId, playlistId, playlistLink, res) {
    if (trackIds.length === setlistSongs.length) {
        console.log("Search complete.");

        spotifyApi.addTracksToPlaylist(userId, playlistId, trackIds).then(function(data) {
            console.log("Tracks added.");

            db.Playlist.create({
                playlist_id: playlistId,
                playlist_link: playlistLink,
                artist: artist,
                user_id: userId
            }).then(function(playlist) {
                res.end();
            });
        }, function (err) {
            console.log("Track Add Error: ", err);
        })
    } else {
        console.log("Search not yet complete.");
        return;
    }
}

function getUserPlaylists(userInfo, res) {
    db.Playlist.findAll({ 
        where: { user_id : userInfo.userId }, 
        order: [["createdAt", "DESC"]], 
        limit: 3 
    }).then(function(playlists) {
        userInfo.playlists = playlists;
        res.json(userInfo);
    })
}