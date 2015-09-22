export default {
  Entry: "The ID of the loot definition (loot template). The rows with the same ID defines a single loot.",
  Item: "Template ID of the item which can be included into the loot.",
  Reference: "Template reference asks core to process another loot template and to include all items dropped for that template into current loot. Simple idea.",
  Chance: "Item drop chance (plain entry or quest entry). Not sure how this functions for loot reference items.",
  QuestRequired: " Informs the core that the item should be shown only to characters having appropriate quest. This means that even if item is dropped, in order to see it in the loot the player must have at least one quest that has the item ID in its RequiredItemId fields or in its RequiredSourceItemId fields. The player must also have less copies of the item than RequiredItemCount or RequiredSourceItemCount.",
  LootMode: "A special parameter used for separating conditional loot, such as Hard Mode loot. A lootmode of 0 will effectively disable a loot entry (it's roll will always fail). This column is a bitmask, so you shouldn't duplicate loot across lootmodes. The active lootmode(s) can be changed at any time by the core. This column should only be used if required, in most cases it should be left as 1. Valid lootmodes include: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 16384, 32768.",
  GroupId: "A group is a set of loot definitions processed in such a way that at any given looting event the loot generated can receive only 1 (or none) item from the items declared in the loot definitions of the group. Groups are formed by loot definitions having the same values of entry and GroupId fields.",
  MinCount: "The minimum number of copies of the item that can drop in a single loot",
  MaxCount: "For non-reference entries - the maximum number of copies of the item that can drop in a single loot.",
};
