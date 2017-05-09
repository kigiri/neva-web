const HTMLElement = document.createElement('style');

HTMLElement.type = 'text/css';

document.getElementsByTagName('head')[0].appendChild(HTMLElement);

const style = document.styleSheets[0];
const add = (...args) => {
  style.insertRule(args.join(''), 0);
  return add;
}

export default add;
