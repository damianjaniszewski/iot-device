import '../scss/index.scss';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DeviceDashboard from './components/DeviceDashboard';

class Main extends Component {
  render () {
    return (
      <DeviceDashboard />
    );
  }
};

let element = document.getElementById('content');
ReactDOM.render(React.createElement(Main), element);

document.body.classList.remove('loading');
