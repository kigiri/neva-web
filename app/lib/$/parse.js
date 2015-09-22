import is from "./is";

const dom = new DOMParser();

const tryCatch(str, fn, catchFn) {
  if (is.fn(catchFn)) {
    try {
      return fn(str);
    } catch (err) {
      return catchFn(err);
    }
  }
  return fn(str);
}

const genCatcher = (fn) => (str, catchFn) => tryCatch(str, fn, catchFn);

export default {
  dom: genCatcher(str => dom.parseFromString(str)),
  svg: genCatcher(str => dom.parseFromString(str, "image/svg+xml")),
  json: genCatcher(str => JSON.parse(str)),
}
