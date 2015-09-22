import ui from "ui/new";
import number from "ui/input/number";
import { number as style } from "style/inputs";

const COPPER = 1;
const SILVER = COPPER * 100;
const GOLD = SILVER * 100;

const toAttrs = style => ({style});

function MoneyUnit(key, unitStyle) {
  const value = ui.b(toAttrs(style.value), "0");
  const self = ui.span(toAttrs(unitStyle), value, key);

  self.setValue = n => {
    value.textContent = n;
    if (key !== "c") {
      self.style.display = (n === 0) ? "none" : "";
    }
    return self;
  }
  return self;
}

export default (form, key) => {
  const c = MoneyUnit("c", style.copper);
  const s = MoneyUnit("s", style.silver);
  const g = MoneyUnit("g", style.golds);
  const display = ui.div(toAttrs(style.labelRight), g, s, c);

  const applyValue = () => {
    const value = form.data[key];
    c.setValue(value % SILVER);
    s.setValue(Math.floor((value % GOLD) / SILVER));
    g.setValue(Math.floor(value / GOLD));
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

