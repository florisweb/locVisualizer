

const DataManager = new class {
  #dataPoints = [];
  tileGrid = [];
  tileList = [];

  tileWidth = 0.009; // in latitudal degrees
  tileHeight = 0.015; // in longitudal degrees

  get data() {
    return this.#dataPoints;
  }

  get localisationFactor() {
    let points = this.#dataPoints.filter((_p) => new Date() - _p.date < 1000 * 60 * 60 * 24 * 7);
    let topPointCount = Math.ceil(points.length * .5);
    let tiles = this.#convertDataToTiles(points);
    tiles.list.sort((a, b) => a.counts < b.counts);
    let pointCount = 0;
    for (let i = 0; i < tiles.list.length; i++)
    {
      if (pointCount + tiles.list[i].counts > topPointCount) 
      {
        let fraction = (topPointCount - pointCount) / tiles.list[i].counts;
        return i + fraction;
      }
      pointCount += tiles.list[i].counts;
    }
    return tiles.list.length;
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
    
    let tiles = this.#convertDataToTiles(this.#dataPoints);
    this.tileGrid = tiles.grid;
    this.tileList = tiles.list;
    this.onFetchData();
  }

  #convertDataToTiles(_data) {
    let tileList = [];
    let tileGrid = [];
    for (let point of _data)
    {
      let lat = Math.floor(point.lat / this.tileWidth) * this.tileWidth;
      let long = Math.floor(point.long / this.tileHeight) * this.tileHeight;
      if (!tileGrid[long]) tileGrid[long] = [];
      if (!tileGrid[long][lat])
      {
        let obj = new Tile({long: long, lat: lat});
        tileGrid[long][lat] = obj;
        tileList.push(obj);
      } else tileGrid[long][lat].counts++;
    }
    return {
      grid: tileGrid,
      list: tileList
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

