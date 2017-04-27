//filter all data, takes only route that has a tag named "Hanoi"

var fs = require('fs');
var xmlParse = require('xml2js').parseString;

xmlParse(
	//input
	fs.readFileSync('GPS_data/GPX-2013-04-09-vietnam/metadata.xml'),

	(error, parseResult) => {
		var gpxFiles = parseResult.gpxFiles.gpxFile;
		
		for(var i = 0; i < gpxFiles.length; i++){
			var file = gpxFiles[i];
			var isHanoi = false;
			var tags;

			if(!file.tags) continue;

			tags = file.tags[0].tag;
			for(var j = 0; j < tags.length; j++){
				var tag = tags[j];
				if(/ha *noi/.test(tag.toLowerCase())){
					isHanoi = true;
				}
			}

			if(!isHanoi) continue;

			var output = {};
			output.tags = tags;
			output.description = file.description;
			output.gpxFile = file.$.filename;
			output.tracking = [];

			xmlParse(
				fs.readFileSync('GPS_data/GPX-2013-04-09-vietnam/' + file.$.filename),
				(error, gpx) => {
					if(error) console.log(error);

					var points = gpx.gpx.trk[0].trkseg[0].trkpt;
					var point;
					for(var i = 0; i < points.length; i++){
						point = points[i].$;
						point.time = points[i].time[0];
						output.tracking.push(point);
					}
				}
			)

			fs.writeFileSync("GPS_data_processed/" +
				output.gpxFile.split('/')[2].split('.')[0], JSON.stringify(output));
			// console.log(output);
		}
	}
);
