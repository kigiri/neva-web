import ui from "ui/new";
import loop from "event/loop";
import selectEditableContent from "$/selectEditableContent";
import keyHandler from "$/keyHandler";
import { search as style } from "style/inputs";
import Task from "$/Task";

const me = Task();

// me.value
// me.selectedList

// Search for items :
// name
// level
// quality
// category ("armor", "weapon", "consumable", "trade goods", "glyhs", "currency", "quest", "keys", "containers")
// if armor or weapon : slot & type
// if armor or weapon : stat
// if weapon : damages min / max
// if armor : armor

const list = [
  "creatures",
  "players",
  "quests",
  "items",
];

const placeholder = "Either "+ list.reduce((r, v, i, t) =>
  r +(i === t.length - 1 ? ' or ' : ', ') + v) +".";

const getNextInList = (() => {
  let prev = -1;
  return reverse => {
    prev += reverse ? -1 : 1;
    if (prev > list.length - 1) {
      prev = 0;
    } else if (prev < 0) {
      prev = list.length - 1;
    }
    return list[prev];
  }
})()

function matchInList(val) {
  if (!val) { return false }
  val = val.toLowerCase();
  for (let match of list) {
    if (match.indexOf(val) === 0) {
      return match;
    }
  }
  return false;
}

function deselectListIfEmpty() {
  if (!me.value) {
    me.selectedList = false;
    innerBar.style.display = "none";
    autoComlete.textContent = placeholder;
    elem.classList.remove("invalid");
  }
  return false;
}

const skip = () => {};
const input = ui.span({
  tabIndex: 1,
  style: style.input,
  spellcheck: false,
  contentEditable: true,
  onkeydown: keyHandler({
    8: deselectListIfEmpty,
    9: event => { // tab
      if (!me.selectedList) {
        if (!me.value) {
          autoComlete.textContent = getNextInList(event.shiftKey);
        } else {
          tryToChooseList(me.value);
        }
      }
    },
    13: () => { // enter
      if (!me.selectedList) {
        if (!me.value) {
          tryToChooseList(autoComlete.textContent);
        }
      } else {
        // call select on results
      }
    },
    37: deselectListIfEmpty,
    38: () => {
      if (!me.selectedList) {
        if (!me.value) {
          autoComlete.textContent = getNextInList(true);
        }
      } else {
        // call results prev
      }
    },
    39: () => {
      if (!me.selectedList && !me.value) {
        tryToChooseList(autoComlete.textContent);
      }
      return false;
    },
    40: () => {
      if (!me.selectedList) {
        if (!me.value) {
          autoComlete.textContent = getNextInList(false);
        }
      } else {
        // call results next
      }
    },
  }),
});
const innerBar = ui.span({ id: "caca", style: style.innerBar }, "waht");
const autoComlete = ui.span({ style: {
  color: "#666",
  whiteSpace: "pre",
} }, placeholder);

const elem = ui.div({
  style: style.outerBar,
  onclick: e => selectEditableContent(input),
}, innerBar, input, autoComlete);


function tryToChooseList(val) {
  me.selectedList = matchInList(val);
  if (!me.selectedList) { return }
  innerBar.textContent = me.selectedList;
  innerBar.style.display = "block";
  input.textContent = "";
  autoComlete.textContent = "";
  me.value = "";
  elem.classList.remove("invalid");
}

function listSelection(val) {
  if (!val) {
    autoComlete.textContent = placeholder;
    elem.classList.remove("invalid");
  } else {
    const match = matchInList(val);
    if (match) {
      autoComlete.textContent = match.slice(val.length);
      elem.classList.remove("invalid");
    } else {
      autoComlete.textContent = '';
      elem.classList.add("invalid");
    }
  }
}

loop.add(e => {
  const val = input.textContent;
  if (me.value !== val) {
    me.value = val;
    if (me.selectedList) {
      me.exec(val);
    } else {
      listSelection(val);
    }
  }
});

me.HTMLElement = elem;

me.select = () => {
  selectEditableContent(input);
  return me;
}

export default me;