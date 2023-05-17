
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
    let lastPoint =  DataManager.data[DataManager.data.length - 1];

    setTextToElement(this.#HTML.topBar, 
      'Tiles: ' + DataManager.tileList.length + 
      ' Points: ' + DataManager.data.length + 
      ' ' + (lastPoint ? 'Last update: ' + lastPoint.dateString : ''));
  }
}