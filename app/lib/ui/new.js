import _keys from "_/object/keys";

function $add(newChild, parent, position) {
  if (!newChild) return null;
  if (typeof newChild === "string") {
    newChild = document.createTextNode(newChild);
  } else if (Array.isArray(newChild)) {
    var i = -1, len = newChild.length, ret;
    while (++i < len) {
      ret = $add(newChild[i], parent, position);
    }
    return ret;
  } else if (!(newChild instanceof HTMLElement)) {
    if (newChild.HTMLElement instanceof HTMLElement) {
      newChild = newChild.HTMLElement;
    } else return null;
  }
  if (typeof position === "number") {
    var previousChild = parent.children[position];
    if (previousChild) return previousChild.appendBefore(newChild);
  }
  if (parent instanceof HTMLElement) return parent.appendChild(newChild);
  return document.body.appendChild(newChild);
}

function newHTMLElement() {
  const elem = document.createElement(this.key);
  const firstArgument = arguments[0];
  const argc = arguments.length;
  let  i = -1;

  if (firstArgument && typeof firstArgument === "object") {
    _keys(firstArgument).forEach(key => {
      if (key === "style" || key === "dataset") {
        let style = firstArgument[key];
        _keys(style).forEach(subKey => elem[key][subKey] = style[subKey]);
      } else {
        elem[key] = firstArgument[key]
      }
    });
    i++;
  }

  while (++i < argc) { $add(arguments[i], elem) }

  return elem;
}

function $new(key) {
  newHTMLElement.bind({key: key || "div"});
}

[
  "b",
  "i",
  "s",
  "p",
  "h1",
  "div",
  "img",
  "span",
  "input",
  "label",
  "color",
  "legend",
  "option",
  "select",
  "fieldset",
  "datalist",
  "textarea",
  "form"
].forEach(function (key) { $new[key] = newHTMLElement.bind({key: key}); });

export default $new;
