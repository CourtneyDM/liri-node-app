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

// Create a file to log output
var logFile = "./log.txt";

// Test the command line option selected by user
switch (cmd) {
    case "my-tweets":
        getTweets(cmd);
        break;
    case "movie-this":
        getMovie(cmd, cmdOption);
        break;
    case "do-what-it-says":
        getFileInput(cmd);
        break;
    case "spotify-this-song":
        getSpotify(cmd, cmdOption);
        break;
    default:
        console.log("FAILURE: unable to process command.");
        break;
}


// Get Twitter information
function getTweets(command) {

    // Append command to the log file
    fs.appendFile(logFile, "\nCommand: " + command + "\n", error => {
        if (error) {
            error = "ERROR: Unable to Log Command.";
            return console.log(error);
        }
    });

    // Declare new Twitter object
    var client = new Twitter(keys.twitter);

    // Use GET method to retrieve user's tweets - returns 20 tweets by default
    client.get("statuses/user_timeline", (error, tweets) => {
        if (error) {
            return console.log(error);
        }
        var i = 1;

        // Get each tweet from the Tweets Object...
        tweets.forEach(tweet => {

            // ...display each Tweet to the console
            console.log(`Tweet ${i}: ${tweet.text}` + "\n");

            // ...append each Tweet to the log file
            fs.appendFile(logFile, `Tweet ${i}: ${tweet.text}` + "\n", error => {
                if (error) {
                    return console.log("Unable to log Twitter item.");
                }
            })
            i++;
        });
    });
}


// Get OMDB movie information
function getMovie(command, movie) {

    // Append command to the log file
    fs.appendFile(logFile, "\nCommand: " + command + "\n", error => {
        if (error) {
            error = "ERROR: Unable to Log Command.";
            return console.log(error);
        }
    });

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

        // If an error occurred or the movie title cannot be found, return error message
        if ((error) || (!JSON.parse(body).Title)) {
            error = "ERROR: Movie Title Not Found.";
            fs.appendFile(logFile, `${movie}: ${error}` + "\n", error => {
                if (error) {
                    console.log("ERROR: Error Message Not logged.");
                }
            });
            return console.log(error);
        }

        // ...otherwise, create a movie Object and set its properties
        else {
            var movieObj = {
                Title: JSON.parse(body).Title,
                Year: JSON.parse(body).Released,
                IMDB_Rating: JSON.parse(body).imdbRating,
                Rotten_Tomatoes: JSON.parse(body).Ratings[1].Value,
                Country: JSON.parse(body).Country,
                Language: JSON.parse(body).Language,
                Plot: JSON.parse(body).Plot,
                Actors: JSON.parse(body).Actors
            };

            // Get each item in the movie Object...
            for (var item in movieObj) {

                // ...display movie Object item to the console
                console.log(`${item}: ${movieObj[item]}`);

                // ...add the movie Object item to the log file
                fs.appendFile(logFile, `${item}: ${movieObj[item]}` + "\n", error => {
                    if (error) {
                        error = "FAILED: Unable to Log Movie Details.";
                        return console.log(error);
                    }
                });
            }
            console.log("SUCCESS: Logged Movie Details.");
        }
    });
    // End of Request
}


// Get Spotify information
function getSpotify(command, song) {
    var spotify = new Spotify(keys.spotify);

    // Append command to the log file
    fs.appendFile(logFile, "\nCommand: " + command + "\n", error => {
        if (error) {
            error = "ERROR: Unable to Log Command."
            return console.log(error);
        }
    });

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
            error = "ERROR: Song Title Not Found.";
            return console.log(error);
        }

        // ...otherwise, log information to console
        else {
            console.log(data);
            fs.appendFile(logFile, data, error => {
                if (error) {
                    error = "FAILED: Unable to Log Song Details.";
                    return console.log(error);
                }
            });
        }
    });
}

// Get File Stream command from file
function getFileInput(command) {
    var textFile = "./random.txt";

    // Append command to the log file
    fs.appendFile(logFile, "\nInitial command: " + command, error => {
        if (error) {
            error = "ERROR: Unable to log command.";
            return console.log(error);
        }
    });

    // Read the file stream to get command
    fs.readFile(textFile, "utf8", (error, data) => {

        // If an error occurred on the file read, return the error...
        if (error) {
            error = "ERROR: Could not read from file";
            return console.log(error);
        }

        // ...otherwise, create and array to contain file content, separating items when a comma is reached
        else {
            var inputArr = data.split(",");
        }

        // Create and initialize variables for file stream command and options based on input array
        var fsCmd = inputArr[0];
        var fsOption = inputArr[1];

        // Test the command read from file stream and execute corresponding function
        switch (fsCmd) {
            case "my-tweets":
                getTweets();
                break;
            case "movie-this":
                getMovie(fsCmd, fsOption);
                break;
            case "spotify-this-song":
                getSpotify(fsCmd, fsOption);
                break;
            default:
                console.log("FAILURE: Unable to process command.");
                break;
        }
    });
}

/********** END OF FILE **********/