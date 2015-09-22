
import _keys from '_/object/keys';

let mainHue, altHue;

const hueRange = hue => hue > 360 ? hue % 360 : hue;
const hsl = (h, s, l) => "hsl("+ h +","+ s +"%,"+ l +"%)";
const setAltHue = hue => hueRange(typeof hue === "number" ? hue : mainHue + 180);

mainHue = 198;
altHue = setAltHue(0);

const color = {
  main: {
    sl: (s, l) => hsl(mainHue, s, l),
    dark: hsl(mainHue, 40, 35),
    light: hsl(mainHue, 70, 85),
    normal: hsl(mainHue, 80, 70),
    darker: hsl(mainHue, 30, 25),
    lighter: hsl(mainHue, 70, 95)
  },
  alt: {
    sl: (s, l) => hsl(altHue, s, l),
    dark: hsl(altHue, 40, 35),
    light: hsl(altHue, 70, 85),
    normal: hsl(altHue, 80, 70),
    darker: hsl(altHue, 30, 25),
    lighter: hsl(altHue, 70, 95)
  },
  grey: {
    l: l => hsl(0, 0, l),
    dark: hsl(0, 0, 30),
    light: hsl(0, 0, 85),
    normal: hsl(0, 0, 60),
    darker: hsl(0, 0, 15),
    lighter: hsl(0, 0, 95)
  }
};

function generateSizes(baseUnit) {
  const fontMod = ~~(baseUnit / 5);

  font.min = Math.max(baseUnit / 16, 1);

  font.space = fontMod;
  font.big = baseUnit + fontMod;
  font.small = baseUnit - fontMod;
  font.normal = baseUnit;

  _keys(font).forEach(key => {
    if (typeof font[key] === "number") {
      font[key +"2x"] = font[key] * 2;
    }
  });
}

const font = { family: "robot, sans-serif" };
const material = {
  shadow: {
    text: "",
    box: "0 2px 2px  0px rgba(0,0,0,.14),"
        +"0 3px 1px -2px rgba(0,0,0,.2),"
        +"0 1px 5px  0px rgba(0,0,0,.12)",
  }
};

generateSizes(16);

export { color as color };
export { font as font };
export { material as material };

export default {
  font,
  color
};
