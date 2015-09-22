import styleApply from "style/ui";
import ui from "ui/new";
import { on } from "event";
import $now from "$/now";
import loop from "event/loop";
import dom from "state/dom";


const me = {};
const elem = ui.div({
  style: styleApply({
    position: "fixed",
    width: "300px",
    top: 0,
    left: 0,
    background: "rgba(0,0,0,0.7)",
    padding: "5px",
    opacity: 0,
    transform: "translate(0px, 0px)",
    transitionProperty: "opacity",
    transitionDuration: ".2s",
    transitionTimingFunction: "linear",
    pointerEvent: "none",
    boxShadow: "0 0 0 1px black, 0 0 10px black",
    borderRadius: "5px",
    zIndex: "9999",
  }),
})
me.HTMLElement = elem;
me.hidden = true;

function getTooltipData(node) {
  if (!node) { return null }
  if (node.dataset && node.dataset.tooltip) {
    return node.dataset.tooltip;
  }
  return getTooltipData(node.parentNode);
}

let previousDescription;
let height;
let timeout;

me.hide = () => {
  elem.style.opacity = 0;
  me.hidden = true;
}


me.show = () => {
  let x = (dom.mouse.x + 25);
  let y = (dom.mouse.y + 10);

  if (x + 300 > dom.dom.w) {
    x -= 375;
  }
  if (y + height > dom.dom.h) {
    y -= height + 10;
  }
  elem.style.transform = "translate("+ x +"px, "+ y +"px)";
  elem.style.opacity = 1;
  me.hidden = false;
}

let prevContent;
on.hover(state => {
  const hover = state.mouse.hover;

  if (hover === elem) { return }

  const content = getTooltipData(hover);

  if (content === prevContent) { return }
  if (content) {
    setTimeout(() => elem.innerHTML = content, 200);
  } else {
    clearTimeout(timeout);
  }
  prevContent = content;
});

function delayShow() {
  if (prevContent) {
    clearTimeout(timeout);
    timeout = setTimeout(me.show, 1800);
    height = elem.clientHeight;
  }
  me.hide();
}

on.keyDown(delayShow);
on.mouseMove(delayShow);

export default me;
