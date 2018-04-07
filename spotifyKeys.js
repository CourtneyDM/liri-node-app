var SpotifyWebAPI = require("node-spotify-api");

var spotifyAPI = new SpotifyWebAPI({
    id: "305ec94b7ec54b62a358bb9be0862a0a",
    secret: "bf2fec6281954945a293244fe4026cf6"
});

module.exports = {
    spotifyAPI: spotifyAPI
};