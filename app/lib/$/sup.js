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
  w.postMessage(_keys(msg));
});

const yo = (a, b) => is.text(a) ? yo.main(a, b) : yo.worker(a);

yo.worker = msg => sup(self, msg);
yo.main = (name, msg) => sup(new Worker("/"+ name +".js?" + Math.random()), msg);

export default yo;
