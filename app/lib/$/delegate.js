export default (fn, thisArg, event) => {
  if (typeof fn === "function") {
    return fn.call(thisArg, event);
  }
  return true;
};
