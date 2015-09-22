export default handler => event => {
  if (handler[event.keyCode]) {
    if (handler[event.keyCode](event) !== false) {
      event.preventDefault();
    }
  }
};
