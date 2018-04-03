require("dotenv").config()

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var Request = require("request");
var keys = require("./keys.js");

var command = process.argv[2];
var mediaParam = process.argv[3];
var tweetCount = 20;
var omdbQuery = "http://www.omdbapi.com/?i=tt3896198&apikey=fdc4c5cf";

var omdbObj = {
    url: "http://www.omdbapi.com",
    apikey: "fdc4c5cf",
    type: process.argv[3]
};

if (command === "my-tweets") {
    var client = new Twitter(keys.twitter);

    client.get("statuses/user_timeline", tweetCount, (error, tweets) => {
        var i = 1;
        if (error) throw (error);
        tweets.forEach(tweet => {
            console.log(`Tweet ${i}: + ${tweet.text}` + "\n");
            i++;
        });
    });
}

if (command === "spotify-this-song") {
    var spotify = new Spotify(keys.spotify);
    spotify.search({
        type: "track",
        query: process.argv[3]
    },
        data => {
            console.log(data);
        }
    );
}
// if (command === "movie-this") { 

// }
// if (command === "do-what-it-says") { }