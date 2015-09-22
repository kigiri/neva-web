import ui from "ui/new";
import number from "ui/input/number";
import { number as style } from "style/inputs";

const MIN = 60;
const HOUR = 3600;

const toAttrs = style => ({style});

function TimeUnit(key, unitStyle) {
  const value = ui.b(toAttrs(style.value), "0");
  const self = ui.span(toAttrs(unitStyle), value, key);

  self.setValue = n => {
    value.textContent = n;
    if (key !== "s") {
      self.style.display = (n === 0) ? "none" : "";
    }
    return self;
  }
  return self;
}

export default (form, key) => {
  const s = TimeUnit("s", style.second);
  const m = TimeUnit("m", style.minute);
  const h = TimeUnit("h", style.hour);
  const display = ui.div(toAttrs(style.labelRight), h, m, s);
  const applyValue = () => {
  const value = form.data[key];
    s.setValue(value % MIN);
    m.setValue(Math.floor((value % HOUR) / MIN));
    h.setValue(Math.floor(value / HOUR));
  };
  const input = number(form, key).add(applyValue);
  const elem = ui.div({
    onclick: input.select,
    dataset: { tooltip: form.tooltips[key] },
  }, input, display);
  input.HTMLElement = elem;
  applyValue();

  return input;
}
