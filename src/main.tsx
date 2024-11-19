import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './views/main_window';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import { SocketProvider } from './views/SocketProvider';
import GamePage from './views/GamePage';
import Games from './views/Games';
import AchPage from './views/AchievementsPage';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <SocketProvider>
     <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/GamePage/:appid/:backWindow" element={<GamePage />} />
        <Route path="/Games" element={<Games />} />
        <Route path="/Achievements" element={<AchPage />} />
      </Routes>
    </Router>
  </SocketProvider>
);
postMessage({ payload: 'removeLoading' }, '*');
