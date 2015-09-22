const dom = {
  w: 0,
  h: 0,
};

const view = {
  w: 0,
  h: 0,
};

const mouse = {
  btn: {
    r: 0,
    m: 0,
    l: 0
  },
  y: 0,
  x: 0,
  hover: document.window
};

const scroll = {
  bottom: 0,
  size: 15,
  raw: 0,
  top: 0
};

const keys = {};
let i = 223;
while (--i > 0) {
  keys[i] = 0;
}

const state = {
  event: { diff: 0, start: 0, now: 0 },
  mouse,
  scroll,
  dom,
  keys,
  view,
  focus: document.window,
};

export default state;
export {scroll as scroll};
export {mouse as mouse};
export {view as view};
export {keys as keys};
export {dom as dom};
