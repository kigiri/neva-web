const num = n => typeof n === "number" && !isNaN(n);
const text = str => typeof str === "string";

export default {
  fn: fn => typeof fn === "function",
  num,
  int: Number.isInteger,
  text,
  string: text,
  array: Array.isArray.bind(Array),
  obj: obj => typeof obj === "object",
  HTMLElement: el => el instanceof HTMLElement,
};
