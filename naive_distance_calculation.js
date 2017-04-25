var fs = require('fs');

var data1 = JSON.parse(
  fs.readFileSync('GPS_data/without_autopause.geojson')
).features[0].geometry.coordinates[0];

var sum = 0;
var prevPoint;
var currentPoint;
for(var i = 1; i < data1.length; i++){
  prevPoint = data1[i-1];
  currentPoint = data1[i];
  sum += earthDistance(prevPoint[0], prevPoint[1], currentPoint[0], currentPoint[1]);
}

console.log("total distance: " + sum + " km");

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

//return distance between two coordinates, in kilometer
function earthDistance(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}