require("dotenv").config()

// Node dependencies
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

// Include module that contains Twitter and Spotify access tokens and secrets
var keys = require("./keys.js");

// Use third command line parameter as command to execute - index is zero-based
var cmd = process.argv[2].toLowerCase();
var cmdOption = "";

// Test CLI command chosen by user
switch (cmd) {
    case "my-tweets":
        getTweets();
        break;
    case "movie-this":
        getMovie(cmdOption);
        break;
    case "do-what-it-says":
        getFileInput();
        break;
    case "spotify-this-song":
        getSpotify(cmdOption);
        break;
    default:
        console.log("unable to process your request.");
        break;
}

// Display Twitter information in console
function getTweets() {

    // Declare new Twitter object
    var client = new Twitter(keys.twitter);

    // Use GET method to retrieve user's tweets - returns 20 tweets by default
    client.get("statuses/user_timeline", (error, tweets) => {
        if (error) {
            return console.log(error);
        }
        var i = 1;
        tweets.forEach(tweet => {
            console.log(`Tweet ${i}: ${tweet.text}` + "\n");
            i++;
        });
    });
    return;
}

// Display movie information in console
function getMovie(movie) {

    // If no movie title was provided, set default title to Mr. Nobody 
    if ((process.argv.length < 4) || (movie === "")) {
        movie = "Mr. Nobody";
    }
    else {
        // Loop through the command line arguments to be used in movie title query
        for (var i = 3; i < process.argv.length; i++) {
            if (i >= 3 && i < process.argv.length - 1) {
                movie += process.argv[i] + "+";
            }
            else {
                movie += process.argv[i];
            }
        }
    }

    // console.log("Movie title: " + movie);

    // Declare variable for OMDB URL to be used for API queries
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    // Request to OMDB API
    request(queryURL, (error, response, body) => {
        if (error) {
            return console.log(error);
        }
        else {
            var movieObj = {
                title: JSON.parse(body).Title,
                year: JSON.parse(body).Released,
                IMDB: JSON.parse(body).imdbRating,
                rotten_tomatoes: JSON.parse(body).Ratings[1].Value,
                country: JSON.parse(body).Country,
                language: JSON.parse(body).Language,
                plot: JSON.parse(body).Plot,
                actors: JSON.parse(body).Actors
            };

            console.log(`Title: ${movieObj.title}`);
            console.log(`Year Released: ${movieObj.year}`);
            console.log(`IMDB Rating: ${movieObj.IMDB}`);
            console.log(`Rotten Tomatoes Rating: ${movieObj.rotten_tomatoes}`);
            console.log(`Country Produced: ${movieObj.country}`);
            console.log(`Language: ${movieObj.language}`);
            console.log(`Plot: ${movieObj.plot}`);
            console.log(`Actors: ${movieObj.actors}`);
        }
    });
}

// Display Spotify information in console
function getSpotify(song) {
    var spotify = new Spotify(keys.spotify);

    if ((process.argv.length < 4) || (song === "")) {
        song = "The Sign";
    }
    // TODO: FIX THIS
    else {
        // Loop through the command line arguements to be used in song title query
        for (var i = 3; i < process.argv.length; i++) {
            if (i >= 3 && i < process.argv.length - 1) {
                song += process.argv[i] + "+";
            }
            else {
                song += process.argv[i];
            }
        }
    }
    spotify.search({ type: "track", query: song }, (error, data) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log(data);
        }
    });
}

// Display command from file in console
function getFileInput() {
    var textFile = "./random.txt";

    fs.readFile(textFile, "utf8", (error, data) => {
        if (error) {
            return console.log(error);
        }
        else {
            var inputArr = data.split(",");
        }
        var fsCmd = inputArr[0];
        var fsOption = inputArr[1];
        console.log(fsCmd);
        console.log(fsOption);

        switch (fsCmd) {
            case "my-tweets":
                getTweets();
                break;
            case "movie-this":
                getMovie(fsOption);
                break;
            case "spotify-this-song":
                getSpotify(fsOption);
                break;
            default:
                console.log("Unable to process request.");
                break;
        }

    });
}