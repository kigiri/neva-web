import ui from "ui/new";
import is from "$/is";
import Task from "$/Task";
import loop from "event/loop";
import selectEditableContent from "$/selectEditableContent";
import { on } from "event";
import _keys from "_/object/keys";
import type from "$/type";

import { text as style } from "style/inputs";

export default function text(form, key, limit = Infinity) {
  const input = Task();
  const inputElem = ui.span({
    style: style.input,
    spellcheck: false,
    contentEditable: true,
  });
  const text = ui.span({style: {display: "inline-block"}}, key);
  const elem = ui.label({
    style: style.label,
    onclick: () => { input.highlight() },
    dataset: { tooltip: form.tooltips[key] },
  }, text, inputElem, ui.div({style:{clear: "both"}}));

  input.HTMLElement = elem;
  form.data[key] || (form.data[key] = "");
  inputElem.textContent = form.data[key];
  input.id = _keys(form.input).length;
  form.inputArray[input.id] = input;
  form.input[key] = input;

  let isValid = type.text.max(limit);
  let show;
  let prevFormData = form.data[key];

  input.test = fn => {
    if (is.fn(fn)) {
      isValid = fn;
    }
    return input;
  }

  input.set = value => {
    inputElem.innerHTML = value;
    form.data[key] = value;
    input.exec();

    return input;
  }

  input.clear = fn => {
    elem.style.color = "";
    inputElem.textContent = form.data[key];
  };

  // since it's editable content, we don't have access to .select :)
  input.highlight = () => {
    selectEditableContent(inputElem);
    elem.style.color = "aliceblue";
  }

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

  on.focus(state => {
    if (state.focus === inputElem) {
      input.isActive = true;
      input.highlight();
    } else {
      input.isActive = false;      
      input.clear();
    }
  });

  function applyLargeStyle() {
    inputElem.style.background = "#333";
    inputElem.style.textAlign = "left",
    inputElem.style.outline = "#2E2E2E solid 1px";
    inputElem.style.padding = "5px";
    inputElem.style.margin = "4px 0";
    inputElem.style.float = "left";
  }
  function clearLargeStyle() {
    inputElem.style.background = "";
    inputElem.style.textAlign = "right";
    inputElem.style.outline = "none";
    inputElem.style.padding = "";
    inputElem.style.margin = "0 4px";
    inputElem.style.float = "right";
  }

  loop.add(event => {
    if (!show || show(form.data)) {
      if (prevFormData !== form.data[key]) {
        inputElem.textContent = form.data[key];
        input.exec();
      } else {
        const val = inputElem.textContent;

        input.setValidState(isValid(val));
        if (val !== form.data[key] && input.isValid) {
          form.data[key] = val;
          inputElem.textContent = val;
          input.exec();
        }
      }
      setTimeout(inputElem.offsetTop - text.offsetTop < 10
        ? clearLargeStyle
        : applyLargeStyle);
      prevFormData = form.data[key];
      elem.classList.remove("hide");
    } else {
      elem.classList.add("hide");
    }
  });

  input.setColor = color => inputElem.style.color = color;

  return input;
}
