import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './css/index.css';
import * as serviceWorker from './serviceWorker';
import TestMath from "./TestMath";

ReactDOM.render(<TestMath />, document.getElementById('root'));

serviceWorker.unregister();
