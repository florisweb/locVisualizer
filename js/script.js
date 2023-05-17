
let dataPoints = [];

const squareSizeWidth = 0.007;
const squareSizeHeight = 0.01;
let tileGrid = [];
let tileList = [];

async function getData() {
  let response = await fetch('API/data.json');
  let result = await response.json();
  if (typeof result === 'object') dataPoints = result;

  // for (let lo = 2; lo < 7; lo += f)
  // {
  //   tileGrid[lo] = [];
  //   for (let la = 50; la < 54; la += f)
  //   {
  //     let obj = new Tile({long: lo, lat: la});
  //     tileGrid[lo][la] = obj;
  //     tileList.push(obj);
  //   }
  // }

  for (let point of dataPoints)
  {
    let lat = Math.round(point.lat / squareSizeWidth) * squareSizeWidth;
    let long = Math.round(point.long / squareSizeHeight) * squareSizeHeight;
    if (!tileGrid[long]) tileGrid[long] = [];
    if (!tileGrid[long][lat])
    {
      let obj = new Tile({long: long, lat: lat});
      tileGrid[long][lat] = obj;
      tileList.push(obj);
    } else tileGrid[long][lat].counts++;
  }
}

class Tile {
  long;
  lat;
  counts = 1;
  constructor({long, lat}) {
    this.long = long;
    this.lat = lat;
  }
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

function setup() {
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
  // Clear the canvas
  clear();  

  let kmPxSize = 1000 / metresPerPixel();

  for (let tile of tileList) 
  {
    if (!myMap.map.getBounds().contains({lat: tile.lat, lng: tile.long})) continue;
    let pos = myMap.latLngToPixel(tile.lat - squareSizeWidth / 2, tile.long - squareSizeHeight / 2);
    let pos2 = myMap.latLngToPixel(tile.lat + squareSizeWidth / 2, tile.long + squareSizeHeight / 2);
    let dx = pos2.x - pos.x;
    let dy = pos2.y - pos.y;

    let opacity = 1 - Math.pow(2, -tile.counts / 10);
    fill('rgba(255, 0, 0, ' + opacity + ')');
    rect(pos.x, pos.y, dx, dy);
  }
}	




function metresPerPixel() {
    const southEastPoint = myMap.map.getBounds().getSouthEast();
    const northEastPoint = myMap.map.getBounds().getNorthEast();
    const mapHeightInMetres = southEastPoint.distanceTo(northEastPoint);
    const mapHeightInPixels = myMap.map.getSize().y;

    return mapHeightInMetres / mapHeightInPixels;
}
