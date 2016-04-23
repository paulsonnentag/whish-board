import React, {Component} from 'react';
import Peer from  'simple-peer';
import { Sketch } from './sketch';
import { calculateSize } from './layout';

require('../style/app.scss');


export class RemoteApp extends Component {

  constructor () {
    super();


    var transform = {x: 0, y: 0, zoom: 1};

    /*
    try {
      transform = JSON.parse(localStorage.getItem('stream-transform'));

    } catch (e) {
      console.log('transform not set, but thats fine');
    }*/

    //console.log('transform', transform);

    this.state = {
      connected: false,
      transform: transform
    };
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

    document.addEventListener('keyup', (e) => this.keyHandler(e));
  }

  keyHandler (e) {
    var transform = this.state.transform;

    switch (e.keyCode) {
      case 37: // left
        transform.x -= 1;
        break;

      case 38: // up
        transform.y -= 1;
        break;

      case 39: // right
        transform.x += 1;
        break;

      case 40: // down
        transform.y += 1;
        break;

      case 74: // j
        transform.zoom += 0.002;
        break;

      case 75: // k
        transform.zoom -= 0.002;
        break;
    }

    this.setState({transform : transform});

    //localStorage.setItem(JSON.stringify(transform));
  }

  accept () {
    var offer = JSON.parse(this._input.value);
    this.peer.signal(offer);
  }

  transmitSketch (strokes) {
    if (this.state.connected) {
      this.peer.send(JSON.stringify(strokes));
    }
  }

  render () {
    const {answer, connected, width, height, transform} = this.state;
    const transformProp = 'scale(' + transform.zoom + ','+ transform.zoom +')'
    + 'translate(' + transform.x + 'px, ' + transform.y + 'px)';

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
                 style={{height: height, transform: transformProp}}
                 ref={(c) => this._video = c} />
          <Sketch ref={(c) => this._sketch = c}
                  onChange={(strokes) => this.transmitSketch(strokes)}/>
        </div>

      </div>
    )
  }
}