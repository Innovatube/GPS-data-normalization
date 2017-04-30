var geolib = require('geolib');


//calculate the effective distance of a journey inside an area
//example input
//journey : [{lat: 12.34, lon: 34.56}, {lat: 12,35, lon: 34.57}]
//area : {"name": "Ba Dinh",
// "boundary" : [
//   {"lat":21.047644, "lon": 105.806270}
//   {"lat":21.030108, "lon": 105.801651}
//   {"lat":21.019693, "lon": 105.808345}
//   {"lat":21.016649, "lon": 105.815212}
//   {"lat":21.028987, "lon": 105.843193}
//   {"lat":21.042605, "lon": 105.857440}
//   {"lat":21.054781, "lon": 105.849887}
// ]}
function effectiveDistance(journey, area) {
    var boundary = area.boundary;
    if (boundary.length < 3) {
        console.log("area must be a polygon!");
        return;
    }

    var total = 0, displacement;
    var prevInside = isInsidePolygon(journey[0], boundary);
    var currInside;
    for (var i = 1; i < journey.length; i++) {
        currInside = isInsidePolygon(journey[i], boundary);
        if (prevInside && currInside){
            displacement = geolib.getDistance(
               {latitude: journey[i].lat, longitude: journey[i].lon},
               {latitude: journey[i-1].lat, longitude: journey[i-1].lon}
            );
            total += displacement;
            console.log(journey[i-1].time + ": ",
                "(" + journey[i-1].lon + ", " + journey[i-1].lat + ")",
                "->",
                "(" + journey[i].lon + "," + journey[i].lat + ")", 
                "\td = " + displacement + "m");
        }
        prevInside = currInside;
    }
    return total;
}

function planarDistance(x1, y1, x2, y2){
    return Math.sqrt(
        Math.pow(Math.abs(x1-x2) + 1, 2) +
        Math.pow(Math.abs(y1-y2) + 1, 2)
    );
}

//determine if a point is inside a polygon
function isInsidePolygon(point, polygon) {
    var intersectedEdge = 0;
    var x1, y1, x2, y2, xp = point.lon, yp = point.lat;
    var i;
    for(i = 1; i < polygon.length; i++){
        x1 = polygon[i-1].lon;
        y1 = polygon[i-1].lat;
        x2 = polygon[i].lon;
        y2 = polygon[i].lat;

        //check if the vertical upward ray from the point intersects an edge
        if(upwardVerticalRayIntersect(x1,y1,x2,y2,xp,yp)){
            intersectedEdge++;
        }
    }
    x1 = x2;
    y1 = y2;
    x2 = polygon[0].lon;
    y2 = polygon[0].lat;
    if(upwardVerticalRayIntersect(x1,y1,x2,y2,xp,yp)){
        intersectedEdge++;
    }

    return ((intersectedEdge % 2) == 1);
}

function upwardVerticalRayIntersect(x1,y1,x2,y2,xp,yp){
    return y1 >= yp && y2 >= yp &&
        isBetween(xp, x1, x2);
}

//return true if value x is between a and b, or equal to a or b
function isBetween(x, a, b){
    if(a > b){
        return (x <= a && x >= b);
    } else{
        return (x >= a && x <= b);
    }
}

/////////////////////NAIVE EARTH DISTANCE CALCULATION////////////
//return distance between two coordinates, in kilometer
// function earthDistance(lat1, lon1, lat2, lon2) {
//     var earthRadiusKm = 6371;

//     var dLat = degreesToRadians(lat2 - lat1);
//     var dLon = degreesToRadians(lon2 - lon1);

//     lat1 = degreesToRadians(lat1);
//     lat2 = degreesToRadians(lat2);

//     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return earthRadiusKm * c;
// }

// function degreesToRadians(degrees) {
//     return degrees * Math.PI / 180;
// }

module.exports = effectiveDistance;