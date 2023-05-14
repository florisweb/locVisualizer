<?php
	$fileName = 'data.json';
	$data = file_get_contents($fileName);
	$points = json_decode($data, true);
	if (is_null($points)) $points = [];

	$myfile = fopen($fileName, "wr") or die("Unable to open file!");
	$newData = json_decode(file_get_contents("php://input"));

	$newPoint = array(
		"date" => $newData->date,
		"long" => (float)$newData->long,
		"lat" => (float)$newData->lat,
	);
	array_push($points, $newPoint);

	fwrite($myfile, json_encode($points));
	fclose($myfile);
?>