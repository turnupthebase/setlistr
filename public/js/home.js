// on load, grab and display information on user from api/user

$("#create-playlist").on("click", function() {
    $.get("/api/playlist", function(playlist) {
        console.log("Playlist created!");
    })
})