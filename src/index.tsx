import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app';
import reportWebVitals from 'reportWebVitals';
import 'style/master.sass';
import COLORS from 'assets/colors.json';

const docElem = document.documentElement;
export const getTheme = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const setColorTheme = (theme: 'light' | 'dark') => {
  Object.entries(COLORS[theme]).forEach(([key, value]) =>
    docElem.style.setProperty(`--color-${key}`, value)
  );
};

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) =>
    setColorTheme(e.matches ? 'dark' : 'light')
  );

setColorTheme(getTheme());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
