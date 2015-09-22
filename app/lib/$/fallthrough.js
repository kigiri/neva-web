export default (source, target, keys) => {
  const makeFallthroughMethod = key => {
    source[key] = function (...args) {
      target[key].apply(this, args);
      return source;
    };
  }
  if (typeof keys === "string") {
    makeFallthroughMethod(keys);
  } else {
    keys.forEach(makeFallthroughMethod);
  }
};
