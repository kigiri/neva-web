export default function Task() {
  const taskArray = [];
  const me = {};
  
  me.del = fn => {
    let i = -1;
    while (++i < taskArray.length) {
      if (taskArray[i] === fn) {
        taskArray.splice(i, 1);
        break;
      }
    }
    return me;
  }

  me.add = fn => {
    if (typeof fn === "function") {
      taskArray.push(fn);
    }
    return me;
  }

  me.exec = event => {
    let i = -1, cleanup = [];

    while (++i < taskArray.length) {
      if (taskArray[i](event) === false) {
        cleanup.push(i);
      }
    }

    if (cleanup.length) {
      i = cleanup.length;
      while (--i >= 0) {
        taskArray.splice(cleanup[i], 1);
      }
    }
    return me;
  }

  me.execCheck = (event, check) => {
    let i = -1, cleanup = [];

    while (++i < taskArray.length && check()) {
      if (taskArray[i](event) === false) {
        cleanup.push(i);
      }
    }

    if (cleanup.length) {
      i = cleanup.length;
      while (--i >= 0) {
        taskArray.splice(cleanup[i], 1);
      }
    }
    return me;
  }

  return me;
}
