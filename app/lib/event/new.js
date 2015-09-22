import _each from "_/collection/forEach";
import loop from "./loop";
import Task from "$/Task";

export default currentState => {
  const t = Task();
  const instance = {
    add: t.add,
    del: t.del
  };
  let needToUpdate = false;

  if (!currentState || typeof currentState !== "object") {
    currentState = {};
  }

  instance.replace = newState => {
    currentState = newState;
    needToUpdate = true;
  };

  instance.get = () => currentState;

  instance.set = (newState, cb) => {
    if (typeof newState === "function") {
      instance.set(newState(currentState));
    } else {
      _each(newState, (val, key) => {
        if (currentState[key] !== val || typeof val === "object") {
          currentState[key] = val;
          needToUpdate = true;
        }
      });
    }
    if (typeof cb === "function") {
      if (!needToUpdate) {
        cb(currentState);
      } else {
        t.add(_ => { cb(currentState); return false });
      }
    }
  }

  loop.add(_ => {
    if (needToUpdate) {
      needToUpdate = false;
      t.exec(instance.get());
    }
  });

  return instance;
};

