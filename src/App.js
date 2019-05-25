import React, { Component } from 'react';
import './css/App.css';
import { analyzeInput } from './RegexFunction';
import { defineSentences } from './configuration/define';
import { Scene } from './euclid';
import { renderGeometry, renderPoints } from './euclid/render';

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomPoint() {
  return { x: getRandomArbitrary(0, 800), y: getRandomArbitrary(0, 800) };
}

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      result: ''
    };
  }

  onResult = () => {
    const { input } = this.state;
    const { points, segments, Error } = analyzeInput(input);

    if (Error) {
      alert(Error);
      return;
    }
    points.forEach((point) => {
      point.coordinate = { ...getRandomPoint() };
    });

    this.renderGeometry(points, segments);
  };

  renderGeometry = (_points, _segments) => {
    const svg = document.getElementById('geometry');
    while (svg.firstChild) {
      svg.firstChild.remove();
    }
    const points = document.getElementById('points');
    while (points.firstChild) {
      points.firstChild.remove();
    }
    const viewBox = svg.viewBox.baseVal;
    const width = viewBox.width;
    const height = viewBox.height;

    const scene = new Scene({
      left: viewBox.x,
      top: viewBox.y,
      right: viewBox.x + width,
      bottom: viewBox.y + height
    });

    _points.forEach((point) => {
      scene.point(point.id, point.coordinate.x, point.coordinate.y);
    });

    _segments.forEach((segment) => {
      scene.segment(segment, segment[0], segment[1]);
    });

    // scene
    //     .point('A', width / 7 * 3, height / 3)
    //     .point('B', width / 7 * 5, height / 3)
    //     .segment('S', 'A', 'B')
    //     .circle('M', 'A', 'B')
    //     .circle('N', 'B', 'A')
    //     .intersection('C', 'M', 'N', 0)
    //     .intersection('D', 'M', 'N', 1)
    //     .line('T', 'A', 'C')
    //     .segment('U', 'A', 'D')
    //     .intersection('E', 'T', 'M', scene.isnt('C'))
    //     .segment('V', 'E', 'B')
    //     .intersection('F', 'V', 'U')
    //     .segment('W', 'F', 'C')
    //     .intersection('W', 'S')

    scene.update();
    renderGeometry(scene, svg);
    renderGeometry(scene, svg);
    renderPoints(scene, points);
  };

  render() {
    const { input } = this.state;
    return (
      <div className="App">
        <header className="App-header" style={{ flexDirection: 'row' }}>
          <div
            style={{
              flex: 1,
              height: '100vh',
              maxHeight: '100vh',
              borderRight: 'solid red'
            }}>
            <div
              style={{
                height: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <div
                style={{
                  width: '100%',
                  height: '50%',
                  marginBottom: '1rem'
                }}>
                <textarea
                  style={{ flex: 1, height: 100 }}
                  name="title"
                  value={input}
                  onChange={(event) => {
                    this.setState({
                      input: event.target.value
                    });
                  }}
                />
              </div>
              <button type="button" className="btn btn-success" onClick={this.onResult}>
                Success
              </button>
            </div>
            <div
              style={{
                height: '50%',
                maxHeight: '50%',
                overflowX: 'scroll'
              }}>
              {Object.keys(defineSentences).map((type) =>
                defineSentences[type].map((value, index) => <p key={index}>{`${value}`}</p>)
              )}
            </div>
          </div>
          {/* <span style={{ flex: 1 }}>
                        {Object.keys(result).map((value, index) => (
                            <p key={index}>{`${value} : ${JSON.stringify(
                                result[value]
                            )}`}</p>
                        ))}
                    </span> */}
          <div className="geometry-container">
            <div className="geometry-container">
              <svg id="geometry" className="geometry-scene" viewBox="0 0 800 800" />
              <svg id="points" className="geometry-scene" viewBox="0 0 800 800" />
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
