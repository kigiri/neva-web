import apply from './apply';
import { font, color, material } from './globals';

const box = apply({
  background: "#444",
  // outline: "1px solid #333",
  // outlineOffset: "-2px",
  boxShadow: "#555 0 0 0 1px,"
   +"2px 3px 4px 3px rgba(0, 0, 0, 0.1),"
   +"rgba(0, 0, 0, 0.5) 0px 0px 8px 3px",
  color: "#999",
  // border: "1px solid #888",
  textShadow: "1px 1px 0 #222",
  margin: "5px",
});

box.padding = font.normal;

let footer = apply({
  borderTopWidth: font.min,
  borderTopStyle: "solid",
  borderTopColor: color.grey.light,
  padding: box.padding
});

let header = apply({
  background: color.main.normal,
  color: "white",
  fontSize: font.big,
  padding: box.padding,
  paddingTop: box.padding * 3
});

box.header = header;
box.footer = footer;

export {header as header};
export {footer as footer};

export default box;
