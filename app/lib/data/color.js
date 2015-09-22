import _keys from "_/object/keys";
import colr from "$/colr";

const colors = {
  grey:        "9D9D9D",
  white:       "FFFFFF",
  green:       "1EFF00",
  blue:        "0070DD",
  purple:      "A335EE",
  orange:      "FF8000",
  gold:        "E6CC80",
  blizz:       "00CCFF",
  deathKnight: "C41F3B",
  druid:       "FF7D0A",
  hunter:      "ABD473",
  mage:        "69CCF0",
  monk:        "00FF96",
  paladin:     "F58CBA",
  priest:      "FFFFFF",
  rogue:       "FFF569",
  shaman:      "0070DE",
  warlock:     "9482C9",
  warrior:     "C79C6E",
  golds:       "FCD60F",
  silver:      "C0C0C0",
  copper:      "FFA45B",
};

_keys(colors).forEach(key => colors[key] = colr(colors[key]));

export default colors;
