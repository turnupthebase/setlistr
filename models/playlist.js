module.exports = function(sequelize, DataTypes) {
    var Playlist = sequelize.define("Playlist", {
        playlist_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        playlist_link: {
            type: DataTypes.STRING,
            allowNull: false
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Playlist;
}