
const TopBar = new class {
  #HTML = {
    topBar: $('#topBar')[0],
    tileInfoHolder: $('#topBar .infoHolder')[1],
    updateInfoHolder: $('#topBar .infoHolder')[0],
  }

  update() {
    let lastPoint =  DataManager.data[DataManager.data.length - 1];
    setTextToElement(this.#HTML.tileInfoHolder, DataManager.tileList.length + (DataManager.tileList.length != 1 ? ' Tiles' : ' Tile'));
    setTextToElement(this.#HTML.updateInfoHolder, DataManager.data.length + ' Points' + (lastPoint ? ' (' + lastPoint.dateString.substr(1, 1000) + ')' : ''));
  }
}