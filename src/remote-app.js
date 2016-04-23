import React, {Component} from 'react';
import Peer from  'simple-peer';
import { Sketch } from './sketch';
import { calculateSize } from './layout';

require('../style/app.scss');


export class RemoteApp extends Component {

  constructor () {
    super();

    this.state = {connected: false};
  }

  componentDidMount () {
    var size = calculateSize(this._board.clientWidth, this._board.clientHeight);
    this.setState(size);


    this.peer = new Peer();

    this.peer.on('signal', (data) => {
      if (data.type === 'answer') {
        this.setState({answer: data});
      }
    });

    this.peer.on('connect', () => {
      console.log('connect');
      this.setState({connected: true});
    });

    this.peer.on('stream', (stream) => {
      this._video.src = window.URL.createObjectURL(stream);
      this._video.play();
    });
  }

  accept () {
    var offer = JSON.parse(this._input.value);
    this.peer.signal(offer);
  }

  transmitSketch (strokes) {
    if (this.state.connected) {
      console.log(strokes);

      this.peer.send(JSON.stringify(strokes));
    }
  }

  render () {
    const {answer, connected, width, height} = this.state;

    return (
      <div className="remote-app">
        {
          !connected ?
            (<div className="connect-input">
              <pre>
                {JSON.stringify(answer)}
              </pre>
              <input ref={(c) => this._input = c}/>
              <button onClick={(evt) => this.accept()}>join</button>
            </div>)
            :
            null
        }

        <div className="board"
             ref={(c) => this._board = c}
             style={{width: width, height: height}}>
          <video className="stream"
                 style={{height: height}}
                 ref={(c) => this._video = c} />
          <Sketch ref={(c) => this._sketch = c}
                  onChange={(strokes) => this.transmitSketch(strokes)}/>
        </div>

      </div>
    )
  }
}