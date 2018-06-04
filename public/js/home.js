$.get("/api/user", function(user) {
    console.log(user);
    // on load, grab and display information on user from api/user
})

var artist = "Coldplay";
// should be grabbed from user input, currently hardcoded for testing purposes

$("#search-artist").on("click", function() {
    $.post("/api/setlist", { artist: artist }, function(allSetlists) {
        if (allSetlists.error) {
            console.log("Error");
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
            
            $("#setlist").prepend("<h2 id='artist'>" + artist + "</h2>");
            setlistSongs.forEach(function(song) {
                $("#setlist-songs").append("<li class='setlist-song'>" + song + "</li>");
            })
        }
    })
})

$("#create-playlist").on("click", function() {
    var artist = $("#artist").text();
    var setlistSongs = [];
    $(".setlist-song").each(function() {
        setlistSongs.push($(this).text());
    })

    $.post("/api/playlist", { artist: artist, setlistSongs: setlistSongs }, function(playlist) {
        console.log("Playlist created!");
    })
})