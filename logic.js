// Include API calls
let api = require("./api");

// Create a file to log output
let logFile = "./log.txt";

// Run Command Provided by User
function userCommand(cmd, cmdOption) {
    switch (cmd) {
        case "my-tweets":
            api.getTweets(cmd);
            return;
        case "movie-this":
            movie = cmdOption;
            api.getMovie(cmd, cmdOption);
            return;
        case "do-what-it-says":
            api.getFileInput(cmd);
            return;
        case "spotify-this-song":
            api.getSpotify(cmd, cmdOption);
            return;
        default:
            console.log("FAILURE: unable to process command.");
            break;
    }
    return;
}

// Print Results to Log File
function logEntry(command, result) {
    let fs = require("fs");
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
    // Format Tweets for log entry
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
    // Format Tweets to print to screen
    if (command === "my-tweets") {
        let i = 1;
        result.forEach(tweet => {
            console.log(`Tweet ${i}: ${tweet.text}`);
            i++;
        });
    } else {
        for (let item in result) {
            console.log(`${item}: ${result[item]}`);
        }
    }
}

module.exports = { userCommand, logEntry, printToScreen };