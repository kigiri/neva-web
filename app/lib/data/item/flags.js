import buildBitmask from "data/buildBitmask";

const base = [
  "Unknown 1",
  "Conjured item",
  "Openable (can be opened by right-click)",
  "Makes green \"Heroic\" text appear on item",
  "Deprecated Item",
  "Item can not be destroyed, except by using spell (item can be reagent for spell)",
  "Unknown 2",
  "No default 30 seconds cooldown when equipped",
  "Unknown 3",
  "Wrapper : Item can wrap other items",
  "Unknown 4",
  "Item is party loot and can be looted by all",
  "Item is refundable",
  "Charter (Arena or Guild)",
  "Unknown 5 (Only readable items have this, but not all)",
  "Unknown 6",
  "Unknown 7",
  "Unknown 8",
  "Item can be prospected",
  "Unique equipped (player can only have one equipped at the same time)",
  "Unknown 9",
  "Item can be used during arena match",
  "Throwable (for tooltip ingame)",
  "Item can be used in shapeshift forms",
  "Unknown 10",
  "Profession recipes: can only be looted if you meet requirements and don't already know it",
  "Item cannot be used in arena",
  "Bind to Account (Also needs Quality = 7 set)",
  "Spell is cast with triggered flag",
  "Millable",
  "Unknown 11",
  "Bind on Pickup tradeable",
].reduce(buildBitmask, { bitmask: {} });

const extra = [
  "Horde Only",
  "Alliance Only",
  "When item uses ExtendedCost in npc_vendor, gold is also required",
  "Makes need roll for this item disabled",
  "NEED_ROLL_DISABLED",
  "HAS_NORMAL_PRICE",
  "BNET_ACCOUNT_BOUND",
  "CANNOT_BE_TRANSMOG",
  "CANNOT_TRANSMOG",
  "CAN_TRANSMOG",
].reduce(buildBitmask, { bitmask: {} });

const custom = [
  "Item duration will tick even if player is offline",
  "No quest status will be checked when this item drops",
  "Item will always follow group/master/need before greed looting rules",
].reduce(buildBitmask, { bitmask: {} });

export default {base, extra, custom};
