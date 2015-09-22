import _keys from "_/object/keys";

const matchContent = /^Content-Type\:\s*(.*?)$/mi;
const isFn = fn => typeof fn === "function";
const warn = (methodName, fn) => console.warn(methodName,
  "argument must be a function, was :", typeof fn);
const skip = () => {};

const checkFn = (thisArg, fn, key, action) => {
  if (isFn(fn)) {
    action(fn)
  } else {
    warn(key);
  }
  return thisArg;
}

export default function (type, url, header, data) {
  var req = new XMLHttpRequest();

  if (data && typeof data === "object") {
    _keys(data).forEach(key => req[key] = data[key]);
  }

  if (header && typeof header === "object") {
    _keys(header).forEach(key => req.setRequestHeader(key, header[key]));
  }

  req.open(type, url, true);


  let q = new Promise((resolve, reject) => {
    req.onerror = reject;
    req.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        resolve(this);
      }
    };
  });

  req.send(req.body);

  const setCatch       = fn => q = q.catch(fn);
  const setThen        = fn => q = q.then(fn);
  const setOnloadstart = fn => req.onloadstart = fn;
  const setOnloadend   = fn => req.onloadend   = fn;
  const setOnprogress  = fn => req.onprogress  = fn;

  const self = {
    catch:       fn => checkFn(self, fn, "catch",       setCatch),
    then:        fn => checkFn(self, fn, "then",        setThen),
    onloadstart: fn => checkFn(self, fn, "onloadstart", setOnloadstart),
    onloadend:   fn => checkFn(self, fn, "onloadend",   setOnloadend),
    onprogress:  fn => checkFn(self, fn, "onprogress",  setOnprogress),
    abort() {
      req.abort();
      return self;
    },
    getContentType: () => req.getAllResponseHeaders().match(matchContent)[1]
  };

  return self;
}
