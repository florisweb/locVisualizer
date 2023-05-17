

const DataManager = new class {
  #dataPoints = [];
  tileGrid = [];
  tileList = [];

  tileWidth = 0.007; // in latitudal degrees
  tileHeight = 0.01; // in longitudal degrees

  get data() {
    return this.#dataPoints;
  }


  constructor() {
  }

  async setup() {
    await this.#fetchData();
  }

  async #fetchData() {
    let response = await fetch('API/data.json');
    let result = await response.json();
    if (typeof result === 'object') this.#dataPoints = result;
    this.#convertDataToTiles(this.#dataPoints);
    this.onFetchData();
  }

  #convertDataToTiles(_data) {
    for (let point of _data)
    {
      let lat = Math.round(point.lat / this.tileWidth) * this.tileWidth;
      let long = Math.round(point.long / this.tileHeight) * this.tileHeight;
      if (!this.tileGrid[long]) this.tileGrid[long] = [];
      if (!this.tileGrid[long][lat])
      {
        let obj = new Tile({long: long, lat: lat});
        this.tileGrid[long][lat] = obj;
        this.tileList.push(obj);
      } else this.tileGrid[long][lat].counts++;
    }
  }

  onFetchData() {
    TopBar.update();

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

