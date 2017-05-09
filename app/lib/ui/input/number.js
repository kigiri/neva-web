import ui from "ui/new";
import is from "$/is";
import Task from "$/Task";
import loop from "event/loop";
import { on } from "event";
import _keys from "_/object/keys";
import { number as style } from "style/inputs";

const ZERO = "0".charCodeAt(0);

function stringToIntArray(str) {
  const max = str.length;
  const result = Array(max);
  let i = -1;

  while (++i < max) {
    result[i] = str.charCodeAt(i) - ZERO;
  }

  return result;
}

function flattenArray(arr) {
  let total = 0;

  function recur(i) {
    recur(i + 1);
    if (i >= arr.length) { return }
    const n = arr[i];
    if (n > 10) {

    } else if (n < 10) {

    }
  }
  recur(0);

  return total;
}


const calcDiffValue = diff => Math.max(Math.pow(10, diff), 1);
const keyHandlers = {
  38: calcDiffValue,
  40: diff => -calcDiffValue(diff),
};

export default function number(form, key, wide) {
  const input = Task();
  const inputElem = ui.input({
    type: "text",
    style: style.input,
    onkeydown: event => {
      const fn = keyHandlers[event.keyCode];
      const t = event.target;

      if (is.fn(fn)) {
        relSelectionPos = t.value.length - t.selectionEnd;
        form.data[key] += fn(relSelectionPos);
        event.preventDefault();
      }
    } 
  });
  const elem = ui.label({
    style: wide ? style.labelWide : style.label,
    onclick: () => inputElem.select(),
    dataset: { tooltip: form.tooltips[key] },
  }, key, inputElem);

  input.HTMLElement = elem;

  form.data[key] || (form.data[key] = 0);
  inputElem.value = form.data[key];

  input.id = _keys(form.input).length;
  form.inputArray[input.id] = input;
  form.input[key] = input;

  let prevFormData = form.data[key];
  let isValid = is.num;
  let relSelectionPos;
  let show;

  input.test = fn => {
    if (is.fn(fn)) {
      isValid = fn;
    }
    return input;
  }

  input.clear = fn => {
    elem.style.color = "";
    inputElem.value = form.data[key];
  };

  input.highlight = fn => elem.style.color = "aliceblue";

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

  input.select = () => {
    inputElem.select();
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


  const setSelection = pos => {
    inputElem.selectionStart = pos;
    inputElem.selectionEnd = pos;
  }

  loop.add(event => {
    if (!show || show(form.data)) {
      if (prevFormData !== form.data[key]) {
        const pos = inputElem.selectionEnd;
        inputElem.value = form.data[key];
        if (relSelectionPos !== undefined) {
          setSelection(form.data[key].toString().length - relSelectionPos);
          relSelectionPos = undefined;
        }
        input.exec(event);
      } else {
        const val = parseInt(inputElem.value, 10) || 0;

        if (val.toString() !== inputElem.value) {
          input.setValidState(false);
        } else {
          input.setValidState(isValid(val));
          if (val !== form.data[key] && input.isValid) {
            form.data[key] = val;
            input.exec(event);
          }
        }
      }
      prevFormData = form.data[key];
      input.HTMLElement.classList.remove("hide");
    } else {
      input.HTMLElement.classList.add("hide");
    }
  });

  input.setColor = color => inputElem.style.color = color;

  return input;
}
