require("dotenv").config();

//get the keys.js file
var keys = require("./keys.js");

//require node packages
var spotify1 = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var fs = require("fs");

//attach the key to a variable
var spotify2 = new spotify1(keys.spotify);

//command line arguments
var arg = process.argv;

//user input commands
var userInput1 = "";
var userInput2 = "";

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

                        console.log("////////////////////")
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

            var queryURL = "https://www.omdbapi.com/?t=" + userInput1 + "&y=&plot=short&apikey=584a2704"
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var data = JSON.parse(body);
                    console.log("Title: " + data.Title)
                    console.log("Release Year: " + data.Year)
                    console.log("OMDB Rating: " + data.Ratings[0].Value)
                    console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value)
                    console.log("Country of Production: " + data.Country)
                    console.log("Language: " + data.Language)
                    console.log("Plot of the Movie: " + data.Plot)
                    console.log("Actors: " + data.Actors)

                }
            });

            break;

    }
}

