import is from "$/is";
/* TODO:
 * fix intToHex
 * fix applyHsl
 * add tools :)
*/


const COLR_TYPE = "$/colr";

const intToHex = n => n.toString(16);
const intToRgb = n => ({ r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 });
const hexToInt = hex => parseInt(hex.length === 3 ? hex + hex: hex, 16);
const hexToRgb = hex => intToRgb(hexToInt(hex));
const rgbToInt = ({r, g, b}) => r << 16 | g << 8 | b;
const rbgToHex = ({r, g, b}) => intToHex(rgbToInt(r, g, b));

function applyConstant(colr) {
  colr.int = rgbToInt(colr);
  colr.hex = intToHex(colr.int);
  return colr;
}

function hueToRgb(q, p, t) {
  t /= 360;
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return ~~(p * 255);
}

function applyHsl(colr) {
  if (colr.s < 0.0001){
    colr.r = colr.g = colr.b = l * 2.55; // achromatic
    return applyConstant(colr);
  }

  const l = colr.l / 100;
  const s = colr.s / 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  colr.r = hueToRgb(q, p, colr.h + 120);
  colr.g = hueToRgb(q, p, colr.h);
  colr.b = hueToRgb(q, p, colr.h - 120);

  return applyConstant(colr);
}

function insertHsl(colr) {
    const r = colr.r / 255;
    const g = colr.g / 255;
    const b = colr.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);

    colr.l = ((max + min) * 50);

    if (max === min) { return colr.h = colr.s = 0 }

    const d = max - min;

    colr.s = (colr.l > 0.5 ? d / (2 - max - min) : d / (max + min)) * 100;
    switch(max){
        case r: colr.h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: colr.h = (b - r) / d + 2; break;
        case b: colr.h = (r - g) / d + 4; break;
    }
    colr.h *= 60;
    if (colr.h < 0) {
      colr.h += 360;
    }
}

function initFromInt(intValue) {
  const me = intToRgb(intValue);

  me.int = intValue;
  me.hex = intToHex(intValue);
  insertHsl(me);

  return me;
}

function initColr(value) {
  if (is.text(value)) {
    return initFromInt(hexToInt(value));
  } else if (is.num(value)) {
    return initFromInt(value);
  } else {
    if (is.num(value.int)) {
      return initFromInt(value.int);
    } else if (is.text(value.hex)) {
      return initFromInt(hexToInt(value.hex));
    } else {
      console.warn("unable to parse color from value:", value);
      return initFromInt(0);
    }
  }
}

const isColr = colr => colr.type === COLR_TYPE;

function parseColr(value) {
  const me = initColr(value);
  me.type = COLR_TYPE;

  me.clone = () => parseColr(me.hex),
  me.getComplementary = () => {
    const comp = me.clone();
    comp.h = comp.h > 180 ? comp.h - 180 : comp.h + 180;
    comp.l += 50;
    if (comp.l > 100) {
      comp.l -= 50;
    }
    return applyHsl(comp);
  };
  me.getGrayScale = () => {
    const comp = me.clone();
    comp.s = 0;
    return applyHsl(comp);
  };
  me.map = map => "hsl("+ me.h +","+ me.s +"%,"+ map(me.l) +"%)";
  me.min = min => "hsl("+ me.h +","+ me.s +"%,"+ Math.min(me.l, min) +"%)";
  me.max = max => "hsl("+ me.h +","+ me.s +"%,"+ Math.max(me.l, max) +"%)";
  me.toString = type => {
    switch (type) {
      case "hsl": return "hsl("+ me.h +","+ me.s +"%,"+ me.l +"%)";
      case "rgb": return "rgb("+ me.r +","+ me.g +","+ me.b +")";
      default: return "#"+ me.hex;
    }
  }
  me.hex = value;
  return me;
}

export default parseColr;
