function toCamelCase(res, word) {
  return res + (res ? word[0].toUpperCase() + word.slice(1) : word);
}

function camelCase(key) {
  return key.toLowerCase().split(" ").reduce(toCamelCase);
}

const bitmasksValues = (ret => {
  let _mask = 1;
  for (let i = 0; i < 64; i++) {
    ret.push(_mask);
    _mask *= 2;
  }
  return ret;
})([]);

export default (res, name, id) => {
  const key = camelCase(name);
  const bitmask = bitmasksValues[id];
  const playerClass = { id, bitmask, name, key };

  res[id] = playerClass;
  res[key] = playerClass;
  res.bitmask[bitmask] = playerClass;

  return res;
}
