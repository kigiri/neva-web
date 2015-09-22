/* extracted from http://collab.kpsn.org/display/tc/item_template with

var fields = $("#content")[0].getElementsByTagName("h3");
var result = {};
var f, d, i = -1;

function getText(n) {
  var result = '';
  
  if (n.nodeType == 3) {
    result = n.nodeValue;
  } else {
    for (var i = 0; i < n.childNodes.length; i++) {
      result += getText(n.childNodes[i]);
    }
    var d = getComputedStyle(n).getPropertyValue('display');
    if (d.match(/(^block|list|row)/) || n.tagName === 'HR') {
      result += "<BR />";
    }
  }
    
  return result;
};

while (++i < fields.length) {
  f = fields[i];
  d = f.nextElementSibling;
  console.log(d.tagName, d.innerHTML);
  result[f.textContent] = d.tagName === "P"
    ? getText(d).replace(/<BR \/>$/i, "") : "";
}
copy(result); // now the json is in your paperclip

*/

const doc = {
  AllowableClass: "Bitmask controlling which classes can use this item. Add ids together to combine class possibilities. Use -1 if all classes can use it. ",
  AllowableRace: "Bitmask controlling which races can use this item. Add ids together to combine race possibilities. Use -1 for all races.",
  area: "The ID of the zone in which this item can be used.",
  armor: "The armor value of the item.",
  BagFamily: "If the item is a bag, this field is a bitmask controlling what types of items can be put in this bag. You can combine different types by adding up the bit numbers.",
  block: "If the item is a shield, the block chance of the shield.",
  bonding: "The bonding for the item.",
  BuyCount: "The size of the item stack when sold by vendors. Also if a vendor has limited copies of this item available, everytime the vendor list is refreshed (See npc_vendor.incrtime), the number of copies increases by this number.",
  BuyPrice: "The price required to pay to buy this item from a vendor, in copper.",
  ContainerSlots: "If the item is a bag, this field controls the number of slots the bag has.",
  delay: "The time in milliseconds between successive hits.",
  description: "The description that appears in orange letters at the bottom of the item tooltip.",
  dmg_max1: "The maximum damage of the item.",
  dmg_min1: "The minimum damage of the item.",
  duration: "The duration of the item in seconds ingame time.<br>Set ITEM_FLAGS_CU_DURATION_REAL_TIME in <b>flagsCustom</b> for real time. In that case the item duration will tick even if player is offline.",
  Flags: "Bitmask field that contains flags that the item has on it. As all other such fields, just add the flags together to combine them. Possible flags are listed below.",
  HolidayId: "See the Holidays DBC file for the IDs of all of the holidays.",
  Map: "The ID of the map in which this item can be used.",
  maxcount: "Maximum number of copies of this item a player can have. Use 0 for infinite.",
  MaxDurability: "The maximum durability of this item.",
  maxMoneyLoot: "If the item is a container that can contain money, then this field defines the maximum coinage held in this container, in copper.",
  minMoneyLoot: "If the item is a container that can contain money, then this field defines the minimum coinage held in this container, in copper.",
  name: "The name of the item.",
  Quality: "The quality of the item. To use the Bind to Account quality, the item must have its flags set to 134221824.",
  RandomProperty: "The number in this field points to item_enchantment_template.entry and ties in an item's chance at having a random property attached to it when it shows up for the first time. This field and the RandomSuffix field CANNOT both have non-zero values. Either one is filled, or the other. Also, the primary source for the number in this field are WDBs.",
  RequiredLevel: "The level that a player must be to equip the item.",
  RequiredReputationFaction: "The faction template ID&nbsp; of the faction that the player has to have a certain ranking with. If this value is 0, the faction of the seller of the item is used.",
  RequiredReputationRank: "The rank the player has to have with the faction from RequiredReputationFaction.",
  RequiredSkill: "The skill required to use this item. See the SkillLine DBC file for IDs which can be used here.",
  RequiredSkillRank: "The required skill rank the player needs to have to use this item.",
  requiredspell: "The required spell that the player needs to have to use this item.",
  ScriptName: "The name of the script that the item should use. There is no 'internalitemhandler' or 'internalitemhanler' script so trinity will ignore any such values in this field.",
  SellPrice: "The price that the vendor will pay you for the item when you sell it and if it is possible to be sold, in copper. Put in 0 if the item cannot be sold to a vendor.",
  stackable: "The number of copies of this item that can be stacked in the same slot.",
};

for (let i = 1; i <= 10; i++) {
  doc["stat_type"+ i] = "The type of stat to modify.";
  doc["stat_value"+ i] = "The value to change the stat type to.";
}

doc.FlagsExtra = doc.Flags;
doc.flagsCustom = doc.Flags;

export default doc;
