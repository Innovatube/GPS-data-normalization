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