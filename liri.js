// Include Environment Variables
require("dotenv").config();

// Include Node Modules
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
function userCommand(cmd, cmdOption) {
    switch (cmd) {
        case "my-tweets":
            getTweets(cmd);
            break;
        case "movie-this":
            movie = cmdOption;
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
    return cmd;
}

// Get Twitter information
function getTweets(command) {
    // Declare new Twitter object
    var client = new Twitter(keys.twitter);

    // Call to Twitter API
    client.get("statuses/user_timeline", (error, tweets) => {
        if (error) return console.log(error);

        printToScreen(command, tweets);
        logEntry(command, tweets);
    });
    return console.log("SUCCESS: Logged Tweets.");
}

// Get OMDB movie information
function getMovie(command, movie) {
    // If no movie title was provided, set default title to Mr. Nobody
    if (movie === "" && process.argv.length < 4) {
        movie = "Mr. Nobody";
    } else {
        // Loop through the command line arguments to be used in movie title query
        for (var i = 3; i < process.argv.length; i++) {
            if (i >= 3 && i < process.argv.length - 1) {
                movie += process.argv[i] + "+";
            } else {
                movie += process.argv[i];
            }
        }
    }
    // Declare variable for OMDB URL to be used for API queries
    var queryURL = `http://www.omdbapi.com/?t="${movie}"&y=&plot=short&apikey=trilogy`;

    // Call to OMDB API
    request(queryURL, (error, response, body) => {
        // If an error occurred or the movie title cannot be found, return error message
        if (error || !JSON.parse(body).Title) return console.log(error);
        else {
            let movieObj = {
                Title: JSON.parse(body).Title,
                Year: JSON.parse(body).Released,
                IMDB_Rating: JSON.parse(body).imdbRating,
                Rotten_Tomatoes: JSON.parse(body).Ratings[1].Value,
                Country: JSON.parse(body).Country,
                Language: JSON.parse(body).Language,
                Plot: JSON.parse(body).Plot,
                Actors: JSON.parse(body).Actors
            };

            printToScreen(command, movieObj);
            logEntry(command, movieObj);
        }
    });
    return console.log("SUCCESS: Logged Movie Details.");
}

// Get Spotify information
function getSpotify(command, song) {
    let spotify = new Spotify(keys.spotify);

    let musicObj = { Artist: "", Title: "", Preview: "", Album: "" };

    // If a song tile was not provided, set a default song title
    if (song === "" && process.argv.length < 4) {
        song = "The Sign";
    } else {
        // Loop through the command line arguements to be used in song title query
        for (var i = 3; i < process.argv.length; i++) {
            if (i >= 3 && i < process.argv.length - 1) {
                song += process.argv[i] + "+";
            } else {
                song += process.argv[i];
            }
        }
    }

    // Call to Spotify API
    spotify.search({ type: "track", query: song, limit: 1 }, (error, data) => {
        if (error) {
            error = "ERROR: Song Title Not Found.";
            return console.log(error);
        } else {
            // ...otherwise, store data in song Object
            let songData = data.tracks.items[0];

            musicObj.Artist = songData.artists[0].name;
            musicObj.Title = songData.name;
            musicObj.Preview = songData.preview_url;
            musicObj.Album = songData.album.name;
        }
        printToScreen(command, musicObj);
        logEntry(command, musicObj);
    });

    return console.log("SUCCESS: Logged Song Details.");
}

// Get File Stream command from file
function getFileInput(command) {
    let textFile = "./random.txt";
    let fsCmd = "";
    let fsOpt = "";

    // Read the file stream to get command
    fs.readFile(textFile, "utf8", (error, data) => {
        if (error) {
            error = "ERROR: Could not read from file";
            return console.log(error);
        } else {
            // ...otherwise, create and array to contain file content, increment index when a comma is read
            let inputArr = data.split(",");

            // Create and initialize variables for file stream command and options based on input array
            fsCmd = inputArr[0];
            fsOpt = inputArr[1];
        }
        // Test the command read from file stream and execute corresponding function
        userCommand(fsCmd, fsOpt);
    });
    return true;
}

// LOG Results to File
function logEntry(command, result) {
    fs.appendFile(
        logFile,
        '------------------------------\nRequest: "' +
        command.toUpperCase() +
        '"\n',
        error => {
            if (error) {
                return console.log("ERROR: Unable to log command.");
            }
        }
    );

    if (command === "my-tweets") {
        result.forEach(tweet => {
            fs.appendFile(logFile, `Tweet: ${tweet.text}` + "\n", error => {
                if (error) return console.log("Unable to log Tweet.");
            });
        });
    }
    else {
        for (var item in result) {
            fs.appendFile(logFile, "\n" + `${item}: ${result[item]}`, error => {
                if (error) return console.log(`ERROR: Unable to log results`);
            });
        }
    }

    fs.appendFile(logFile, "\n------------------------------\n", error => {
        if (error) return console.log("ERROR");
    });
    return;
}

// Print Results to Screen
function printToScreen(command, result) {
    if (command === "my-tweets") {
        var i = 1;
        result.forEach(tweet => {
            console.log(`Tweet ${i}: ${tweet.text}`);
            i++;
        });
    } else {
        for (var item in result) {
            console.log(`${item}: ${result[item]}`);
        }
    }
}
// Call userCommand to run code
userCommand(cmd, cmdOption);