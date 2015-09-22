import loop from "./loop";
import { execute, events } from './index';
import state, { dom, view, mouse, scroll, keys } from 'state/dom';

// Add a div to find the scroll bar width
var scrollBox = document.createElement('div');
scrollBox.style.visibility = "hidden";
scrollBox.style.overflowX = "scroll";
document.body.appendChild(scrollBox);

window.onmousemove = event => {
  mouse.x = event.pageX;
  mouse.y = event.pageY;
  if (!event.which) {
    refreshAllButton();
  }
  events.mouseMove = true;
};

window.onkeyup = event => {
  keys[event.which] = 0;
  events.keyUp = true;
};

window.onkeydown = event => {
  keys[event.which] = state.event.start;
  events.keyDown = true;
};

window.onmousedown = event => {
  switch (event.which) {
  case 1: mouse.btn.l = state.event.start; events.leftClickDown   = true; break;
  case 2: mouse.btn.m = state.event.start; events.middleClickDown = true; break;
  case 3: mouse.btn.r = state.event.start; events.rightClickDown  = true; break;
  default: break;
  }
}

function refreshAllButton() {
  if (mouse.btn.m) {
    releaseMiddleButton();
  }
  if (mouse.btn.r) {
    releaseRightButton();
  }
  if (mouse.btn.l) {
    releaseLeftButton();
  }
}

function releaseMiddleButton() { mouse.btn.m = 0; events.middleClickUp = true; }
function releaseRightButton() { mouse.btn.r = 0; events.rightClickUp = true; }
function releaseLeftButton() { mouse.btn.l = 0; events.leftClickUp = true; }

window.onmouseup = event => {
  switch (event.which) {
  case 1: releaseLeftButton(); break;
  case 2: releaseMiddleButton(); break;
  case 3: releaseRightButton(); break;
  default: break;
  }
}

const base = document.documentElement;

function apply(obj, key, value, eventKey) {
  if (obj[key] !== value) {
    obj[key] = value;
    events[eventKey] = true;
  }
}

// init
loop.add((event) => {
  state.event = event;
  scroll.size = scrollBox.getBoundingClientRect().height;
  console.log("Scroll bar size:", scroll.size);
  document.body.removeChild(scrollBox);
  return false;
})

// don't trigger focus on body until mouse release
function checkFocus() {
  let active = document.activeElement;
  if (active !== document.body
    || (state.mouse.btn.l === 0
     && state.mouse.btn.m === 0
     && state.mouse.btn.r === 0)) {
    apply(state, "focus", active, "focus");
  }
}

function checkScroll(raw) {
  if (raw === scroll.raw) { return }
  scroll.raw = raw;
  scroll.top = Math.abs(raw);
  scroll.bottom = scroll.top + view.h;
  events.scroll = true;
}

// Update loop
loop.add(event => {
  const b = base.getBoundingClientRect();
  apply(dom, "h", b.height, "resize");
  apply(dom, "w", b.width, "resize");
  apply(view, "h", window.innerHeight, "resize");
  apply(view, "w", window.innerWidth, "resize");
  apply(mouse, "hover", document.elementFromPoint(mouse.x, mouse.y), "hover");
  checkScroll(b.top);
  checkFocus();
  execute();
});
