console.log("this is loaded.");
var spotifyAPI = require("node-spotify-api");

// var spotify = require("./spotifyKeys.js");

exports.twitter = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

exports.spotify = {
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    redirect_uri: process.env.redirectUri
}
