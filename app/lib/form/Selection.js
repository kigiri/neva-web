import React from "react";
import idGenerator from "$/idGenerator";
import delegate from "$/delegate";
import { color, font } from 'style/globals';
import uiStyle from "style/ui";
import apply from "style/apply";
import prop from "style/properties";
import { on } from "event";


const labelStyle = apply(uiStyle({
  fontSize: font.normal,
  width: "100%",
  display:"block",
  paddingTop: font.space,
  paddingBottom: font.space
}));

const _style = {
  container: {
    position: "relative",
    marginTop: font.normal2x,
    marginBottom: font.normal * 1.5,
    clear: "both"
  },
  label: {
    on: labelStyle({ color: color.main.normal }),
    off: labelStyle({ color: color.grey.normal }),
    selectedoff: labelStyle({ color: color.grey.darker }),
    selectedon: labelStyle({ color: color.main.darker }),
  },
  input: { outline: 0 },
}

export default React.createClass({
  handleFocus(event) {
    const target = event.target;

    this.setState({
      previouslyFocused: this.state.focusedOption,
      focusedOption: target.value
    });
    on.focus(state => {
      if (state.focus !== target) {
        this.clearFocus(target.value);
        return false;
      }
    })
    delegate(this.props.onFocus, this, event);
  },
  clearFocus(val) {
    this.setState(state => {
      if (state.focusedOption == val) {
        delegate(this.props.onBlur, this, {});
        return {
          previouslyFocused: val,
          focusedOption: null
        };
      }
    });
  },
  isEmpty() { return !this.state.value },
  isFocus() { return !(this.state.focusedOption === null) },
  handleChange(event) {
    const eventInfo = {
      i: event.target.value,
      state: event.target.checked
    };
    this.setState(state => {
      if (this.props.multiple) {
        state.values[eventInfo.i] = eventInfo.state;
        return { values: state.values };
      }
      let values = state.values.map((key, i) => false);
      values[eventInfo.i] = eventInfo.state;
      return { values };
    });
    delegate(this.props.onChange, this, event);
  },
  getInitialState() {
    const values = this.props.options.map(this.props.multiple
      ? () => false
      : (_, i) => !i);

    return {
      values,
      previouslyFocused: null,
      focusedOption: null
    };
  },
  render() {
    const styleState = this.isFocus() ? "on" : "off"; 
    const id = idGenerator(this.props.name, this._reactInternalInstance._rootNodeID);
    const isMultiple = this.props.multiple;
    const type = isMultiple ? "checkbox" : "radio";

    let options = this.props.options.map((opt, i) => {
      const optId = id +'-'+ i;
      const optStyleState = (() => {
        let key = (this.state.focusedOption == i) ? "on" : "off";
        if (this.state.values[i]) { return "selected"+ key }
        return key;
      })();

      return (
        <label
          htmlFor={ optId }
          key={ optId }
          style={ _style.label[optStyleState] }>
          <input
            type={ type }
            style={ _style.input }
            id={ optId }
            name={ isMultiple ? optId : id }
            value={ i }
            checked={ this.state.values[i] }
            onChange={ this.handleChange }
            onFocus={ this.handleFocus } />
          { opt }
        </label>
      );
    })

    return (
      <div style={ _style.container } ref={ id }>
        <label
          style={ _style.label[styleState] }
          onClick={ () => document.getElementById(id +'-'+ (this.state.previouslyFocused || 0)).focus() }
          htmlFor={ id }>{ this.props.name }</label>
        <div>{ options }</div>
      </div>
    );
  }
});
