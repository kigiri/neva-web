import ui from "ui/new";
import by from "$/by";
import loop from "event/loop";

const MAX_RESULTS = 50;

function Result(_, i) {
  const elem = ui.div({
    style: {      
      opacity: "0",
      transitionProperty: "opacity",
      transitionDuration: "0s",
      transitionDelay: "64ms",
      transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)",
    }
  }, i.toString());
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
      elem.textContent = r.data.entry +" "+ r.title +" ("+ r.score +")";
      elem.style.transitionDuration = "0s";
      elem.style.opacity = 1;
      return me;
    },
  };
  return me;
}

const results = [];
const resultsElem = Array.from(Array(MAX_RESULTS), Result);
const selected = 0;
const elem = ui.div({}, resultsElem);
const Me = {
  HTMLElement: elem,
};

Me.prev = () => {

}

Me.next = () => {};

Me.select = () => {};

let changes = true;
const customSort = by.join(by.scoreDesc, by.time, by.title);
Me.push = (score, title, data, primaryKey) => {
  let i = -1;
  while (++i < results.length) {
    if (data[primaryKey] === results[i].data[primaryKey]) {
      results[i].score = score;
      changes = true;
      return Me;
    }
  }
  results.push({score, title, data, time: performance.now()});
  changes = true;
  return Me;
};

Me.clear = () => {
  results.length = 0;
  changes = true;
  return Me;
};

loop.add(event => {
  if (changes) {
    changes = false;
    results.sort(customSort);
    let i = -1;
    while (++i < MAX_RESULTS) {
      resultsElem[i].set(results[i]);
    }
  }
})

export default Me;
