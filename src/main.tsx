
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './views/main_window';

import './index.css';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <App></App>
);
postMessage({ payload: 'removeLoading' }, '*');
