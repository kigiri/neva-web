import ui from "ui/new";
import loop from 'event/loop';
import ItemForm from "./ItemForm";
import SearchBar from "./SearchBar";
import Progress from "./Progress";
import ToolTip from "./ToolTip";
import Results from "./Results";
import sup from "$/sup";

sup("dataWorker", {
  progress: Progress.set,
  clearResults: Results.clear,
  result: (score, data) => {
    Results.push(score, data.name, data, "entry");
  },
}).then(worker =>
  SearchBar.add(value => worker.ask(SearchBar.selectedList, value)));

const me = {
  HTMLElement: ui.div({id: "app"}, SearchBar, Results, ToolTip, Progress),
  init: () => {
    loop.start();
    SearchBar.select();
  }
};

export default me;
