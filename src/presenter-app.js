import React, { Component } from 'react';
import Peer from  'simple-peer';

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
      },
      () => {}
    );

  }

  accept () {
    var answer = JSON.parse(this._input.value);
    this.peer.signal(answer);
  }

  render () {
    const {offer, connected} = this.state;

    if (connected) {
      return (
        <h1>Presenter !</h1>
      )
    }

    return (
      <div>
        <pre>
        {JSON.stringify(offer)}
        </pre>

        <input ref={(c) => this._input = c} />
        <button onClick={(evt) => this.accept()}>join</button>
      </div>
    );
  }
}
