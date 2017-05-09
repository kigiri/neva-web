import _keys from "_/object/keys";
import is from "./is";

/* this handle webworker communications

  // ===================  in the main file : ============================== \\
    sup("workerFileName", {
      "progress": () => {},
    }).then(say => {
      say.pouet("youpi !!");
    });


  // ===================  in the worker file : ============================ \\
    sup({
      "pouet": () => {},
    }).then(say => {
      say.progress("yo", 0.5);
    });

*/

function wesh(key, ...args) {
  this[key].apply(null, args);
}

const buildMesseger = (w, keys) => keys.reduce((r, key) => {
  r[key] = (...args) => w.postMessage([key].concat(args));
  return r;
}, {});

const yo = (a, b) => is.text(a) ? yo.ping(a, b) : yo.pong(a);

yo.pong = msg => new Promise(resolve => {
  onmessage = event => {
    onmessage = e => wesh.apply(msg, e.data);
    resolve(buildMesseger(self, event.data));
  }
  postMessage(_keys(msg));
});

yo.ping = (name, msg) => new Promise(resolve => {
  const w = new Worker("/"+ name +".js?" + Math.random());
  w.onmessage = event => {
    w.postMessage(_keys(msg));
    w.onmessage = e => wesh.apply(msg, e.data);
    resolve(buildMesseger(w, event.data));
  }
});

export default yo;
