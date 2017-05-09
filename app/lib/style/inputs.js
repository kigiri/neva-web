import addCss from "style/add";
import ui from "./ui";
import box from "./box";
import apply from "./apply";
import colors from "data/color";
import qualities from "data/item/qualities";

function genClass(name, key, val, notImportant) {
  return '.'+ name +' { '+ key +':'+ val + (notImportant ? '' : '!important') +'}';
}

addCss('.hide { display: none!important }')
('.invalid { color: red!important }')
('html {background:#202020; font-family:monospace; color:white; height:100%}')
('input[type="number"] { -moz-appearance: textfield }')
('tr:nth-child(even) { background: rgb(29, 29, 29); border: 0}')
('td:first-child { background: linear-gradient(270deg, transparent, #202020)')
('td:last-child { background: linear-gradient(90deg, transparent, #202020)')
('input[type="number"]::-webkit-outer-spin-button,',
 'input[type="number"]::-webkit-inner-spin-button ',
 '{ -webkit-appearance: none; margin: 0 }');

qualities.forEach((q, i) =>
  addCss(genClass('quality'+ i, 'color', q.color.toString())))

const toAttrs = style => ({style});

const btn = apply(ui({
  cursor: "pointer",
  display: "inline-block",
  overflow: "hidden",
  color: "#888",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

const label = apply(ui({
  padding: "5px",
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  position: "relative",
  boxSizing: "border-box",
  borderBottom: "1px solid #555",
}));

const unit = apply(ui({
  fontWeight: "bold",
  paddingRight: ".3em",
}));

const halfLabel = apply(label({
  display: "inline-block",
  paddingRight: "5em",
  margin: "5px 1%",
  width: "48%",
}));

const outerBar = apply({
  background: "#1a1a1a",
  position: 'relative',
  height: "25px",
  padding: "5px",
  margin: "5px auto",
  borderRadius: "5px",
  boxShadow: "0 1px 5px #000 inset, 0 1px 0 #444",
});

const innerBar = apply({
  display: "inline-block",
  height: "100%",
  borderRadius: "3px",
  background: "#444",
  boxShadow: "0 1px 0 #555 inset",
});

const barLabel = apply({
  top: 0,
  left: 0,
  position: "absolute",
  lineHeight: "35px",
  paddingLeft: "10px",
});

export default {
  text: {
    label: label({
      margin: "5px 1%",
      width: "98%",
    }),
    input: ui({
      marginRight: "5px",
      outline: "none",
      border: "none",
      color: "white",
      textAlign: "right",
      float: "right",
      display: "block",
      minWidth: "5px",
      wordWrap: "normal",
    }),
  },

  select: {
    label: label({
      margin: "5px",
    }),
    container: ui({
      margin: "5px",
      padding: "5px",
      flexDirection: "row",
      display: "flex",
      flexWrap: "wrap",
      background: "#333",
      outline: "1px solid #2E2E2E",
    }),
    display: ui({
      float: "right",
      color: "white",
    }),
    listElem: ui({
      width: "100%",
      cursor: "pointer",
      overflow: "hidden",
      color: "#505050",
      textOverflow: "ellipsis",
      textShadow: "rgba(0, 0, 0, 0.3) 1px 1px 0px",
      border: "1px solid transparent",
      whiteSpace: "nowrap",
      background: "transparent",
    }),
    listInput: ui({
      width: "100%",
      fontFamily: "monospace",
      background: "transparent",
      color: "transparent",
      position: "absolute",
      outline: "none",
      border: "none",
    }),
    listContainer: ui({
      position: "absolute",
      background: "#F1F1F1",
      zIndex: "10",
      padding: "5px",
      marginTop: "-2px",
      marginLeft: "-1px",
      maxHeight: "200px",
      overflowY: "scroll",
      overflowX: "hidden",
      display: "none",
      border: "1px solid white",
      boxShadow: "3px 3px 12px rgba(0, 0, 0, 0.4),"
                +"0 0 60px 2px rgba(0, 0, 0, 0.2)",
    }),
    index: ui({
      color: "#BCBCBC",
      textShadow: "none",
      width: "3.5em",
      paddingRight: ".5em",
      textAlign: "right",
      display: "inline-block",
    }),
    elem: ui({
      outline: "none",
      position: "relative",
    }),
  },

  bitmask: {
    label: label({
      width: "100%",
      borderBottom: "none",
    }),
    input: ui({
      background: "transparent",
      border: "none",
      color: "#888",
      fontFamily: "monospace",
      float: "right",
      outline: "none",
      marginRight: "5px",
      textAlign: "right",
      width: "100%",
      position: "absolute",
      right: 0,
      top: "0.33em",
    }),
    container: ui({
      margin: "5px",
      padding: "5px",
      flexDirection: "row",
      display: "flex",
      flexWrap: "wrap",
      background: "#333",
      outline: "1px solid #2E2E2E",
    }),
    btn: [
      btn({width: "100%"}),
      btn({width: "48%"}),
      btn({width: "32%"}),
    ],
  },

  itemForm: {
    form: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "stretch",
      display: "flex",
    },
    box: box({
      width: "33%",
      boxSizing: "border-box",
      paddingTop: "26px",
      position: "relative",
      background: "linear-gradient(#333, #444 100px, #4C4C4C 94%, #333 101%)",
    }),
  },

  number: {
    value: ui({
      color: "white",
      fontWeight: "normal",
    }),
    golds: unit({ color: colors.gold.toString() }),
    silver: unit({ color: colors.silver.toString() }),
    copper: unit({ color: colors.copper.toString() }),
    second: unit({ color: colors.grey.toString() }),
    minute: unit({ color: colors.monk.toString() }),
    hour: unit({ color: colors.blizz.toString() }),
    label: halfLabel(),
    labelRight: halfLabel({
      textAlign: "right",
      backgroundColor: "#333",
      borderBottom: "transparent 1px solid",
    }),
    labelWide: label({
      margin: "5px 1%",
      width: "98%",
    }),
    input: ui({
      background: "transparent",
      fontFamily: "monospace",
      position: "absolute",
      textAlign: "right",
      marginRight: "5px",
      outline: "none",
      border: "none",
      color: "white",
      float: "right",
      top: "0.33em",
      width: "100%",
      right: 0,
    }),
  },

  progress: {
    outerBar: toAttrs(outerBar({ width: "350px" })),
    innerBar: toAttrs(innerBar({
      width: "0%",
      opacity: "1",
      transform: "translateZ(0)",
      transition: "width 1s cubic-bezier(0, 0.5, 0, 1), "
                + "opacity 1s cubic-bezier(0, 0.5, 0, 1)",
      willChange: "width, opacity",
    })),
    barLabel: toAttrs(barLabel()),
    container: ui({
      position: "fixed",
      display: "none",
      top: "10%",
      left: "50%",
      opacity: 0,
      marginLeft: "-250px",
      width: "500px",
      background: "#202020",
      height: "80%",
      zIndex: 99,
      borderRadius: "10px",
      willChange: "opacity",
      paddingTop: "50px",
      transition: "opacity .2s cubic-bezier(0.7, 0, 1, 0.85)",
      boxSizing: "border-box",
    }),
  },

  search: {
    result: ui({
      opacity: "0",
      transitionProperty: "opacity",
      transitionDuration: "0s",
      transitionDelay: "64ms",
      transitionTimingFunction: "cubic-bezier(0, 0.5, 0, 1)",
    }),
    subResult: apply({
      padding: ".3em",
      color: "#999",
      textAlign: "center",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    outerBar: outerBar({
      width: "100%",
      height: "35px",
      boxSizing: "border-box",
    }),
    innerBar: innerBar({
      display: "none",
      height: "25px",
      float: "left",
      padding: "0 5px",
      marginRight: "5px",
      lineHeight: "25px",
    }),
    input: apply({
      lineHeight: "25px",
      minWidth: "1px",
      outline: "none",
      display: "inline-block",
    })(),
  }
};
