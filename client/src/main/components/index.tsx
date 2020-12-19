import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';
import 'reset-css';
import 'typeface-barlow';
import '../styles/base.less';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode><App /></React.StrictMode>,
  document.getElementById('root')
);
