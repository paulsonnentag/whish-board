import React, { Component } from 'react';
import Peer from  'simple-peer';

require('../style/app.scss');

export class PresenterApp extends Component {

  constructor () {
    super();
    
    this.peer = new Peer({initiator: true});

    this.peer.on('signal', (data) => {
      if (data.type === 'offer') {
        this.setState({ offer : data});
      }
    });

    this.state = {};

    this.peer.on('connect', () => {
      console.log('connect');
    });
  }

  accept () {
    var answer = JSON.parse(this._input.value);
    console.log(answer);

    this.peer.signal(answer);
  }

  render () {
    const {offer} = this.state;

    return (
      <div>
      <h1>Presenter !</h1>
        <pre>
        {JSON.stringify(offer)}
        </pre>

        <input ref={(c) => this._input = c} />
        <button onClick={(evt) => this.accept()}>join</button>
      </div>
    );
  }
}
