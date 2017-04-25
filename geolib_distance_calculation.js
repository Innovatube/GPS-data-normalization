var geolib = require('geolib');
var fs = require('fs');

var data1 = JSON.parse(
  fs.readFileSync('GPS_data/without_autopause.geojson')
).features[0].geometry.coordinates[0];

var sum = 0;
var prevPoint;
var currentPoint;
var accuracy = 5; //meters
var precision = 1; //meter

for(var i = 1; i < data1.length; i++){
  prevPoint = data1[i-1];
  currentPoint = data1[i];
  sum += geolib.getDistance(
  	{latitude : prevPoint[0], longitude: prevPoint[1]},
  	{latitude : currentPoint[0], longitude : currentPoint[1]},
  	accuracy,
  	precision
  );
}


console.log("total distance: " + sum + "m");