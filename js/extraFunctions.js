
function $() {
  return document.querySelectorAll(...arguments);
}
function setTextToElement(element, text) {
  element.innerHTML = "";
  let a = document.createElement('a');
  a.text = text;
  element.append(a);
}



function getLocation() {
  return new Promise((resolve, error) => {
    if (!navigator.geolocation) {
      error("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition((_result) => resolve(_result.coords), error);
    }
  })
}
