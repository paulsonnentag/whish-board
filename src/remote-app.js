import React, {Component} from 'react';
import Peer from  'simple-peer';
import { Sketch } from './sketch';
import { calculateSize } from './layout';

require('../style/app.scss');


export class RemoteApp extends Component {

  constructor () {
    super();

    this.peer = new Peer();

    this.peer.on('signal', (data) => {
      if (data.type === 'answer') {
        this.setState({answer: data});
      }
    });

    this.state = {connected: false};

    this.peer.on('connect', () => {
      console.log('connect');
      this.setState({connected: true});
    });

    this.peer.on('stream', (stream) => {
      this._video.src = window.URL.createObjectURL(stream);
      this._video.play();
    });
  }

  componentDidMount () {
    var size = calculateSize(this._board.clientWidth, this._board.clientHeight);
    this.setState(size);
  }

  accept () {
    var offer = JSON.parse(this._input.value);
    this.peer.signal(offer);
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
             style={{width: width, height: height, }}>
          <video className="stream"
                 style={{height: height}}
                 ref={(c) => this._video = c} />
          <Sketch/>
        </div>

      </div>
    )
  }
}