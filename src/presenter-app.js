import React, { Component } from 'react';
import Peer from  'simple-peer';
import { Sketch } from './sketch';
import { calculateSize } from './layout';

require('../style/app.scss');


export class PresenterApp extends Component {

  constructor () {
    super();

    this.state = {connected: false};

    navigator.webkitGetUserMedia(
      { video: true, audio: false },
      (stream) => {
        this.peer = new Peer({
          initiator: true,
          stream: stream
        });

        this.peer.on('signal', (data) => {
          if (data.type === 'offer') {
            this.setState({ offer : data});
          }
        });

        this.peer.on('connect', () => {
          console.log('connect');
          this.setState({connected: true});


        });

        this.peer.on('data', (strokes) => this.drawSketch(JSON.parse(strokes.toString())));
      },
      () => {}
    );

  }

  componentDidMount () {
    var size = calculateSize(
      this._app.clientWidth,
      this._app.clientHeight
    );

    this.setState(size);
  }


  drawSketch (strokes) {
    console.log(strokes);
    this.setState({strokes : strokes});
  }

  accept () {
    var answer = JSON.parse(this._input.value);
    this.peer.signal(answer);
  }

  render () {
    const {offer, connected, strokes, width, height} = this.state;

    return (
      <div className="presenter-app"
           ref={(c) => this._app = c}>
        { !connected ?
          (<div className="connect-input">
              <pre>
              {JSON.stringify(offer)}
              </pre>
              <input ref={(c) => this._input = c} />
              <button onClick={(evt) => this.accept()}>join</button>
            </div>)
          :
          null
        }
        <Sketch strokes={strokes} disabled={true}/>
      </div>
    );
  }
}
