import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app';
import reportWebVitals from 'reportWebVitals';
import 'style/master.sass';
import COLORS from 'assets/colors.json';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

const docElem = document.documentElement;
Object.entries(COLORS).forEach(([key, value]) =>
  docElem.style.setProperty(`--color-${key}`, value)
);

reportWebVitals();
