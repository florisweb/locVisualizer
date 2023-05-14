
let dataPoints = [];

async function getData() {
  let response = await fetch('API/data.json');
  let result = await response.json();
  if (typeof result === 'object') dataPoints = result;
  console.log(dataPoints);
}
getData();



// Options for map
var options = {
  lat: 52.3,
  lng: 5,
  zoom: 8,
  style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
}

// Create an instance of Leaflet
var mappa = new Mappa('Leaflet');
var myMap;

var canvas;
let ctx;

function setup() {
  canvas = createCanvas(800, 700);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  // Load the data

  // Only redraw the meteorites when the map change and not every frame.
  myMap.onChange(onChange);

  fill(255, 0, 0);	
  stroke(255, 0, 0);
}

function draw() {
  onChange();
}


function onChange() {
  // Clear the canvas
  clear();  

  let kmPxSize = 1000 / metresPerPixel();

  for (let point of dataPoints) 
  {
    if (!myMap.map.getBounds().contains({lat: point.lat, lng: point.long})) continue;
    var pos = myMap.latLngToPixel(point.lat, point.long);
    let size = kmPxSize;

    rect(pos.x, pos.y, size, size);
  
  }
}	





function metresPerPixel() {
    const southEastPoint = myMap.map.getBounds().getSouthEast();
    const northEastPoint = myMap.map.getBounds().getNorthEast();
    const mapHeightInMetres = southEastPoint.distanceTo(northEastPoint);
    const mapHeightInPixels = myMap.map.getSize().y;

    return mapHeightInMetres / mapHeightInPixels;
}
