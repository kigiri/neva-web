import Task from "$/Task";
import state from "state/dom";
import _keys from '_/object/keys';

const events = {
  middleClickDown: false,
  rightClickDown: false,
  leftClickDown: false,
  middleClickUp: false,
  rightClickUp: false,
  leftClickUp: false,
  mouseMove: false,
  keyDown: false,
  resize: false,
  scroll: false,
  keyUp: false,
  hover: false,
  focus: false
};

const on = {};
const tasks = {};

const eventKeys = _keys(events);

let i = -1;

while (++i < eventKeys.length) {
  let t = Task()
    , key = eventKeys[i];

  tasks[key] = t;
  on[key] = t.add;
  // if ("mouseMove" !== key && "hover" !== key) {
  //   t.add(e => console.log(~~(e.event.diff), key));
  // }
}

function execute() {
  let i = -1
    , key;

  while (++i < eventKeys.length) {
    key = eventKeys[i];
    if (events[key]) {
      tasks[key].exec(state);
      events[key] = false;
    }
  }
}

export default tasks;
export {execute as execute};
export {events as events};
export {on as on};

import "./watcher";