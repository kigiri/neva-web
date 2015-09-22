

const _workers = {};

const me = {
  add: (name, msg) => {
  },
  get: name => {
    console.log("gettin'", name)
    const workr = _workers[name];
    if (!workr) { return console.error("worker", name, "not found!") }
    if (workr.say) { return workr.say }
    workr.say = workr.keys.reduce((r, key) => {
      r[key] = (...args) => postMessage([key].concat(args));
      return r;
    }, {});

    return workr.say;
  }
};

export default me;
