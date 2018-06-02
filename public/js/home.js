// on load, grab and display information on user from api/user

$("#search-artist").on("click", function() {
    $.get("/api/setlist", function(allSetlists) {
        var mostRecentSetlist = allSetlists.setlist.find(function(singleSetlist) {
            return singleSetlist.sets.set.length;
        });
        
        mostRecentSetlist.sets.set.forEach(function(subset) {
            console.log(subset);
        })

    })
})

$("#create-playlist").on("click", function() {
    $.get("/api/playlist", function(playlist) {
        console.log("Playlist created!");
    })
})