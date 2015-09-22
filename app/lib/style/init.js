const style = document.createElement('style');

style.type = 'text/css';

style.innerHTML = '.hide { display: none!important }'
  +'.invalid { color: red!important }'
  +'input[type="number"]::-webkit-outer-spin-button,'
  +'input[type="number"]::-webkit-inner-spin-button'
  +'{ -webkit-appearance: none; margin: 0 }'
  +'input[type="number"] { -moz-appearance: textfield }'
  +'html {background:#202020; font-family:monospace; color:white; height:100%}';

document.getElementsByTagName('head')[0].appendChild(style);

export default () => {}
