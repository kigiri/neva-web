const window = self.window = self;

import is from "$/is";
import sup from "$/sup";

function convertArray(keys, item) {
  let i = -1;
  let ret = {};
  while (++i < keys.length) {
    ret[keys[i]] = item[i];
  }
  return ret;
}

// should already have all the keys
const dataStore = {};

function newSqlData(keys, values) {
  let i = -1;
  let ret = {};
  while (++i < keys.length) {
    ret[keys[i]] = values[i];
  }
  return ret;
}

function saveData(key, data) {
  if (dataStore[key].isComplete !== void 0) {
    dataStore[key].values.push(newSqlData(dataStore[key].keys, data));
  } else {
    dataStore[key].isComplete = false;
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
    if (matches.length > 9) {
      minScore = matches[9];
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


let Main;
let previousQuery;
const query = {
  items: (q) => {
    q = q.trim().toLowerCase();
    if (previousQuery === q) { return }
    previousQuery = q;
    const vals = dataStore.item_template.values;
    let i = -1, score, match = MatchList(q, "name", Main.result);
    Main.clearResults();
    (function recur() {
      if (previousQuery !== q) { return }
      const n = performance.now();
      while (++i < vals.length) {
        if (performance.now() - n > 16) {
          return setTimeout(recur);
        }
        match(vals[i]);
      }
      if (!dataStore.item_template.isComplete) {
        return setTimeout(recur, 16);
      }
      if (match.name === "Me") {
        match = match.deep;
        i = -1;
        return setTimeout(recur);
      }
    })();
  }
}

fetch("//neva.cdenis.net/json/tables.min.json")
.then(res => res.json())
.then(data => Object.keys(data.tables).reduce((result, key) => {
  result[key] = {
    keys: data.tables[key],
    values: [],
    size: data.sizes[key],
  };
  return result;
}, dataStore)).then(dataStore => {
  console.log("what??", dataStore)
sup({
  ask: (table, q) => query[table](q),
}).then(m => {
  console.log("m", m);
  function loadContent(name, length) {
    const download = "Downloading "+ name +" data";
    const saveToStore = _store.bind(null, name);
    m.progress(download, 0);
    const start = performance.now();
    let n = start;

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
            if (performance.now() - n > 64) {
              m.progress(download, total / length);
              n = performance.now();
            }
            partial = saveToStore(partial);
            return parse();
          }
          reader.cancel();
          dataStore[name].isComplete = true;
          m.progress(download, 1);
        })
      })();
    }).catch(console.error.bind(console));
  }

  Object.keys(dataStore).forEach(key => {
    console.log(key, dataStore[key].size);
    loadContent(key, dataStore[key].size);
  })

  Main = m;
})
} );



