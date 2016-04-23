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

    this.state = {};

    this.peer.on('connect', function () {
      console.log('connect');
    });
  }

  accept () {
    var offer = JSON.parse(this._input.value);
    this.peer.signal(offer);
  }

  render () {
    const {answer} = this.state;

    return (
      <div>
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
