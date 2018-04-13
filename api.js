// Include Environment Variables
require("dotenv").config();

// Include Node Modules
let request = require("request");

// Include Keys for API Calls
let keys = require("./keys");

// Use Twitter API to Get Tweets 
function getTweets(command) {
    // Declare new Twitter object
    let Twitter = require("twitter");
    let client = new Twitter(keys.twitter);

    // Call to Twitter API
    client.get("statuses/user_timeline", (error, tweets) => {
        if (error) return console.log(error);

        let logic = require("./logic.js");

        logic.printToScreen(command, tweets);
        logic.logEntry(command, tweets);
    });
    return console.log("SUCCESS: Logged Tweets.");
}

// Use OMDB API to Get Movie Details
function getMovie(command, movie) {
    // If no movie title was provided by user, set default title to Mr. Nobody
    if (movie === "" && process.argv.length < 4) {
        movie = "Mr. Nobody";
    } else {
        // Get the movie title
        for (var i = 3; i < process.argv.length; i++) {
            if (i >= 3 && i < process.argv.length - 1) {
                movie += process.argv[i] + "+";
            } else {
                movie += process.argv[i];
            }
        }
    }
    // Declare and initialize variable for OMDB URL
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
            // Reference to logic functions
            let logic = require("./logic.js");
            logic.printToScreen(command, movieObj);
            logic.logEntry(command, movieObj);
        }
    });
    return console.log("SUCCESS: Logged Movie Details.");
}

// Use Spotify API to Get Song Details
function getSpotify(command, song) {
    // Declare new Spotify object
    let Spotify = require("node-spotify-api");
    let spotify = new Spotify(keys.spotify);

    // Reference to logic functions
    let logic = require("./logic.js");

    // Declare Music Object
    let musicObj = { Artist: "", Title: "", Preview: "", Album: "" };

    // If a song tile was not provided by user, set a default song title
    if (song === "" && process.argv.length < 4) {
        song = "The Sign";
    } else {
        // Get the song title
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
            let songData = data.tracks.items[0];

            // Store results in music Object
            musicObj.Artist = songData.artists[0].name;
            musicObj.Title = songData.name;
            musicObj.Preview = songData.preview_url;
            musicObj.Album = songData.album.name;
        }
        // Print details to screen and log file
        logic.printToScreen(command, musicObj);
        logic.logEntry(command, musicObj);
    });
    return console.log("SUCCESS: Logged Song Details.");
}

// Get File Stream command from file
function getFileInput(command) {
    let fs = require("fs");
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
        let logic = require("./logic.js");
        logic.userCommand(fsCmd, fsOpt);
    });
    return true;
}

module.exports = { getTweets, getMovie, getFileInput, getSpotify };