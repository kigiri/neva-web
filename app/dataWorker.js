const window = self.window = self;
const MAX_RESULTS = 50 - 1;
const dataStore = {};

import is from "$/is";
import sup from "$/sup";
import initDb from "./db";

let Main;
let previousQuery;
let db;

function convertArray(keys, item) {
  let i = -1;
  let ret = {};
  while (++i < keys.length) {
    ret[keys[i]] = item[i];
  }
  return ret;
}

// should already have all the keys
function newSqlData(keys, values) {
  let i = -1;
  let ret = {};
  while (++i < keys.length) {
    ret[keys[i]] = values[i];
  }
  return ret;
}

function saveData(key, data) {
  if (db.stores[key].isComplete !== void 0) {
    db.queue(() => db.stores[key].add(newSqlData(dataStore[key].keys, data)));
  } else {
    dataStore[key].keys = data;
    db.stores[key].isComplete = false;
  }
}

const matchNewLines = /,[\r\n]+/;

function getArrayFromMatch(match) {
  let start = 3;
  let end = match.length - 4;

  while (--start > -1) {
    if (match[start] === "[") { break }
  }
  while (++end < match.length) {
    if (match[end] === "]") {
      return match.slice(start, end + 1);
    }
  }
}

function parseData(name, data) {
  if (!data) { return }
  saveData(name, JSON.parse(data));
}

function _store(name, data) {
  const matches = data.split(matchNewLines);
  let i = -1;

  while (++i < matches.length) {
    parseData(name, getArrayFromMatch(matches[i]));
  }
  return matches[matches.length - 1];
}

function sortMatches(a, b) {
  return b - a;
}

function MatchList(q, key, fn) {
  const matches = [];
  let minScore = 0;
  const firstMatches = new WeakMap();

  function handleMatch(score, data) {
    if (score < minScore || firstMatches.get(data) === score) { return }
    fn(score, data);
    firstMatches.set(data, score);
    matches.push(score)
    matches.sort(sortMatches);
    if (matches.length > MAX_RESULTS) {
      minScore = matches[MAX_RESULTS];
    }
  }

  function Me(data) {
    const str = data[key].toLowerCase();
    let i = -1, j = 0, score = 0, bonus = 8;

    while (++i < str.length) {
      if (str[i] === q[j]) {
        if (++j >= q.length) {
          if (j === i) {
            score += 50; // bonus for perfect
          }
          return handleMatch(score + (i >= str.length - 1), data);
        }
        score += 1 + bonus;
        bonus += 5;
      } else {
        bonus = /[a-z0-9]/.test(str[i]) ? 0 : 3;
      }
    }
  }

  function recur(str, i, j, score, bonus, step) {
    if (j >= q.length) {
      if (j === i) {
        score += 50; // bonus for perfect
      }
      return score + (i >= str.length);
    }
    if (i >= str.length) { return Math.round(score / 3) }
    const c = str[i].toLowerCase();
    if (c === q[j]) {
      if (step > 0) {
        return Math.max(recur(str, i+1, j, score, 0, step - 1),
          recur(str, i+1, j+1, score + 1 + bonus + (c !== str[i]) * 2,
            bonus + 5, step));
      }
      return recur(str, i+1, j+1, score + 1 + bonus, bonus + 5, step);
    }
    return recur(str, i+1, j, score, /[a-z0-9]/.test(c) ? 0 : 3, step);
  }

  Me.deep = (data) => {
    if (!firstMatches.has(data)) { return }
    handleMatch(recur(data[key], 0, 0, 0, 8, 6), data);
  }
  return Me;
}

const searchInName = (cursor, match) => {
  if (previousQuery !== q) { return console.log("query changed") }
  console.log(cursor)
  match(cursor.values.name);
  cursor.continue();
}

const query = {
  items: q => {
    q = q.trim().toLowerCase();
    if (previousQuery === q) { return }
    let match = MatchList(previousQuery = q, "name", Main.result);
    Main.clearResults();
    console.log(q, db.store.item_template);
    db.store.item_template.each(cursor => searchInName(cursor, match)).then(() =>
      db.store.item_template.each(cursor => searchInName(cursor, match.deep)));
  }
}

fetch("//neva.cdenis.net/json/tables.min.json")
.then(res => res.json())
.then(data => Object.keys(data.tables).reduce((result, key) => {
  result[key] = {
    name: key,
    keyPath: data.keyPath[key],
    keys: data.tables[key],
    size: data.sizes[key],
  };
  return result;
}, dataStore))
.then(dataStore => initDb(dataStore))
.then(dbInstance => db = dbInstance)
.then(db => {
  // load icons if not available
  db.stores.icon.count()
  .then(count => {
    console.log(count)
    if (count === 4909) { return } // the icon count should never change
    fetch("//neva.cdenis.net/json/icons.json")
    .then(res => res.json())
    .then(icons => {
      // http://cdn.openwow.com/wotlk/icons/[small | medium | large]/[icon].jpg
      Object.keys(icons).forEach(key =>
        db.stores.icon.add({ name: key, entries: icons[key] }))
    })
  });

  // load content
  sup({
    ask: (table, q) => query[table](q),
  }).then(m => {
    console.log("m", m);
    function loadContent(name, length) {
      const download = "Downloading "+ name +" data";
      const saveToStore = _store.bind(null, name);
      m.progress(download, 0);
      let time = performance.now();

      return fetch("//neva.cdenis.net/json/"+ name +".json").then(({body})=> {
        const reader = body.getReader();
        const decoder = new TextDecoder();
        let n = true;
        let partial = '';
        let total = 0;

        return (function parse() {
          return reader.read().then(({value, done}) => {
            if (value) {
              partial += decoder.decode(value, {stream: !done});
              total += value.byteLength;
            } else {
              partial += decoder.decode(new Uint8Array, {stream: !done});
            }

            if (!done) {
              if (performance.now() - time > 64) {
                m.progress(download, total / length);
                time = performance.now();
              }
              partial = saveToStore(partial);
              return parse();
            }
            reader.cancel();
            db.stores[name].isComplete = true;
            m.progress(download, 1);
          })
        })();
      }).catch(console.error.bind(console));
    }

    Object.keys(dataStore)
    .filter(key => key !== "item_template")
    .sort((a, b) => dataStore[a].size - dataStore[b].size)
    .forEach(key => loadContent(key, dataStore[key].size))

    Main = m;
  })
});
