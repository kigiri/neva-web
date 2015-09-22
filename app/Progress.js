import ui from "ui/new";
// import { on } from "event";
import $now from "$/now";
import loop from "event/loop";


import { progress as style } from "style/inputs";

const me = {};
const elem = ui.div({
  style: style.container,
});

me.HTMLElement = elem;
me.hidden = true;

function getTooltipData(node) {
  if (!node) { return null }
  if (node.dataset && node.dataset.tooltip) {
    return node.dataset.tooltip;
  }
  return getTooltipData(node.parentNode);
}

let bars = {};

me.hide = () => {
  elem.style.opacity = 0;
  setTimeout(() => elem.style.display = "none", 200);
}
me.show = () => {
  elem.style.display = "";
  elem.style.opacity = 1;
}
me.set = (key, f) => (bars[key] || Bar(key)).set(f);

// loop.add()

let count = 0;
function decount() {
  count--;
  if (count <= 0) {
    me.hide();
  }
}

function Bar(key) {
  const newBar = {};
  const innerBar = ui.span(style.innerBar);
  const elem = ui.div(style.outerBar, innerBar, ui.div(style.barLabel, key));
  count++;
  me.show();

  let requested = false;
  let f = 0;
  let ended = false;
  let setF = -1;
  loop.add(() => {
    if (ended) { return }
    if (f === setF) { return }
    setF = f;
      innerBar.style.width = (f * 100) +"%";
      if (f === 1) {
        ended = true;
        setTimeout(decount, 200);
        innerBar.style.opacity = 0;
        elem.style.boxShadow = "none";
        elem.style.background = "transparent";
        elem.style.color = "#999";
      }
  })

  newBar.set = value => f = value;

  me.HTMLElement.appendChild(elem);

  bars[key] = newBar;

  return newBar;
}

export default me;
