import React from "react";
import idGenerator from "$/idGenerator";
import delegate from "$/delegate";
import { color, font } from 'style/globals';
import uiStyle from "style/ui";
import apply from "style/apply";
import prop from "style/properties";

const outlineStyle = apply({
  background: color.main.normal,
  height: font.min2x,
  position: "absolute",
  bottom: 0
});

const labelStyle = apply(uiStyle({
  position: "absolute",
  left: 0,
  bottom: 0,
  fontSize: font.normal,
  paddingTop: font.space,
  paddingBottom: font.space
}));

const _style = {
  container: {
    position: "relative",
    marginTop: font.normal2x,
    marginBottom: font.normal * 1.5
  },
  label: {
    on: labelStyle({ color: color.main.normal }),
    off: labelStyle({ color: color.grey.normal }),
  },
  outline: {
    off: outlineStyle({ width: "0%" }),
    on: outlineStyle({ width: "100%" }),
  },
  input: apply({
    outline: 0,
    fontSize: font.normal,
    borderWidth: 0,
    width: "100%",
    borderColor: color.grey.light,
    borderBottomWidth: font.min,
    paddingTop: font.space,    
    paddingBottom: font.space
  })()
}

export default React.createClass({
  handleFocus(event) {
    if (delegate(this.props.onFocus, this, event) === false) {return }
    this.setState({ focus: true });
  },
  handleBlur(event) {
    if (delegate(this.props.onBlur, this, event) === false) {return }
    this.setState({ focus: false });
  },
  isEmpty() { return !this.state.value },
  isFocus() { return this.state.focus },
  handleChange(event) {
    if (delegate(this.props.onChange, this, event) === false) { return }
    this.setState({ value: event.target.value });
  },
  getInitialState() { return {
    value: this.props.default || "",
    focus: false
  }; },
  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;
    if (value && this.state.value !== value) {
      this.setState({ value });
    }
  },
  getValue() { return this.state.value; },
  render() {
    const styleState = this.isFocus() ? "on" : "off"; 
    const id = idGenerator(this.props.name, this._reactInternalInstance._rootNodeID);

    _style.label[styleState].transform = this.isEmpty() && !this.isFocus()
      ? "translate(0, 0)"
      : "translate(0, -"+ (font.big + font.space) +"px)";

    return (
      <div style={ _style.container }>
        <input
          id={ id }
          style={ _style.input }
          onFocus={ this.handleFocus }
          onBlur={ this.handleBlur }
          onChange={ this.handleChange }
          value={ this.state.value }
          type="text"
          placeholder={ this.props.placeholder || "" } />
        <label
          style={ _style.label[styleState] }
          htmlFor={ id }>{ this.props.name }</label>
        <div style={ _style.outline[styleState] } />
      </div>
    );
  }
});
