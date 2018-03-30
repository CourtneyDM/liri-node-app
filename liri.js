require("dotenv").config();
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

request("http://www.google.com", function (error, response, body) {
    console.log("error: " + error);
    console.log("statusCode: " + response);
    console.log("body: " + body);
});