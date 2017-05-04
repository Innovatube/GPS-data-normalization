module.exports = function(geoJSON){
	
	var tracking = [];
	var coordinates = geoJSON.features[0].geometry.coordinates[0];
	for(var i = 0; i < coordinates.length; i++){
		tracking.push({
			lat: coordinates[i][0],
			lon: coordinates[i][1]
		});
	}
	return tracking;	
}