import _keys from "_/object/keys";
    console.log("settin'", name)
    if (_workers[name]) { return console.error("worker", name, "already here!") }

    _workers[name] = {
      keys: _keys(msg),
    }

    const w = new Worker("/"+ name +".js");

    function yo(key, ...agrs) {
      msg[key].apply(null, agrs);
    }

    w.onmessage = e => yo.apply(null, e.data);

    return w;

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
