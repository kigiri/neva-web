import ui from "ui/new";
import Form from "ui/Form";

import doc from "data/doc/lootTemplate";

Entry mediumint unsigned PRI 0
Item mediumint unsigned PRI 0
Reference mediumint unsigned 0  
Chance float 100 
QuestRequired bool 0  
LootMode smallint 1
GroupId tinyint 0
MinCount mediumint 1
MaxCount tinyint unsigned 1
Comment varchar

export default key => Form((self, input, type) => {
  self.description = doc;
  self.table = key +"_loot_template";
  self.primaryKey = "entry";

  const elem = ui.div({});

  self.HTMLElement = elem;

  return self;
});

