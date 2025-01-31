import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './views/main_window';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import { SocketProvider } from './views/SocketProvider';
import GamePage from './views/GamePage';
import Games from './views/Games';
import AchPage from './views/AchievementsPage';
import StatsPage from './views/StatsPage';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <SocketProvider>
     <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/GamePage/:appid/:backWindow" element={<GamePage />} />
        <Route path="/Games" element={<Games />} />
        <Route path="/Achievements/:minPercent/:maxPercent/:date/:backWindow/:gameAppid" element={<AchPage />} />
        <Route path="/Stats/:gameAppid" element={<StatsPage />} />
      </Routes>
    </Router>
  </SocketProvider>
);
postMessage({ payload: 'removeLoading' }, '*');
