import prefix from "style/properties";
import _keys from '_/object/keys';

function setPrefix(obj) {
  var prefixed = {};
  _keys(obj).forEach(key => {
    prefixed[prefix(key)] = obj[key];
  });
  return prefixed;
}

export default style => {
  style = setPrefix(style);
  const keys = _keys(style);

  return obj => {
    if (!obj) { return style; }
    obj = setPrefix(obj);

    var key
      , i = -1;

    while (++i < keys.length) {
      key = keys[i];
      if (!obj[key]) {
        obj[key] = style[key];
      }
    }

    return obj;
  }
}