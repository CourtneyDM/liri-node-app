# Liri App

A command-line application

## Overview

LIRI, also known as _Language Interpretation and Recognition Interface_, is command-line Node app that receives specific command-line arguments and returns data based on the command.

### Commands to Use

- **my-tweets**: returns 20 of the most recent tweets.  
   CLI Call: _node my-tweets_

- **spotify-this-song**: returns the Artist, Album, Preview of the song specified. _Default Song: "The Sign"_  
   CLI Call: _node spotify-this-song songName_

- **movie-this**: returns the movie details of the specified movie title. _Default Movie: "Mr. Nobody"_  
   CLI Call: _node movie-this movieTitle_

- **do-what-it-says**: reads a command from a file and executes the command specified. _Default Command: "movie-this 'Casino Royale'"_

### Resources

- APIs:  
   [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)  
   [OMDB](http://www.omdbapi.com/)  
   [Twitter](https://www.npmjs.com/package/twitter)

- Node Packages:  
   [File System](https://nodejs.org/docs/latest-v7.x/api/fs.html)  
   [Request](https:/www.npmjs.com/package/request)

---

#### Copyright

Courtney Montgomery &copy; 2018
