require("dotenv").config();

//get the keys.js file
var keys = require("./keys.js");

//require node packages
var Spotify = require('node-spotify-api');
var request = require("request");
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");
var inquirer = require("inquirer");

//attach the key to a variable
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

//command line arguments
var arg = process.argv;

//user input commands
var userInput1 = "";
//////////////////////////////
// function Help(category, favorite) {
//     this.category = category;
//     this.favorite = favorite;
// }
// var inputCreate = function () {
//     inquirer.prompt([
//         {
//             type: "list",
//             name: "category",
//             choices: ["concert-this", "movie-this", "spotify-this-song", "do-what-it-says"],
//             message: "What category would you like?"
//         },
//         {
//             type: "input",
//             name: "favorite",
//             message: "What you like to search for?"
//         },
//     ]).then(function (answers) {
//         var newInput = new Input(
//             answers.category,
//             answers.favorite,
//         );
//         monsterTeam.push(newMonster);

//         monsterCreate();
//     });
// }
////////////////////////////////////////
// get the user input for everything via forloop and make it so you can type more than one word
for (var i = 3; i < arg.length; i++) {
    if (i > 3 && i < arg.length) {
        userInput1 = userInput1 + "+" + arg[i];
    }
    else {
        userInput1 += arg[i];
    }
}

var command1 = process.argv[2];
console.log(command1);
console.log(process.argv);
liriBot();

// switch statements
function liriBot() {
    switch (command1) {
        case "concert-this":

            //call to API 
            var queryURL = "https://rest.bandsintown.com/artists/" + userInput1 + "/events?app_id=codingbootcamp"
            request(queryURL, function (error, response, body) {
                //If no error and response is a success
                if (!error && response.statusCode === 200) {
                    //Parse the json response
                    var data = JSON.parse(body);
                    //create a forloop for array
                    for (var i = 0; i < data.length; i++) {

                        //venue name
                        console.log("Venue: " + data[i].venue.name);

                        // venue location
                        if (data[i].venue.region == "") {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);

                        } else {
                            console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);

                        }

                        //date of show
                        var showDate = data[i].datetime;
                        showDate = moment(showDate).format("MM/DD/YYYY");
                        console.log("Date: " + showDate)

                        console.log("////////////////////");
                    }
                }
            });

            break;
        case "movie-this":
            //If statement for no movie provided
            if (!userInput1) {
                userInput1 = "Mr%20Nobody";
                userInput2 = userInput1.replace(/%20/g, " ");
            }
            //call to omdb api
            var queryURL = "https://www.omdbapi.com/?t=" + userInput1 + "&y=&plot=short&apikey=584a2704"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var data = JSON.parse(body);
                    // Title of movie
                    console.log("Title: " + data.Title);
                    console.log("\n////////////////////////\n");
                    // release year
                    console.log("Release Year: " + data.Year);
                    console.log("\n////////////////////////\n");
                    // OMDB rating
                    console.log("OMDB Rating: " + data.Ratings[0].Value);
                    console.log("\n////////////////////////\n");
                    // rotten tomatoes rating
                    console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
                    console.log("\n////////////////////////\n");
                    // where it was produced
                    console.log("Country of Production: " + data.Country);
                    console.log("\n////////////////////////\n");
                    // Language
                    console.log("Language: " + data.Language);
                    console.log("\n////////////////////////\n");
                    // plot of the movie
                    console.log("Plot of the Movie: " + data.Plot);
                    console.log("\n////////////////////////\n");
                    // list of actors
                    console.log("Actors: " + data.Actors);

                }
            });

            break;
        case "spotify-this-song":
            //If no song is provided
            if (!userInput1) {
                userInput1 = "The%20Sign%20Ace%20of%20Base";
                userInput2 = userInput1.replace(/%20/g, " ");

            }
            spotify.search({ type: 'track', query: userInput1 }, function (error, data) {
                if (error) {
                    console.log('Error occurred: ' + error);
                } else if (!error) {
                    //artists
                    var search = data.tracks.items[0];
                    for (var j = 0; j < search.artists.length; j++) {
                        console.log("Artists:  " + search.artists[j].name);
                    }
                    console.log("\n////////////////////////\n");
                    //song name
                    console.log("Song Title: " + search.name);
                    console.log("\n////////////////////////\n");
                    //link to a preview
                    console.log("Click the Link to Preview: " + search.preview_url);
                    console.log("\n////////////////////////\n");
                    //album name
                    console.log("Album Name: " + search.album.name);
                }
            });
            break;
        // case "do-what-it-says":
    }
}

if (command1 === "do-what-it-says") {
    var fs = require("fs");
    // pull from the Random.txt file
    fs.readFile("random.txt", "utf8", function (error, data) {
        var dataArray = data.split(",");
        // var runAll = dataArray[Math.floor(Math.random() * dataArray.length)].split(",");
        userInput1 = dataArray[1];
        userInput2 = userInput1.replace(/%20/g, " ");
        command1 = dataArray[0];
        if (error) {
            console.log(error);
        }
        liriBot();
    })
}

