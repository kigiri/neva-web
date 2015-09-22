var window = self;
console.log(self);

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
  if (dataStore[key]) {
    dataStore[key].values.push(newSqlData(dataStore[key].keys, data));
  } else {
    const req = indexedDB.open(key);
    // req.onupradeneeded = () => {}
    req.onsuccess = event => {
      db = event.target.result;
    }
    dataStore[key] = {
      keys: data,
      values: [],
    }
  }
}

const matchNewLines = /,[\r\n]+/;
const matchArrays = /(\[[^\[\]]+\])/;
function _store(name, data) {
  const matches = data.split(matchNewLines);
  let i = -1;

  while (++i < matches.length) {
    let yo = matches[i].split(matchArrays)[1];
    if (yo) {
      saveData(name, JSON.parse(yo));
    }
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
    const vals = dataStore.items.values;
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
      if (!dataStore.items.isComplete) {
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

sup({
  ask: (table, q) => query[table](q),
}).then(m => {
  Main = m;
  function loadContent(name, length) {
    const download = "Downloading "+ name +" data";
    const saveToStore = _store.bind(null, name);
    Main.progress(download, 0);
    const start = performance.now();
    let n = start;

    return fetch("//neva.cdenis.net/"+ name +".json").then(({body})=> {
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
              Main.progress(download, total / length);
              n = performance.now();
            }
            partial = saveToStore(partial);
            return parse();
          }
          reader.cancel();
          dataStore[name].isComplete = true;
          Main.progress(download, 1);
        })
      })();
    }).catch(console.error.bind(console));
  }
  loadContent("items", 6781317);
  loadContent("items_loot", 150903);
});



