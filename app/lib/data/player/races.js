import buildBitmask from "data/buildBitmask";

const races = [
  "Human",
  "Orc",
  "Dwarf",
  "Night Elf",
  "Undead",
  "Tauren",
  "Gnome",
  "Troll",
  "Goblin",
  "Blood Elf",
  "Draenei",
  // "Fel Orc",
  // "Naga",
  // "Broken",
  // "Skeleton",
  // "Vrykul",
  // "Tuskarr",
  // "Forest Troll",
  // "Taunka",
  // "Northrend Skeleton",
  // "Ice Troll",
  // "Worgen",
  // "Unknown",
  // "Pandaren Neutral",
  // "Pandaren Alliance",
  // "Pandaren Horde",
].reduce(buildBitmask, { bitmask: {} });

export default races;