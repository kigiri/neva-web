import newState from "state/new"
import state from "state/dom"
import events from "event"

const view = {
  add: events.resize.add,
  del: events.resize.del,
  get: () => state.view
}

const dom = {
  add: events.resize.add,
  del: events.resize.del,
  get: () => state.dom
}

const mouse = {
  add: events.mouseMove.add,
  del: events.mouseMove.del,
  get: () => state.mouse
}

const sizeData = { dom: state.dom, view: state.view }
const size = {
  add: events.resize.add,
  del: events.resize.del,
  get: () => sizeData
}

export default newState({
  dom,
  view,
  size,
  spotList: [],
  spot: {
    pos: [-21.14, 55.53]
  },
})

