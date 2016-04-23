import React, { Component } from 'react';
import Sketchpad from 'responsive-sketchpad';

export class Sketch extends Component {

  componentDidMount() {
    var pad = new Sketchpad(this._sketch, {
      width: this._sketch.clientWidth,
      height: this._sketch.clientHeight
    });
    pad.setLineColor('#4CAF50');

  }

  render () {
    return (
      <div className="sketch"
              ref={(c) => this._sketch = c }/>
    );
  }
}
