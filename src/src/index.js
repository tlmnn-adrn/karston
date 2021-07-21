import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App.js';

const {ipcRenderer} = require('electron');

ipcRenderer.on('message', (event, message) => console.log(message));

ReactDOM.render(
  <App />,
  document.getElementById('app')
);

module.hot.accept();