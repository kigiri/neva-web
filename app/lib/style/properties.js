import capitalize from "_/string/capitalize";
import _keys from '_/object/keys';

const availableKeys = _keys(window.getComputedStyle(document.documentElement, ''));

function makePrefixRexExp(prefix) {
  var firstChar = prefix[0];
  return new RegExp("^["+ firstChar.toLowerCase()
    + firstChar.toUpperCase() +"]"+ prefix.slice(1)
    +"[A-Z][a-zA-Z]+$");
}

const prefix = (function (prefixes) {
  prefixes = prefixes.concat(prefixes.map(p => capitalize(p)));
  let i = -1;
  while (++i < prefixes.length) {
    let j = -1;
    const prefixRegExp = makePrefixRexExp(prefixes[i]);
    while (++j < availableKeys.length) {
      if (prefixRegExp.test(availableKeys[j])) { return prefixes[i] }
    }
  }
})([
  "Webkit",
  "Moz",
  "ms",
  "O",
  "khtml"
]);

const testAvailablility = {};
availableKeys.forEach(key => testAvailablility[key.toLowerCase()] = true);

const prefixBank = {};

function getKey(key) {
  if (!testAvailablility[key.toLowerCase()]) {
    let prefixedKey = prefix + capitalize(key);
    if (testAvailablility[prefixedKey.toLowerCase()]) {
      return prefixedKey;
    }
  }
  return key;
}

export default key => {
  if (!prefixBank[key]) {
    prefixBank[key] = getKey(key);
  }
  return prefixBank[key];
}