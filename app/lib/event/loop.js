import $now from "$/now";
import Task from "$/Task";

const update = requestAnimationFrame ? {
  next: requestAnimationFrame.bind(window),
  stop: cancelAnimationFrame.bind(window) || () => {},
} : {
  next: fn => setTimeout(fn, 16),
  stop: clearTimeout.bind(window)
};

const task = Task();
const event = {};
let run = false;
let id = 0;

function initEvent() {
  event.start = event.now = $now();
  event.diff = 16;
}

function updateEvent() {
  const now = $now();
  event.diff = now - event.start;
  event.now = event.start = now;
}

function checkEvent() {
  event.now = $now();
  const p = event.now - event.start;
  if (p > 9) {
    console.log(p);
    return false;
  }
  return true;
  // return !(p > 9);
  // return !(event.now - event.start > 9);
}

function loop() {
  let i = -1, cleanup = [];

  updateEvent();
  task.execCheck(event, checkEvent);
  if (run) {
    id = update.next(loop);
  }
}

const handler = {}

handler.add = task.add;
handler.del = task.del;

handler.stop = () => {
  if (!run) { return handler; }
  update.stop(id);
  run = false;
  return handler;
};

handler.start = () => {
  if (run) { return handler; }
  run = true;
  initEvent();
  update.next(loop);
  return handler;
};

export default handler;
