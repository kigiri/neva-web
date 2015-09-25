import ui from "ui/new";
import by from "$/by";
import loop from "event/loop";
import {search as style} from "style/inputs";

const MAX_RESULTS = 50;
const results = [];
let selected = 0;
let list = {};
let header;

function Result(_, i) {
  const elem = ui.tr({
    style: style.result,
    onclick: () => console.log(me.data),
  });

  const me = {
    HTMLElement: elem,
    set(r) {
      if (!r) {
        elem.style.transitionDuration = "500ms";
        elem.style.opacity = 0;
        return me;
      }
      me.score = r.score;
      me.data = r.data;
      elem.style.transitionDuration = "0s";
      elem.style.opacity = 1;
      if (list) {
        list.row(me);
      }
      return me;
    },
  }
  return me;
}

const resultsElem = Array.from(Array(MAX_RESULTS), Result);
const tableHead = ui.thead({});
const tableBody = ui.tbody({}, resultsElem);
const elem = ui.table({
  style: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  }
}, tableHead, tableBody);

const Me = {
  HTMLElement: elem,
}

Me.select = () => {
  list.open(results[selected].data);
  return Me;
}

Me.prev = () => {
  Me.highLight(selected - 1);
  return Me;
}

Me.next = () => {
  Me.highLight(selected + 1);
  return Me;
}

Me.highLight = index => {
  index = Math.min(results.length - 1, 49, Math.max(index, 0));
  console.log(index);
  resultsElem[selected].HTMLElement.style.background = "";
  selected = index;
  resultsElem[selected].HTMLElement.style.background = "rgba(255, 255, 255, 0.2)";
  return Me;
}

let changes = true;
function pushScore(data, score, primaryKey) {
  let i = -1;
  while (++i < results.length) {
    if (data[primaryKey] === results[i].data[primaryKey]) {
      results[i].score = score;
      changes = true;
      return Me;
    }
  }
  results.push({score, title: data.name, data, time: performance.now()});
  changes = true;
  return Me;
}

const customSort = by.join(by.scoreDesc, by.time, by.title);
Me.push = (resultsArray, primaryKey) => {
  let i = -1;
  while (++i < resultsArray.length) {
    const [ score, data ] = resultsArray[i];
    pushScore(data, score, primaryKey);
  }
};

Me.clear = () => {
  results.length = 0;
  selected = 0;
  changes = true;
  return Me;
};

Me.setList = newList => {
  if (list === newList) { return }
  list = newList;
  // rebuild results
}

loop.add(event => {
  if (!changes) { return }
  changes = false;
  results.sort(customSort);
  let i = -1;
  while (++i < MAX_RESULTS) {
    resultsElem[i].set(results[i]);
  }
})

export default Me;
