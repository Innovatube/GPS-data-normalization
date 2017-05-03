<?php

function effectiveDistance($journey, $area) {
	$boundary = $area->boundary;
	if (count($boundary) < 3) {
		echo "area must be a polygon!";
		return;
	}

	$total = 0;
	$displacement = null;
	$prevInside = isInsidePolygon($journey[0], $boundary);
	$currInside = null;

	for ($i = 1; $i < count($journey); $i++){
		$currInside = isInsidePolygon($journey[$i], $boundary);
		if ($prevInside && $currInside) {
		// $displacement = $geolib->getDistance(
		// 	array("latitude" => $journey[$i]->lat, "longitude" => $journey[$i]->lon),
		// 	array("latitude" => $journey[$i - 1]->lat, "longitude" => $journey[$i - 1]->lon)
		// );
		$displacement = earthDistance(
			$journey[$i]->lat, $journey[$i]->lon,
			$journey[$i-1]->lat, $journey[$i-1]->lon
		);
		$total += $displacement;
		}$prevInside = $currInside;
	}

	return $total;
}

//determine if a point is inside a polygon
function isInsidePolygon($point, $polygon) {
	$intersectedEdge = 0;
	$x1 = null; $y1 = null; $x2 = null; $y2 = null;
	$xp = $point->lon;
	$yp = $point->lat;
	$i = null;
	for ($i = 1; $i < count($polygon); $i++) {
		$x1 = $polygon[$i - 1]->lon;
		$y1 = $polygon[$i - 1]->lat;
		$x2 = $polygon[$i]->lon;
		$y2 = $polygon[$i]->lat;
		
        //check if the vertical upward ray from the point intersects an edge
		if (upwardVerticalRayIntersect($x1, $y1, $x2, $y2, $xp, $yp)){
			$intersectedEdge++;
		}
	}
	$x1 = $x2; $y1 = $y2;
	$x2 = $polygon[0]->lon;
	$y2 = $polygon[0]->lat;
	if (upwardVerticalRayIntersect($x1, $y1, $x2, $y2, $xp, $yp)) {
		$intersectedEdge++;
	}
	return $intersectedEdge % 2 == 1;
}

function upwardVerticalRayIntersect($x1, $y1, $x2, $y2, $xp, $yp)
{
	//if value of xp is between $x1 and $x2 (avoid function call in loop)
	$isBetween = ($x1 > $x2)?($xp <= $x1 && $xp >= $x2):($xp >= $x1 && $xp <= $x2);
    return $y1 >= $yp && $y2 >= $yp && $isBetween;
}

//if value of x is between $a and $b
// function isBetween($x, $a, $b)
// {
//     if ($a > $b) {
//         return $x <= $a && $x >= $b;
//     } else {
//         return $x >= $a && $x <= $b;
//     }
// }


// return distance between two coordinates, in kilometer
function earthDistance($lat1, $lon1, $lat2, $lon2) {
	$earthRadiusKm = 6371;
	//convert to radians, avoid calling function to improve performance
	$dLat = ($lat2 - $lat1)*M_PI / 180;
	$dLon = ($lon2 - $lon1)*M_PI / 180;
	$lat1 = ($lat1)*M_PI / 180;
	$lat2 = ($lat2)*M_PI / 180;
	$a = sin($dLat / 2) * sin($dLat / 2) + sin($dLon / 2) * sin($dLon / 2) * cos($lat1) * cos($lat2);
	$c = 2 * atan2(sqrt($a), sqrt(1 - $a));
	return $earthRadiusKm * $c;
}

// return distance between two points in a plane, in kilometer
function planarDistance($x1, $y1, $x2, $y2) {
	return sqrt(
		pow(abs($x1 - $x2) + 1, 2) +
		pow(abs($y1 - $y2) + 1, 2)
	);
}
