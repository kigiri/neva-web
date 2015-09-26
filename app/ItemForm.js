import ui from "ui/new";
import Form from "ui/Form";
import _keys from "_/object/keys";
import _fill from "_/array/fill";
import DOMLoader from "$/DOMLoader";
import { on } from "event";
import images from "./images";

import type from "$/type";

import limitCategories from "data/item/limitCategories";
import { skills } from "data/item/skills";
import qualities from "data/item/qualities";
import bondings from "data/item/bondings";
import spells from "data/item/spellSkills";
import stats from "data/item/stats";
import flags from "data/item/flags";
import bags from "data/item/bags";
import mods from "data/item/mods";

import classes from "data/player/classes";
import races from "data/player/races";

import { factions, ranks } from "data/world/reputations";
import holidays from "data/world/holidays";
import maps from "data/world/maps";

import doc from "data/doc/itemTemplate";

import { itemForm as style } from "style/inputs";

function isWeapon(item) { return item.class === 2 }
function isArmor(item) { return item.class === 4 }
function isContainer(item) { return item.class === 1 }
function isOpennable(item) { return item.Flags & 0x04 }
function isShield(item) { return isArmor(item) && item.subclass === 6 }
function hasArmor(item) { return !!mods.slot[item.InventoryType].armor }

/* 
  show infos :
  InventoryType: slot info, data: inventoryType
  class: itemClass and subclass, data: itemClasses[item.class].sub[item.subclass]
  entry
*/

function deleteKeys(keys, obj) {
  keys.forEach(key => delete obj[key])
  return obj;
}

function makeStatInput(i, input, item) {
  const index = i + 1;
  const isInRange = data => data.StatsCount + 1 >= index;
  const typeKey = "stat_type"+ index;
  const valueKey = "stat_value"+ index;

  function setStatData(tKey, vKey, data) {
    setTimeout(() => {
      item[tKey] = data.type;
      item[vKey] = data.value;
    });
  }

  function applyChanges() {
    if (item[typeKey] != 0) {
      if (item[valueKey] != 0) {
        item.StatsCount = Math.max(index, item.StatsCount);
      }
      return;
    } else if (item[valueKey] != 0) { return }

    const defaultReturn = {
      type: "0",
      value: 0,
      count: 0
    };

    const data = (function recur(i) {
      if (i > 10) { return defaultReturn }

      const tKey = "stat_type"+ i;
      const vKey = "stat_value"+ i;
      const type = item[tKey];
      const value = item[vKey];

      if (value == 0 && type == 0) { return defaultReturn }

      const next = recur(i + 1);

      setStatData(tKey, vKey, next);

      return { type, value, count: next.count + 1 }
    })(index + 1);

    setStatData(typeKey, valueKey, data);
    item.StatsCount = Math.min(item.StatsCount, index + data.count - 1);
  }

  const typeInput = input.select(typeKey, stats)
    .add(applyChanges)
    .filter(el => {
      if (el.dataset.key != 0) {
        for (let i = 1; i <= 10; i++) {
          if (el.dataset.key === item["stat_type"+ i]) { return true }
        }
      }
      return false;
    })
    .if(isInRange);

  const valueInput = input.number(valueKey)
    .add(applyChanges)
    .test(type.int.small)
    .if(isInRange);

  typeInput.HTMLElement.style.width = "58%";
  typeInput.HTMLElement.style.display = "inline-block";
  valueInput.HTMLElement.style.width = "38%";
  valueInput.HTMLElement.style.verticalAlign = "top";
  return [ typeInput, valueInput ];
}

export default Form((Me, input) => {
  Me.tooltips = doc;
  Me.table = "item_template";
  Me.primaryKey = "entry";

  const restrictions = [
    input.number("RequiredLevel")
      .test(type.int.tiny.unsigned),
    input.number("ItemLevel")
      .test(type.int.tiny.unsigned),
    input.bitmask("AllowableClass", classes.bitmask, 3).set(-1),
    input.bitmask("AllowableRace", races.bitmask, 3).set(-1),
    input.select("ItemLimitCategory", limitCategories),
    input.select("RequiredReputationFaction", factions),
    input.select("RequiredReputationRank", ranks)
      .if(data => data.RequiredReputationFaction != 0),
    input.select("requiredspell", spells),
    input.select("RequiredSkill", skills),
    input.number("RequiredSkillRank")
      .test(type.int.small.unsigned),
    input.number("area")
      .test(type.int.medium.unsigned),
    input.select("Map", deleteKeys(_keys(maps).filter(key => key < 2), maps)),
    input.select("HolidayId", holidays),
    input.seconds("duration")
      .test(type.int.unsigned),
  ];

  const minMoney = input.money("minMoneyLoot")
    .test(type.int.unsigned)
    .if(isOpennable)
    .add(_ => {
      if (minMoney.isActive) {
        Me.data.maxMoneyLoot = Math.floor(Me.data.minMoneyLoot * 1.25);
      }
    });

  const maxMoney = input.money("maxMoneyLoot")
    .test(type.int.unsigned)
    .if(isOpennable)
    .add(_ => {
      if (maxMoney.isActive) {
        Me.data.minMoneyLoot = Math.floor(Me.data.maxMoneyLoot * 0.75);
      }
    });

  const buyPrice = input.money("BuyPrice")
    .test(type.intRange(0, type.int.total * 4))
    .add(_ => {
      if (buyPrice.isActive) {
        Me.data.SellPrice = Math.floor(Me.data.BuyPrice / 4)
      }
    });

  const sellPrice = input.money("SellPrice")
    .test(type.int.unsigned)
    .add(_ => {
      if (sellPrice.isActive) {
        Me.data.BuyPrice = Math.floor(Me.data.SellPrice * 4)
      }
    });

  const qualityInput = input.select("Quality", qualities.map(q => q.name))
    .add(_ => {
      console.log("quality changed");
      setQuality();
    })
    .each((el, i) => {
      const style = el.childNodes[1].style;
      style.color = qualities[i].color.min(50);
      style.textShadow = "1px 1px 0 black";
    });

  const values = [
    qualityInput,
    input.number("delay")
      .test(type.int.small.unsigned)
      .if(isWeapon),
    input.number("dmg_min1")
      .test(type.float)
      .if(isWeapon), // auto
    input.number("dmg_max1")
      .test(type.float)
      .if(isWeapon), // auto
    input.number("armor")
      .test(type.int.small.unsigned)
      .if(data => isArmor(data) && hasArmor(data)), // auto
    input.number("block")
      .test(type.int.medium.unsigned)
      .if(isShield), // auto
    input.number("MaxDurability")
      .test(type.int.small.unsigned)
      .if(data => isWeapon(data) || isArmor(data) && hasArmor(data)), // auto
    minMoney,
    maxMoney,
    _fill(Array(10), null).map((_, i) => makeStatInput(i, input, Me.data)),
  ];

  const nameInput = input.text("name", 255);
  nameInput.HTMLElement.style.paddingLeft = "64px";

  const other = [
    nameInput,
    input.text("description", 255),
    input.bitmask("Flags", flags.base.bitmask, 1),
    input.bitmask("FlagsExtra", flags.extra.bitmask, 2),
    input.bitmask("flagsCustom", flags.custom.bitmask, 1),
    buyPrice,
    sellPrice,
    input.number("BuyCount")
      .test(type.int.tiny.unsigned),
    input.number("maxcount")
      .test(type.int),
    input.number("stackable")
      .test(type.int)
      .if(item => !isArmor(item) && !isWeapon(item)),
    input.number("ContainerSlots")
      .test(type.int.small.unsigned)
      .if(isContainer),
    input.select("bonding", bondings),
    input.bitmask("BagFamily", bags.bitmask),
    input.text("ScriptName", 64),
  ];

  const itemIcon = ui.div({ style: {
    width: "56px",
    height: "56px",
    border: "1px solid white",
    outline: "solid 1px black",
    outlineOffset: "-2px",
    boxShadow: "0 0 0 1px black",
    position: "absolute",
    zIndex: "9",
    left: "2px",
    top: "2px",
  }});
  const boxOther = ui.div({style: style.box, id: "other"}, itemIcon, other);
  const boxRestriction = ui.div({style: style.box, id: "restrictions"}, restrictions);
  const elem = ui.form({
    id: "item-form",
    style: style.form
  }, boxOther, ui.div({style: style.box, id: "stats"}, values), boxRestriction);

  on.resize(state => elem.style.height = (state.dom.h - 60) +"px");

  Me.HTMLElement = elem;

  function setQuality() {
    const color = qualities[Me.data.Quality].color;
    itemIcon.style.borderColor = color.toString();
    qualityInput.setColor(color.max(60));
  }

  Me.load = data => {
    Object.keys(data).forEach(key => Me.data[key] = data[key]);
    const model = images.toCss(images.getModel(data.entry));
    boxRestriction.style.background = (model
      ? gradientPrefix + model +" no-repeat bottom right, "
      : "") + style.box.background;
    itemIcon.style.backgroundImage = "url('"+ images.getIcon(data.entry, "large") +"')";
    setQuality();
  };

  window.__form__ = Me;

  return Me;
});

const gradientPrefix = 'linear-gradient(0, transparent 180px, #4B4B4B 200px,'
  +'#4B4B4B 300px, transparent), ';
