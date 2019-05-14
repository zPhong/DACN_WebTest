import React, { Component } from 'react';
import './css/App.css';
import { analyzeInput } from './RegexFunction';
import { defineSentences } from './configuration/define';
import { Scene } from './euclid'
import { renderGeometry, renderPoints } from './euclid/render';

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            result: '',
            pointsArray: [{ id: 'A', coordinate: { x: 300, y: 300 } }, { id: 'B', coordinate: { x: 120, y: 490 } }, { id: 'C', coordinate: { x: 290, y: 170 } }, { id: 'H', coordinate: { x: 306, y: 470 } }, { id: 'D', coordinate: { x: 150, y: 150 } }],
            segments: ['AB', 'AC', 'BC', 'AD', "BH"]
        };
    }

    componentDidMount() {
        this.renderGeometry();
    }

    renderGeometry = () => {
        const svg = document.getElementById('geometry');
        const points = document.getElementById('points')
        const viewBox = svg.viewBox.baseVal;
        const width = viewBox.width;
        const height = viewBox.height;

        const scene = new Scene({
            left: viewBox.x,
            top: viewBox.y,
            right: viewBox.x + width,
            bottom: viewBox.y + height
        })

        const { pointsArray, segments } = this.state;

        pointsArray.forEach(point => {
            scene.point(point.id, point.coordinate.x, point.coordinate.y)
        })

        segments.forEach(segment => {
            scene.segment(segment, segment[0], segment[1])
        })

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
    }

    render() {
        const { input, result } = this.state;
        return (
            <div className='App'>
                <header className='App-header' style={{ flexDirection: 'row' }}>
                    <div
                        style={{
                            flex: 1,
                            height: '100vh',
                            maxHeight: '100vh',
                            borderRight: 'solid red'
                        }}
                    >
                        <div
                            style={{
                                height: '50%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '50%',
                                    marginBottom: '1rem'
                                }}
                            >
                                <textarea
                                    row={5}
                                    style={{ flex: 1, height: 100 }}
                                    numberOfLine
                                    type='text'
                                    name='title'
                                    value={input}
                                    onChange={event => {
                                        this.setState({
                                            input: event.target.value
                                        });
                                    }}
                                />
                            </div>
                            <button
                                type='button'
                                className='btn btn-success'
                                onClick={() => {
                                    this.setState({
                                        result: analyzeInput(input)
                                    });
                                }}
                            >
                                Success
                            </button>
                        </div>
                        <div
                            style={{
                                height: '50%',
                                maxHeight: '50%',
                                overflowX: 'scroll'
                            }}
                        >
                            {Object.keys(defineSentences).map(type =>
                                defineSentences[type].map((value, index) => (
                                    <p key={index}>{`${value}`}</p>
                                ))
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
                    <div class="geometry-container">
                        <div class="geometry-container">
                            <svg id="geometry" class="geometry-scene" viewBox="0 0 800 800"></svg>
                            <svg id="points" class="geometry-scene" viewBox="0 0 800 800"></svg>
                        </div>
                    </div>
                </header>
            </div >
        );
    }
}

export default App;
