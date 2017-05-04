var fs = require('fs');
var effectiveDistance = require('./effective_distance');

var dataDir = 'GPS_data_processed/';
var gpsData = fs.readdirSync(dataDir);

var testArea = require('./hanoi_districts.js');
// for(var i = 0; i < 2; i++){
// 	var testJourney = JSON.parse(fs.readFileSync(dataDir + gpsData[i]));
// 	console.log("Journey", i + ": ", testJourney.description);
// }

var testJourney = JSON.parse(fs.readFileSync(dataDir + gpsData[0]));
console.log("Journey: ", testJourney.description);
console.log("GPX File: ", testJourney.gpxFile);
console.log("Area: ", testArea[3].name);

console.log("\n\nTraveled distance within area: ",
 			effectiveDistance(testJourney.tracking, testArea[3]), "meters");

console.log("\n\nThe journey can be visualised by feeding mymaps.google.com with GPX Files",
	"stored here https://drive.google.com/open?id=0B2CtrMfIV7ixcDNJVWRmd0JJNGs");

console.log("\nThis is the visualised map for this single case only: \n"+
	"https://drive.google.com/open?id=1KnnzRRiBMhqeulnycbcsPTfgNAI&usp=sharing");

console.log("\n\n============================================");
console.log("Compare to STRAVA sporting activitiy tracking:\n");

console.log("Strava distance: 7km - https://www.strava.com/activities/970043522\n");

var homeToInnovatube = require('./processGeoJSON')(
	JSON.parse(fs.readFileSync('GPS_data/Home_to_innovatube.geojson'))
);

var trackAllArea = {
	"name" : "this area represents the universe",
	"boundary" : [
		{lon: 0, lat: 0},
		{lon: 0, lat: Number.MAX_VALUE},
		{lon: Number.MAX_VALUE, lat: Number.MAX_VALUE},
		{lon: Number.MAX_VALUE, lat: 0}	
	]
}

console.log("Calculated distance by this program: ", 
	effectiveDistance(homeToInnovatube, trackAllArea) + "m"
);

console.log("Google Map distance: 6.9km - https://goo.gl/WH0kAM");

console.log(
	"\nCalculated distance by http://utrack.crempa.net:\n",
	"Flat distance (without elevation): 5.7km\n",
	"Total distance: 7km");

console.log(
	"\nConslusion: our algorithm runs correctly for flat distance, and the different from STRAVA is that we do not consider elevation.");

console.log(
	"\nRecommendation: We have 2 options:\n",
	"1. Ignore elevation\n",
	"2. Add elevation in our dataset\n");
