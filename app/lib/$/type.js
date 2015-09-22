function text(str) { return typeof str === "string" }

function isInt(n) { return isNumber(n) && Math.floor(n) === n }

function isNumber(n) { return typeof n === "number" && !isNaN(n) }

function range(fn, min, max) { return n => fn(n) && n >= min && n <= max }

function intRange(min, max) { return range(isInt, min, max); }

function bytesToBits(bytes) { return bytes * 8 }

/*
  because using (1 << bits) isn't working on 64bits numbers
  performance here isn't important
*/

function calcBitsMaxValue(bits) {
  let total = 1;

  while (bits--) { total *= 2 }

  return total - 1;
}

function byteRange(byteCount) {
  const total = calcBitsMaxValue(bytesToBits(byteCount));
  const low = -((total + 1) / 2);
  const high = (total - 1) / 2;
  const fn = intRange(low, high);

  fn.unsigned = intRange(0, total);
  fn.high = high;
  fn.low = low;
  fn.total = total;

  return fn;
}

const int = byteRange(4);

int.big = byteRange(8);
int.tiny = byteRange(1);
int.small = byteRange(2);
int.medium = byteRange(3);

int.max = max => n => isInt(n) && n <= max;
text.max = max => str => text(str) && str.length <= max;
isNumber.max = max => n => isNumber(n) && n <= max;

export default {
  range,
  intRange,
  text,
  int,
  num: isNumber,
  float: isNumber,
};
