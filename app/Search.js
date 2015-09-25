import Bar from "./SearchBar";
import Results from "./Results";
import ItemResult from "./ItemResult";
import ItemForm from "./ItemForm";
import ui from "ui/new";

const elem = ui.div({id: "search"}, Bar, Results);

let lastOpenElement;

function open(el) {
  Results.HTMLElement.remove();
  elem.appendChild(el);
  lastOpenElement = el;
}

function loadResults() {
  if (lastOpenElement) {
    lastOpenElement.remove();
  }
  elem.appendChild(Results.HTMLElement);
}

const list = [
  {
    name: "items",
    header: ItemResult.header,
    row: ItemResult,
    next: () => Results.next(),
    prev: () => Results.prev(),
    select: () => Results.select(),
    activate: () => Results.setList(list[0]), // meh...
    open: data => {
      ItemForm.data = data;
      open(ItemForm.HTMLElement);
    }
  },
  {
    name: "creatures",
  },
]

function init() {
  list.forEach(Bar.push);
  Bar.select();
}

export default {
  Bar,
  init,
  Results,
  loadResults,
  HTMLElement: elem,
}
