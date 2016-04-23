import React, {Component} from 'react';
import Peer from  'simple-peer';

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
      this._video.src = window.URL.createObjectURL(stream)
      this._video.play();
    });
  }

  accept () {
    var offer = JSON.parse(this._input.value);
    this.peer.signal(offer);
  }

  render () {
    const {answer, connected} = this.state;

    if (connected) {
      return (
        <div>
          <video ref={(c) => this._video = c} />
          <h1>Remote !</h1>
        </div>
      );
    }

    return (
      <div>
        <video ref={(c) => this._video = c} />
        <h1>Remote !</h1>
        <pre>
        {JSON.stringify(answer)}
        </pre>



        <input ref={(c) => this._input = c}/>
        <button onClick={(evt) => this.accept()}>join</button>
      </div>
    )
  }
}
