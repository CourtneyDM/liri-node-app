console.log("this is loaded.");
var spotifyAPI = require("node-spotify-api");

// var spotify = require("./spotifyKeys.js");

var spotify = new spotifyAPI({
    id: "305ec94b7ec54b62a358bb9be0862a0a",
    secret: "bf2fec6281954945a293244fe4026cf6"
});

exports.twitter = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

exports.spotify = {
    id: spotify.id,
    secret: spotify.secret,
    // client_id: spotify.client_id,
    // client_secret: spotify.client_secret,
    redirect_uri: spotify.redirectUri
}