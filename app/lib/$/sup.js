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

function wesh(key, ...agrs) {
  this[key].apply(null, agrs);
}

const sup = (w, msg) => new Promise(resolve => {
  w.onmessage = e => {
    w.onmessage = e => wesh.apply(msg, e.data);
    resolve(e.data.reduce((r, key) => {
      r[key] = (...args) => w.postMessage([key].concat(args));
      return r;
    }, {}));
  }
});

const yo = (a, b) => is.text(a) ? yo.main(a, b) : yo.worker(a);

yo.worker = msg => {
  self.postMessage(_keys(msg));
  return sup(self, msg);
};

yo.main = (name, msg) => {
  const w = new Worker("/"+ name +".js?" + Math.random());
  return sup(w, msg).then(pass => {
    w.postMessage(_keys(msg))
    return pass;
  });
};

export default yo;
