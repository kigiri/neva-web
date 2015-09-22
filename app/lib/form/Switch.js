import React from "react";
import idGenerator from "$/idGenerator";
import delegate from "$/delegate";
import { color, font } from 'style/globals';
import uiStyle from "style/ui";
import apply from "style/apply";

const labelStyle = apply(uiStyle({
  fontSize: font.normal,
  marginTop: font.space2x,
  marginBottom: font.space2x,
  display: "inline-block",
  paddingTop: font.space,
  paddingBottom: font.space,
  width: "100%"
}));

const _style = {
  label: {
    on: labelStyle({ color: color.main.normal }),
    off: labelStyle({ color: color.grey.normal }),
    selectedon: labelStyle({ color: color.grey.darker }),
    selectedoff: labelStyle({ color: color.main.darker }),
  },
  input: { outline: 0 }
}

export default React.createClass({
  handleFocus(event) {
    this.setState({ focus: true });
    delegate(this.props.onFocus, this, event);
  },
  handleBlur(event) {
    this.setState({ focus: false });
    delegate(this.props.onBlur, this, event);
  },
  isEmpty() { return !this.state.value },
  isFocus() { return this.state.focus },
  handleChange(event) {
    this.setState({ value: event.target.checked });
    delegate(this.props.onChange, this, event);
  },
  getInitialState() { return {
    value: this.props.value || "",
    focus: false
  }; },
  getValue() { return this.state.value },
  render() {
    const id = idGenerator(this.props.name, this._reactInternalInstance._rootNodeID);
    const style = (() => {
      let key = this.isFocus() ? "on" : "off"
      if (this.state.value) { return _style.label["selected"+ key] }
      return _style.label[key];
    })();

    return (
      <label
        style={ style }
        htmlFor={ id }>
        <input
          id={ id }
          style={ _style.input }
          onFocus={ this.handleFocus }
          onBlur={ this.handleBlur }
          onChange={ this.handleChange }
          checked={ this.state.value }
          type="checkbox" />
        { this.props.name }
      </label>
    );
  }
});
