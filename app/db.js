let chain;

function queue(fn) {
  if (chain && chain["[[PromiseStatus]]"] !== "pending") {
    chain = null;
  }
  if (chain) {
    chain.then(fn);
  } else {
    chain = fn();
  }
}

const me = {
  stores: {},
  loaded: false,
  queue: fn => {
    if (chain && chain["[[PromiseStatus]]"] !== "pending") {
      chain = null;
    }
    if (chain) {
      chain.then(fn);
    } else {
      chain = fn();
    }
  },
  clear() { indexedDB.deleteDatabase("db") },
};

function getDb(name, readonly) {
  const transaction = me.db.transaction(name, readonly ? "readonly" : "readwrite");
  const store = transaction.objectStore(name);
  return { transaction, store };
}

function getTransaction(name, reject, readonly, resolve) {
  const db = getDb(name, readonly);
  db.transaction.oncomplete = resolve;
  db.transaction.onabord = resolve;
  db.transaction.onerror = reject;
  return db;
}

const handleSimple = (name, action, data) => new Promise((resolve, reject) =>
  getTransaction(name, reject, false, resolve).store[action](data));

const delData = (name, data) => handleSimple(name, "delete", data);
const addData = (name, data) => handleSimple(name, "add", data);

const putData = (name, data) => new Promise((resolve, reject) => {
  const req = getTransaction(name, reject).store.put(data);

  req.onsuccess = resolve;
  req.onerror = reject;
})

const getData = (name, keyPath) => new Promise((resolve, reject) => {
  const req = getTransaction(name, reject).store.get(keyPath);

  req.onsuccess = () => resolve(req.result);
  req.onerror = reject;
})

const eachData = (name, fn) => new Promise((resolve, reject) => {
  const req = getTransaction(name, reject, true).store.openCursor();

  req.onsuccess = ({target}) => target.result ? fn(target.result) : resolve();
  req.onerror = reject;
})

const countData = name => new Promise((resolve, reject) => {
  const req = getTransaction(name, reject, true).store.count();

  req.onsuccess = event => resolve(event.target.result);
  req.onerror = reject;
})

function initStore(name) {
  me.stores[name] = {
    del: data => queue(() => delData(name, data)),
    add: data => queue(() => addData(name, data)),
    put: data => queue(() => putData(name, data)),
    get: data => queue(() => getData(name, data)),
    each: fn => eachData(name, fn),
    count: () => countData(name),
  };
}

function Store(name, keyPath, indexes) {
  const store = me.db.createObjectStore(name, { keyPath });

  indexes.sort().forEach(index => store.createIndex(index, index));

  initStore(name);
}

export default tables => new Promise((resolve, reject) => {
  if (me.db) { return resolve(me) }
  const req = indexedDB.open('db', 1);
  req.onupgradeneeded = function (e) {
    me.db = e.target.result;
    console.log("db:onupgradeneeded")
    Store("icon", "name", ["name", "entries"]);
    Object.keys(tables).forEach(key => {
      const table = tables[key];
      Store(table.name, table.keyPath, table.keys);
    });
  };

  req.onsuccess = function (e) {
    console.log("db:success")
    me.db = e.target.result;
    const names = me.db.objectStoreNames;
    let i = -1;
    while (++i < names.length) {
      initStore(names[i]);
    }
    resolve(me);
    console.log(me);
  };
});

/*

iterate on results :

const store = db.transaction('db').objectStore('icon');
store.openCursor().onsuccess = event => {
  const cursor = event.target.result;
  if (!cursor) { return }
  const icon = cursor.value;
  cursor.continue();
}

*/
