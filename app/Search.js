import bar from "./SearchBar";
import results from "./Results";
import ui from "ui/new";

const list = [
  {
    name: "items",
  },
  {
    name: "creatures",
  },
]

function init() {
  list.forEach(bar.push);
  bar.select();
}

export default {
  results,
  bar,
  init,
  HTMLElement: ui.div({id: "search"}, bar, results),
}
