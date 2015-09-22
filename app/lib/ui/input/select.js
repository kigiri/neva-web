import is from "$/is";
import ui from "ui/new";
import Task from "$/Task";
import { on } from "event";
import _keys from "_/object/keys";
import loop from "event/loop";
import clamp from "$/clamp";
import fallthrough from "$/fallthrough";

import { select as style } from "style/inputs";

// chrome has a better scroll into view, so let's use it if available
const SCROLL_FN_KEY = is.fn(document.body.scrollIntoViewIfNeeded)
  ? "scrollIntoViewIfNeeded"
  : "scrollIntoView";


function newListElem(key, i, list, onclick) {
  const self = ui.div({
    onclick,
    style: style.listElem,
    dataset: {
      key,
      index: i,
      value: list[key],
      tooltip: key +" "+ list[key],
    },
  }, ui.span({ style: style.index }, key.toString()), ui.span(list[key]));

  self.visible = true;

  self.setVisibilityState = state => {
    self.style.display = state ? "" : "none";
    self.visible = state;
  }

  return self;
}

function Selector(list, keys, input, applySelection) {
  const self = {};
  const listElems = keys.map((key, i) => newListElem(key, i, list, () =>
    applySelection(self.select(i))));
  const elem = ui.div({ style: style.listContainer }, listElems);

  let index = 0;

  self.HTMLElement = elem;

  self.show = () => {
    if (self.visible) { return }
    elem.style.display = "";
    self.visible = true;
    input.select();
    input.style.position = "";
    input.style.color = "white";
    self.select(index);
  };

  self.hide = () => {
    if (!self.visible) { return }
    elem.style.display = "none";
    input.style.position = "absolute";
    input.style.color = "transparent";
    self.visible = false;
  };

  const maxIter = listElems.length - 1;
  const indexClamp = clamp.bind(null, 0, maxIter);

  self.set = key => {
    for (let i = 0; i < listElems.length; i++) {
      if (listElems[i].dataset.key == key) {
        self.select(i);
      }
    }
  };

  function applySelectedStyle(el) {
    el.style.color = "black";
    el.style.background = "#BCBCBC";
    el.style.border = "1px solid #A8A8A8";
    el.firstChild.style.color = "white";
  }

  function clearSelectedStyle(el) {
    el.style.color = style.listElem.color;
    el.style.background = style.listElem.background;
    el.style.border = style.listElem.border;
    el.firstChild.style.color = style.index.color;
  }

  self.select = i => {
    clearSelectedStyle(listElems[index]);
    index = indexClamp(parseInt(i, 10));
    applySelectedStyle(listElems[index]);
    listElems[index][SCROLL_FN_KEY]();
  };

  self.each = fn => {
    let i = -1;
    while (++i <= maxIter) {
      if (fn.call(self, listElems[i], i, listElems) === false) { break }
    }
  }

  self.filter = fn => self.each((el, i) => el.setVisibilityState(!fn(el, i)));

  self.getRelativeIndex = diff => {
    const step = (diff > 0) ? 1 : -1;
    let i = index;

    diff = Math.abs(diff);

    while (diff > 0) {
      i = indexClamp(i + step);
      if (i === 0 || i === maxIter) { break }
      if (listElems[i].visible) { diff-- }
    }
    return i;
  }

  self.next = () => self.select(self.getRelativeIndex(1));
  self.prev = () => self.select(self.getRelativeIndex(-1));
  self.fastNext = () => self.select(self.getRelativeIndex(5));
  self.fastPrev = () => self.select(self.getRelativeIndex(-5));

  self.getSelected = () => listElems[index].dataset;

  return self;
}

/* ToDo :
 * up / down move in list
 * fuzzy match sort the list
 * show / hide the list on focus
 * select the elem
 * handle clicks *ewww*
 */


export default function select(form, key, list) {
  list[0] || (list[0] = "none");

  const keys = _keys(list);
  const input = Task();
  const isValid = val => list.indexOf(val) !== -1;
  const display = ui.span({style: style.display});
  const inputElem = ui.input({
    type: "text",
    style: style.listInput,
    onkeydown: event => {
      if (event.keyCode === 27) {
        selector.hide();
      } else {
        let fn = handlers[event.keyCode];
        if (is.fn(fn)) {
          fn(event);
          event.preventDefault();
        }
        showSelectorList();
      }
    },
  });

  function applySelection() {
    form.data[key] = selector.getSelected().key;
  }
 
  const label = ui.label({style: style.label}, key, display, inputElem);
  const selector = Selector(list, keys, inputElem, applySelection);
  const handlers = {
    33: selector.fastPrev,
    34: selector.fastNext,
    38: selector.prev,
    40: selector.next,
    13: applySelection,
  }
  const elem = ui.div({
    style: style.elem,
    onclick: showSelectorList,
    dataset: { tooltip: form.tooltips[key] },
  }, label, selector);


  input.HTMLElement = elem;

  form.data[key] || (form.data[key] = 0)
  selector.set(parseInt(form.data[key], 10));
  display.textContent = selector.getSelected().value;

  input.id = _keys(form.input).length;
  form.inputArray[input.id] = input;
  form.input[key] = input;

  let show, filterBy;
  let prevFormData = form.data[key];


  input.clear = fn => {
    label.style.color = "";
    selector.hide();
  };

  input.highlight = fn => {
    label.style.color = "aliceblue";
    showSelectorList();
  }

  input.filter = fn => {
    if (is.fn(fn)) {
      filterBy = fn;
    }
    return input;
  }

  input.if = fn => {
    if (is.fn(fn)) {
      show = fn;
    }
    return input;
  }

  on.focus(state => {
    if (state.focus === inputElem) {
      input.isActive = true;
      input.highlight();
    } else {
      input.isActive = false;      
      input.clear();
    }
  });

  const calcSize = () =>
    selector.HTMLElement.style.width = label.clientWidth + "px";

  function applyFilter() {
    if (filterBy) {
      selector.filter(filterBy);
    }
  }

  function showSelectorList() {
    if (selector.visible) { return }
    selector.select(0);
    calcSize();
    applyFilter();
    selector.show();
  }

  on.resize(calcSize);

  loop.add(() => {
    if (prevFormData !== form.data[key]) {
      selector.set(form.data[key]);
      display.textContent = selector.getSelected().value;
      applyFilter();
      setTimeout(selector.hide);
      input.exec();
    }
    prevFormData = form.data[key];
    elem.classList[(!show || show(form.data)) ? "remove" : "add"]("hide");
  });

  fallthrough(input, selector, "each");

  return input;
}
