$("#create-playlist").on("click", function() {
    $.get("/api/user", function(user) {
        var userId = user.id;
        var accessToken = user.access_token

        $.ajax({
            url: `https://api.spotify.com/v1/users/${userId}/playlists`,
            method: "POST",
            data: JSON.stringify({
              name: "test"
            }),
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json'
            },
            success: function(response) {
              var playlistId = response.id;

              $.ajax({
                  url: "https://api.spotify.com/v1/search",
                  method: "POST",
                  data: {
                      q: "use somebody kings of leon",
                      type: "track"
                  },
                  headers: {
                    'Authorization': 'Bearer ' + accessToken
                  },
                  success: function(response) {
                      console.log(response);
                  }
              })

              // Execute Spotify search for tracks from Setlist (forEach for setlist array?)
              // q=name:{name}&artist:{artist}&type=track
              // Get ID of that track
              // Spotify POST request to add track ID to playlist
            }
        });
    })
})