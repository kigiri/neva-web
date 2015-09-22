import buildBitmask from "data/buildBitmask";

const classes = [
  "Warrior",
  "Paladin",
  "Hunter",
  "Rogue",
  "Priest",
  "Death Knight",
  "Shaman",
  "Mage",
  "Warlock",
  "Monk",
  "Druid",
].reduce(buildBitmask, { bitmask: {} });

export default classes;