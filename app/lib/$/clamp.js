export default (min, max, value) =>
  (value < min) ? min : (value > max) ? max : value;
