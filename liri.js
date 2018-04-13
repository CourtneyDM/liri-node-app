// Include Logic Dependencies
let logic = require("./logic");

// Use the third command line argument as command to execute - indexing is zero-based
let cmd = process.argv[2].toLowerCase();
let cmdOption = "";

// Call userCommand to run code
logic.userCommand(cmd, cmdOption);