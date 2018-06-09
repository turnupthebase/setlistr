$.get("/api/user", function(user) {
    $("#display-name").text(user.displayName);
    $("#profile-image").attr("src", user.profileImage);

    displayUserPlaylists(user.playlists);
})

$.get("/api/playlists", function(playlists) {
    displayGlobalPlaylists(playlists);
})

$(document).on("click", ".top-artist", function() {
    var artist = $(this).data("artist");
    getSetlist(artist);
})

$("#search-artist").on("click", function() {
    event.preventDefault();

    if ($("#artist-input").val().trim()) {
        $("#setlist-error").text("");
        var artist = $("#artist-input").val().trim();
        $("#artist-input").val("");
        getSetlist(artist);
    } else {
        $("#artist-input").val("");
    }
})

$("#create-playlist").on("click", function() {
    event.preventDefault();
    $("#setlist-buttons").hide(); 
    $(".fa-spinner").show();

    var artist = $("#setlist-artist").text();
    var setlistSongs = [];
    $(".setlist-song").each(function() {
        setlistSongs.push($(this).text());
    })

    $.post("/api/playlist", { artist: artist, setlistSongs: setlistSongs }, function(playlist) {
        $("#search-again").show();
        $(".fa-spinner").hide();
        
        if (playlist.error) {
            $("#playlist-outcome").text("Sorry, we were unable to create a playlist. Please try again.");
        } else {
            $("#playlist-outcome").text("Playlist successfully created!");

            $.get("/api/user/playlists", function(user) {
                displayUserPlaylists(user.playlists);
            })

            $.get("/api/playlists", function(playlists) {
                displayGlobalPlaylists(playlists);
            })
        }
    })
})

$("#clear-search, #search-again").on("click", function() {
    $("#setlist-area").hide();
    $("#setlist-songs").empty();
    $("#playlist-outcome").text("");
    $("#search-again").hide();
    $("#setlist-buttons").show();
    $("#search-area").show();
})

// Helper functions

function getSetlist(artist) {
    $.get(`/api/setlist/${artist}`, function(allSetlists) {
        if (allSetlists.error) {
            $("#setlist-error").text("Sorry. We were unable to find a setlist for that artist.");
        } else {
            var mostRecentSetlist = allSetlists.setlist.find(function(singleSetlist) {
                return singleSetlist.sets.set.length;
            });

            var setlistSongs = [];
            mostRecentSetlist.sets.set.forEach(function(subset) {
                subset.song.forEach(function(song) {
                    setlistSongs.push(song.name);
                })
            })

            $("#setlist-artist").text(mostRecentSetlist.artist.name);
            $("#setlist-songs").empty();
            setlistSongs.forEach(function(song) {
                $("#setlist-songs").append("<li class='setlist-song'>" + song + "</li>");
            })
            $("#setlist-area").show();
            $("#search-area").hide();
        }
    })  
}

function displayUserPlaylists(playlists) {
    $("#user-playlists").empty();
    playlists.forEach(function(playlist) {
        $("#user-playlists").append(`<a target="_blank" href="${playlist.playlist_link}"><li class="user-playlist">${playlist.artist}</li></a>`)
    })
}

function displayGlobalPlaylists(playlists) {
    $("#global-playlists").empty();
    playlists.forEach(function(playlist) {
        $("#global-playlists").append(`<li class="top-artist" data-artist="${playlist.artist}">${playlist.artist}: ${playlist.count} created</li>`);
    })
}