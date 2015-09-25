import ui from "ui/new";
import sup from "$/sup";
import loop from 'event/loop';
import Search from "./Search";
import ToolTip from "./ToolTip";
import Progress from "./Progress";

sup("dataWorker", {
  progress: Progress.set,
  clearResults: Search.Results.clear,
  result: (...resultsArray) => {
    Search.Results.push(resultsArray, "entry"); // need to import primaryKeys
  },
}).then(worker =>{
  window.ask = worker.ask;
  Search.Bar.add(value => worker.ask(Search.Bar.selectedList.name, value))
});

const me = {
  HTMLElement: ui.div({id: "app"}, Search, ToolTip, Progress),
  init: () => {
    loop.start();
    Search.init();
  }
};

export default me;
