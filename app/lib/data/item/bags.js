import buildBitmask from "data/buildBitmask";

const bags = [
  "None",
  "Arrows",
  "Bullets",
  "Soul Shards",
  "Leatherworking Supplies",
  "Inscription Supplies",
  "Herbs",
  "Enchanting Supplies",
  "Engineering Supplies",
  "Keys",
  "Gems",
  "Mining Supplies",
  "Soulbound Equipment",
  "Vanity Pets",
  "Currency Tokens",
  "Quest Items",
].reduce(buildBitmask, { bitmask: {} });

export default bags;