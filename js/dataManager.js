

const DataManager = new class {
  #dataPoints = [];
  tileGrid = [];
  tileList = [];

  tileWidth = 0.009; // in latitudal degrees
  tileHeight = 0.015; // in longitudal degrees

  get data() {
    return this.#dataPoints;
  }

  constructor() {
  }

  async setup() {
    await this.#fetchData();
    setInterval(() => this.#fetchData(), 1000 * 10);
  }

  async #fetchData() {
    let headers = new Headers();
    headers.append('pragma', 'no-cache');
    headers.append('cache-control', 'no-cache');

    let init = {
      method: 'GET',
      headers: headers,
    };

    let response = await fetch('API/data.json', init);

    let result = await response.json();
    if (typeof result === 'object') this.#dataPoints = result.map(point => new DataPoint(point));
    this.#convertDataToTiles(this.#dataPoints);
    this.onFetchData();
  }

  #convertDataToTiles(_data) {
    this.tileGrid = [];
    this.tileList = [];
    for (let point of _data)
    {
      let lat = Math.floor(point.lat / this.tileWidth) * this.tileWidth;
      let long = Math.floor(point.long / this.tileHeight) * this.tileHeight;
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

class DataPoint {
  lat;
  long;
  date;
  dateString = '';

  constructor({lat, long, date}) {
    this.lat = lat;
    this.long = long;
    this.date = new Date();
    this.dateString = date;
    let dateTime = date.split(', ');
    let dateParts = dateTime[0].split('/');
    let timeParts = dateTime[1].split(':');
    this.date.setDate(parseInt(dateParts[0]));
    this.date.setMonth(parseInt(dateParts[1]) - 1);
    this.date.setYear(parseInt(dateParts[2]));
    this.date.setHours(parseInt(timeParts[0]));
    this.date.setMinutes(parseInt(timeParts[1]));
  }
}

