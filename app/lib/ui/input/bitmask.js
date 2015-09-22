import is from "$/is";
import ui from "ui/new";
import Task from "$/Task";
import { on } from "event";
import _keys from "_/object/keys";
import loop from "event/loop";

import { bitmask as style } from "style/inputs";

// because javascript can't handle 64bit int bitwise opperations...
function decomposeBigInt(n) {
  const result = [];

  (function recur(bit) {
    if (n >  bit) { n = recur(bit * 2) }
    if (n >= bit) {
      result.push(bit);
      return n - bit;
    }
    return n;
  })(1);

  return result;
}

function bitSelector(b, toggle, rows) {
  const elem = ui.div({
    style: (style.btn[(rows - 1)] || style.btn[0]),
    onclick: toggle.bind(null, b),
    dataset: { tooltip: b.name +" ("+ b.bitmask +")" },
  }, b.name);

  b.on = () => {
    elem.style.color = "aliceblue";
    b.isOn = true;
  };

  b.off = () => {
    elem.style.color = "";
    b.isOn = false;
  };

  b.HTMLElement = elem;

  return elem;
}

function atoi(n) { return parseInt(n, 10) || 0 }

export default function number(form, key, list, rows) {
  list = _keys(list).reduce((r, key) =>{
    if (!/^Unk/.test(list[key].name)) {
      r[key] = list[key];
    }
    return r;
  }, {});
  const input = Task();
  const keys = _keys(list);
  const inputElem = ui.input({ type: "number", style: style.input });
  const max = keys.reduce((r, n) => r + atoi(n), 0 );
  const isValid = n => is.int(n) && n >= -1 && n <= max;

  function toggleBit(b) {
    if (b.isOn) {
      b.off();
    } else {
      b.on();
    }
    inputElem.value = computeValue();
  }

  function areAllBitsOn() {
    let i = -1;

    while (++i < keys.length) {
      if (!list[keys[i]].isOn) { return false }
    }

    return true;
  }

  function toggleAllBits(state) {
    if (typeof state !== "boolean") {
      state = areAllBitsOn();
    }
    const actionKey = state ? "off" : "on";
    let i = -1;

    while (++i < keys.length) {
      list[keys[i]][actionKey]();
    }
    inputElem.value = state ? 0 : -1;
  }


  const bitsElem = keys.map(i => bitSelector(list[i], toggleBit, rows));
  const label = ui.label({style: style.label}, key, inputElem);
  if (/^All/.test(key)) {
    bitsElem.unshift(ui.div({
      style: (style.btn[(rows - 1)] || style.btn[0]),
      onclick: toggleAllBits,
    }, "All"));
  }
  const listContainer = ui.div({style: {
    overflow: "hidden",
    width: "100%",
    tableLayout: "fixed",
    display: "table",
  }}, bitsElem);
  const elem = ui.div({
      style: style.container,
      onclick: inputElem.focus.bind(inputElem),
      dataset: { tooltip: form.tooltips[key] },
    },
    label,
    listContainer);

  input.HTMLElement = elem;
  form.data[key] || (form.data[key] = 0);
  inputElem.value = form.data[key];
  input.id = _keys(form.input).length;
  form.inputArray[input.id] = input;
  form.input[key] = input;

  let show;
  let prevFormData = form.data[key];


  input.clear = fn => {
    label.style.color = "";
    inputElem.value = form.data[key];
  };

  input.highlight = fn => label.style.color = "aliceblue";

  input.setValidState = state => {
    if (input.isValid === state) return;
    input.isValid = state;
    inputElem.classList[state ? "remove" : "add"]("invalid");
  };

  input.if = fn => {
    if (is.fn(fn)) {
      show = fn;
    }
    return input;
  }

  // on.hover(state => {
  //   if (state.hover)
  // });

  function applyValue(val) {
    if (val === -1) { return toggleAllBits(false) }
    if (val === 0) { return toggleAllBits(true) }

    const bitmasks = decomposeBigInt(val);

    keys.forEach(key => bitmasks.indexOf(list[key].bitmask) !== -1
      ? list[key].on()
      : list[key].off());
  }

  function computeValue() {
    return keys.reduce((total, key) =>
      total += list[key].isOn ? list[key].bitmask : 0, 0);
  }

  on.focus(state => {
    if (state.focus === inputElem) {
      input.isActive = true;
      listContainer.style.display = "table";
      input.highlight();
    } else {
      input.isActive = false;
      listContainer.style.display = "none";
      input.clear();
    }
  });

  input.set = value => {
    form.data[key] = value;
    applyValue(value);
    input.exec();
    return input;
  }

  loop.add(event => {
    if (!show || show(form.data)) {
      if (prevFormData !== form.data[key]) {
        applyValue(form.data[key]);
        input.exec();
      } else {
        const val = atoi(inputElem.value);

        if (val.toString() !== inputElem.value) {
          input.setValidState(false);
        } else {
          input.setValidState(isValid(val));
          if (val !== form.data[key] && input.isValid) {
            input.set(val);
          }
        }
      }
      prevFormData = form.data[key];
      elem.classList.remove("hide");
    } else {
      elem.classList.add("hide");
    }
  });

  return input;
}
