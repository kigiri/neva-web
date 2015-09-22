import { color, font, material } from './globals';
import ui from "./ui";
import apply from './apply';

export default apply(ui({
  color: "white",
  paddingRight: font.small2x,
  paddingLeft: font.small2x,
  fontSize: font.normal,
  lineHeight: font.big2x +"px",
  fontWeight: "bold",
  textShadow: material.shadow.text,
  backgroundColor: color.main.normal,
  borderWidth: 0,
  borderRadius: font.space,
  textAlign: "center",
  textTransform: "uppercase",
  outlineColor: color.main.darker,
  minWidth: font.normal * 4,
  display: "inline-block",
  boxShadow: material.shadow.box,
}));
