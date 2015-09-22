import _clone from "_/lang/cloneDeep";
import _keys from "_/object/keys";
import Input from "ui/Input";
import Esc from "$/escape";
import type from "$/type";

export default constructor => {
  const self = {
    load: data => {
      self.data = data;
      self.originalData = _clone(data);
      self.keys = _keys(data).sort();
      return self;
    },
    input: {},
    tooltips: {},
    inputArray: [],
    toSql: {
      update: (table = self.table, primaryKey = self.primaryKey) =>
        "UPDATE\n  "+ table +"\nSET\n"
        + self.keys.filter(key => self.data[key] !== self.originalData[key])
          .map((key, i) => "  "+ key +" = "+ Esc.sql(self.data[key]))
          .join(",\n")
        +"\nWHERE\n  "+ primaryKey +" = '"+ self.data[primaryKey] +"';",

      insert: (table = self.table, primaryKey = self.primaryKey) =>
        self.toSql.insertHeader(table, primaryKey) + self.toSql.values() + ";",

      values: () => self.keys.map(key => self.data[key]).join(", "),

      insertHeader: (table = self.table, primaryKey = self.primaryKey) =>
        "DELETE FROM\n  "+ table 
        +"\nWHERE\n  "+ primaryKey +" = '"+ self.data[primaryKey] +"';"
        +"INSERT INTO\n  "+ table +"\n  ("
        + self.keys.map(Esc.sqlKey).join(", ")
        +")\nVALUES\n  ",
    }
  };

  const input = Input(self.load({}));

  return constructor.call(self, self, input, type);
};
