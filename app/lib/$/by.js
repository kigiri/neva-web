function by(key, desc) {
  const step = desc ? -1 : 1;
  return (a, b) => {
    a = a[key];
    b = b[key];
    if (a === b) { return 0; }
    if (a > b) { return step; }
    return -step;
  }
}

[
  "id",
  "entry",
  "guid",
  "value",
  "title",
  "score",
  "index",
  "priority",
  "date",
  "time",
].forEach(key => {
  by[key] = by(key);
  by[key +"Desc"] = by(key, true);
});

by.join = (...fnArray) => {
  function recur(a, b, i) {
    const result = fnArray[i](a, b);
    if (!result && ++i < fnArray.length) {
      return recur(a, b, i);
    }
    return result;
  }
  return (a, b) => recur(a, b, 0);
}

by._name = by("name") // name is reserved in functions... so yeah...
by.nameDesc = by("name", true);

export default by;
