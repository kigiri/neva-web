import React from 'react';

const style = { };

export default React.createClass({
  render() {
    const s = this.props.size || 32;
    return (
      <svg
        xmlns="//www.w3.org/2000/svg"
        width={s}
        height={s}
        style={this.props.style || style}
        viewBox={"0 0 48 48"}>
        <path d={this.props.d} />
      </svg>
    );
  }
});
