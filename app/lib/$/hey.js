import _keys from "_/object/keys";

export default (name, msg) => {
  console.log("settin'", name)
  if (_workers[name]) { return console.error("worker", name, "already here!") }

  const w = new Worker("/"+ name +".js");

  function yo(key, ...agrs) {
    msg[key].apply(null, agrs);
  }

  return new Promise(resolve => {
    w.onmessage = e => {
      w.onmessage = e => yo.apply(null, e.data);
      resolve(e.data.reduce((r, key) => {
        r[key] = (...args) => w.postMessage([key].concat(args));
        return r;
      }, {}));
    }
    w.postMessage(_keys(msg));
  })
}
