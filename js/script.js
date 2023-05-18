





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

async function setup() {
  await DataManager.setup();
  canvas = createCanvas(document.body.offsetWidth, document.body.offsetHeight);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  // Load the data

  // Only redraw the meteorites when the map change and not every frame.
  myMap.onChange(onChange);

  fill('rgba(255, 0, 0, .1)');
  stroke(255, 0, 0);
}



function onChange() {
  clear();
  drawTiles();
  drawPoints();
}	


function drawTiles() {
  for (let tile of DataManager.tileList) 
  {
    if (!myMap.map.getBounds().contains({lat: tile.lat, lng: tile.long})) continue;
    let pos = myMap.latLngToPixel(tile.lat, tile.long);
    let pos2 = myMap.latLngToPixel(tile.lat + DataManager.tileWidth, tile.long + DataManager.tileHeight);
    let dx = pos2.x - pos.x;
    let dy = pos2.y - pos.y;

    let opacity = (1 - Math.pow(2, -tile.counts / 10)) / 2;
    fill('rgba(255, 0, 0, ' + opacity + ')');
    rect(pos.x, pos.y, dx, dy);
  }
}

function drawPoints() {
  let dataPoints = Object.assign([], DataManager.data);
  dataPoints = dataPoints.splice(dataPoints.length - 50, 50);
  for (let point of dataPoints) 
  {
    if (!myMap.map.getBounds().contains({lat: point.lat, lng: point.long})) continue;
    let pos = myMap.latLngToPixel(point.lat, point.long);
    fill('#f00');
    ellipse(pos.x, pos.y, 5, 5);
  }
}


function calcMetresPerPixel() {
    const southEastPoint = myMap.map.getBounds().getSouthEast();
    const northEastPoint = myMap.map.getBounds().getNorthEast();
    const mapHeightInMetres = southEastPoint.distanceTo(northEastPoint);
    const mapHeightInPixels = myMap.map.getSize().y;

    return mapHeightInMetres / mapHeightInPixels;
}
