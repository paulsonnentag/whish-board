import React, { Component } from 'react';
import Sketchpad from './lib/responsive-sketchpad';
import { calculateSize } from './layout';

export class Sketch extends Component {

  componentDidMount() {
    var size = calculateSize(this._sketch.clientWidth, this._sketch.clientHeight);
    this.pad = new Sketchpad(this._sketch, size);


    if (this.props.strokes) {
      this.pad.strokes = this.props.strokes;
      this.pad.redraw();
    }

    this.pad.setLineColor('#4CAF50');

    var canvas = this._sketch.querySelector('canvas');

    if (this.props.onChange) {
      canvas.addEventListener('mousedown', () => this.update());
      canvas.addEventListener('touchstart', () => this.update());
      canvas.addEventListener('mousemove', () => this.update());
      canvas.addEventListener('touchmove', () => this.update());
      canvas.addEventListener('mouseup', () => this.update());
      canvas.addEventListener('mouseleave', () => this.update());
      canvas.addEventListener('touchend', () => this.update());
    }

    if (this.props.padRef) {
      this.props.padRef(this.pad);
    }
  }

  componentWillReceiveProps (props) {
    if (props.strokes) {

      console.log(props.strokes);

      this.pad.strokes = props.strokes;
      this.pad.redraw();
    }
  }

  update () {
    this.props.onChange(this.pad.strokes);
  }

  render () {
    var style = {
      'pointerEvents': this.props.disabled ? 'none' : 'auto'
    };

    return (
      <div className="sketch"
           style={style}
           ref={(c) => this._sketch = c }/>
    );
  }
}
