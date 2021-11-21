import React from 'react';
import ReactDOM from 'react-dom';
import App from 'app';

import 'master.sass';

ReactDOM.render(
  <React.StrictMode>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
