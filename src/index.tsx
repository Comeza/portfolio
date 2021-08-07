import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app';
import reportWebVitals from 'reportWebVitals';
import 'style/master.sass';

export const docElem = document.documentElement;

ReactDOM.render(
  <React.StrictMode>
    <App
      defaultAppState={{
        colorScheme:
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light',
      }}
    />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
