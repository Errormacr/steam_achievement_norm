
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './views/main_window';

import './index.css';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App></App>
    </React.StrictMode>
);
postMessage({ payload: 'removeLoading' }, '*');
