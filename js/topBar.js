
function $() {
  return document.querySelectorAll(...arguments);
}
function setTextToElement(element, text) {
  element.innerHTML = "";
  let a = document.createElement('a');
  a.text = text;
  element.append(a);
}


const TopBar = new class {
  #HTML = {
    topBar: $('#topBar')[0],
  }
  constructor() {


  }

  update() {
    setTextToElement(this.#HTML.topBar, 'Tiles: ' + DataManager.tileList.length + ' of ' + DataManager.data.length + ' points.');
  }
}