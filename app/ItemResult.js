// [icon][name][lvl][class][subclass][itemslot]
import { search as style } from "style/inputs";
import classes from "data/item/classes";
import slots from "data/item/slots";
import ui from "ui/new";

function getIconLink(iconName) {
  return iconName
    ? "url('//cdn.openwow.com/wotlk/icons/small/"+ iconName +".jpg') no-repeat 50%"
    : "";
}

const rowKeys = [
  "lvl",
  "icon",
  "entry",
  "name",
  "class",
  "subclass",
  "slot",
];

const rowWidth = {
  icon:     "16px",
  entry:    "48px",
  lvl:      "26px",
  class:    "10%",
  subclass: "10%",
  slot:     "10%",
};

function getSlot(slot) {
  const val = slots[slot];
  return val === "Non equipable" ? "" : val;
}

function getLevel(lvl) {
  return (lvl || "").toString()
}

function getValues(item) {
  const itemClass = classes[item.class];
  return {
    name: item.name,
    entry: item.entry,
    class: itemClass.name,
    subclass: itemClass.sub[item.subclass],
    lvl: getLevel(item.RequiredLevel),
    slot: getSlot(item.InventoryType),
  }
}

function generateRow(target, attrs, values) {
  return rowKeys.map(key => {
    const a = attrs[key] || {};
    a.style = style.subResult(a.style);
    a.style.width = rowWidth[key] || "";
    return target[key] = ui.td(a, values[key] || "");
  })
}

function createElem(item) {
  const me = { item };

  me.elems = generateRow(me, {
    icon: {
      style: { background: getIconLink(item.icon) },
    },
    lvl: {
      style: {
        color: "hsl("+ (160 - item.RequiredLevel * 2) +", 35%, 60%)",
      }
    },
    name: {
      style: { textAlign: "left" },
      className: "quality"+ item.Quality,
    },
  }, getValues(item));

  me.set = data => {
    if (me.item.entry === data.entry) { return }
    me.item = data;
    me.icon.style.background = getIconLink(data.icon);
    me.name.className = "quality"+ data.Quality;
    me.lvl.style.color = "hsl("+ (160 - data.RequiredLevel * 2) +", 35%, 60%)";

    const values = getValues(data);
    rowKeys.forEach(key => me[key].textContent = values[key] || "")
  }

  return me;
}

function header() {
  return ui.tr({}, rowKeys.map(key => ui.th({
    style: {
      width: rowWidth[key],
    }
  })));
}

const ItemResult = (result) => {
  if (result.type !== "item") {
    result.type = "item";
    if (result.content) {
      result.content.elems.forEach(el => el.remove());
    }
    result.content = createElem(result.data);
    result.content.elems.forEach(el => result.HTMLElement.appendChild(el));
  } else {
    result.content.set(result.data);
  }
};

ItemResult.header = header

export default ItemResult;
