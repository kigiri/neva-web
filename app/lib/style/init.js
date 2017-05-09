import add from "./add";

add('.hide { display: none!important }')
('.invalid { color: red!important }')
('html {background:#202020; font-family:monospace; color:white; height:100%}')
('input[type="number"] { -moz-appearance: textfield }')
('input[type="number"]::-webkit-outer-spin-button,',
 'input[type="number"]::-webkit-inner-spin-button ',
 '{ -webkit-appearance: none; margin: 0 }');


export default add;

// function setStyle(cssRules, aSelector, aStyle){
//     for(var i = 0; i < cssRules.length; i++) {
//         if(cssRules[i].selectorText && cssRules[i].selectorText.toLowerCase() == aSelector.toLowerCase()) {
//             cssRules[i].style.cssText = aStyle;
//             return true;
//         }
//     }
//     return false;
// }

// function createCSSSelector(selector, style) {
//   var doc = document;
//   var allSS = doc.styleSheets;
//   if(!allSS) return;

//   var headElts = doc.getElementsByTagName("head");
//   if(!headElts.length) return;

//   var styleSheet, media, iSS = allSS.length; // scope is global in a function
//   /* 1. search for media == "screen" */
//   while(iSS){ --iSS;
//       if(allSS[iSS].disabled) continue; /* dont take into account the disabled stylesheets */
//       media = allSS[iSS].media;
//       if(typeof media == "object")
//           media = media.mediaText;
//       if(media == "" || media=='all' || media.indexOf("screen") != -1){
//           styleSheet = allSS[iSS];
//           iSS = -1;   // indication that media=="screen" was found (if not, then iSS==0)
//           break;
//       }
//   }

//   /* 2. if not found, create one */
//   if(iSS != -1) {
//       var styleSheetElement = doc.createElement("style");
//       styleSheetElement.type = "text/css";
//       headElts[0].appendChild(styleSheetElement);
//       styleSheet = doc.styleSheets[allSS.length]; /* take the new stylesheet to add the selector and the style */
//   }

//   /* 3. add the selector and style */
//   switch (typeof styleSheet.media) {
//   case "string":
//       if(!setStyle(styleSheet.rules, selector, style));
//           styleSheet.addRule(selector, style);
//       break;
//   case "object":
//       if(!setStyle(styleSheet.cssRules, selector, style));
//           styleSheet.insertRule(selector + "{" + style + "}", styleSheet.cssRules.length);
//       break;
//   }
// }
