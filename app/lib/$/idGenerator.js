import _kebabCase from "_/string/kebabCase";
import memoize from "_/function/memoize";

const kebabCase = memoize(_kebabCase);
let idBank = {};

export default (key, rootId) => {
  const idBase = kebabCase(key) || "id";
  let id = idBase, i = 0;

  while (idBank[id] && idBank[id] !== rootId) {
    id = idBase +"-"+ i;
    i++;
  }
  idBank[id] = rootId;
  return id;
};

