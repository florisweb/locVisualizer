
function $() {
  return document.querySelectorAll(...arguments);
}
function setTextToElement(element, text) {
  element.innerHTML = "";
  let a = document.createElement('a');
  a.text = text;
  element.append(a);
}