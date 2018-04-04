// Including Environment Variables
require("dotenv").config()

// Node dependencies
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

// Include module that contains Twitter and Spotify access tokens and secrets
var keys = require("./keys.js");

// Use the third command line argument as command to execute - indexing is zero-based
var cmd = process.argv[2].toLowerCase();
var cmdOption = "";

// Test the command line option selected by user
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


// Get Twitter information and display in console
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


// Get movie information and display in console
function getMovie(movie) {

    // If no movie title was provided, set default title to Mr. Nobody 
    if (movie === "") {
        if (process.argv.length < 4) {
            movie = "Mr. Nobody";
        }
        else {

            // Loop through the command line arguments to be used in movie title query
            for (var i = 3; i < process.argv.length; i++) {

                // If there are multiple arguments after the command, add them to the song title
                if (i >= 3 && i < process.argv.length - 1) {
                    movie += process.argv[i] + "+";
                }
                else {
                    movie += process.argv[i];
                }
            }
        }
    }

    // Declare variable for OMDB URL to be used for API queries
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    // Send request to OMDB API
    request(queryURL, (error, response, body) => {

        // If an error occurred, return the error
        if ((error) || (!JSON.parse(body).Title)) {
            return console.log(error);
        }
        // ...otherwise, create a movie Object and set its properties
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

            // Display movie details in the console
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


// Get Spotify information and display in console
function getSpotify(song) {
    var spotify = new Spotify(keys.spotify);

    // If a song tile was not provided, set a default song title
    if (song === "") {
        if (process.argv.length < 4) {
            song = "The Sign";
        }

        else {
            // Loop through the command line arguements to be used in song title query
            for (var i = 3; i < process.argv.length; i++) {

                // If there are multiple arguments after the command, add them to the song title
                if (i >= 3 && i < process.argv.length - 1) {
                    song += process.argv[i] + "+";
                }
                else {
                    song += process.argv[i];
                }
            }
        }
    }

    // Search Spotify for the song specified on command line
    spotify.search({ type: "track", query: song }, (error, data) => {

        // If an error occurred, return error...
        if (error) {
            return console.log(error);
        }

        // ...otherwise, log information to console
        else {
            console.log(data);
        }
    });
}

// Display command from file in console
function getFileInput() {
    var textFile = "./random.txt";

    fs.readFile(textFile, "utf8", (error, data) => {

        // If an error occurred, return the error...
        if (error) {
            return console.log(error);
        }

        // ...otherwise, create and array to contain file content, separating items when a comma is reached
        else {
            var inputArr = data.split(",");
        }

        // Create and initialize variables for file stream command and options based on input array
        var fsCmd = inputArr[0];
        var fsOption = inputArr[1];

        // Test the command read from file stream
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

/********** END OF FILE **********/