import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './css/index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import TestMath from "./TestMath";

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
