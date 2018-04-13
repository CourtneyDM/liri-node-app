// Include Logic Dependencies
let logic = require("./logic.js");

// Use the third command line argument as command to execute - indexing is zero-based
let cmd = process.argv[2].toLowerCase();
let cmdOption = "";

// Test the command line option selected by user
function userCommand(cmd, cmdOption) {
    switch (cmd) {
        case "my-tweets":
            logic.getTweets(cmd);
            break;
        case "movie-this":
            movie = cmdOption;
            logic.getMovie(cmd, cmdOption);
            break;
        case "do-what-it-says":
            logic.getFileInput(cmd);
            break;
        case "spotify-this-song":
            logic.getSpotify(cmd, cmdOption);
            break;
        default:
            console.log("FAILURE: unable to process command.");
            break;
    }
    return cmd;
}

// Call userCommand to run code
userCommand(cmd, cmdOption);