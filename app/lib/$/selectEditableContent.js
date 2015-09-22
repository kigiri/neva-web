export default el => {
  const range = document.createRange();
  const sel = window.getSelection();

  range.selectNodeContents(el);
  sel.removeAllRanges();
  sel.addRange(range);
}
