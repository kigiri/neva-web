import { svg } from "$/parse";

const nameSpace = "http://www.w3.org/2000/svg";
const xlink = "http://www.w3.org/1999/xlink";
const a = '<svg xmlns="'+ nameSpace +'" xmlns:xlink="'+ xlink +'" width="';
const b = '" height="';
const c = '" viewBox="0 0 48 48"><';
const d = '/></svg>';
const err = e => console.error("icon/index.js, Error exporting svg.\n", e);

export default (icon, s = 48) => svg(a + s + b + s + c + icon + d, err);
