export default el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}
