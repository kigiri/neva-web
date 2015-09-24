import ui from "ui/new";
import loop from 'event/loop';
import ItemForm from "./ItemForm";
import Search from "./Search";
import Progress from "./Progress";
import ToolTip from "./ToolTip";
import sup from "$/sup";

sup("dataWorker", {
  progress: Progress.set,
  clearResults: Search.results.clear,
  result: (score, data) => {
    Search.results.push(score, data.name, data, "entry");
  },
}).then(worker =>{
  console.log("worker is now available", worker);
  Search.bar.add(value => worker.ask(Search.bar.selectedList, value))
});

const me = {
  HTMLElement: ui.div({id: "app"}, Search, ToolTip, Progress),
  init: () => {
    loop.start();
    Search.init();
  }
};

export default me;
