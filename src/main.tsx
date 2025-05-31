import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './views/pages/main_window';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import { SocketProvider } from './views/features/SocketProvider';
import GamePage from './views/pages/GamePage';
import Games from './views/pages/Games';
import AchPage from './views/pages/AchievementsPage';
import StatsPage from './views/pages/StatsPage';
import Layout from './views/components/Layout';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <SocketProvider>
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/GamePage/:appid/:backWindow" element={<GamePage />} />
          <Route path="/Games" element={<Games />} />
          <Route path="/Achievements/:minPercent/:maxPercent/:date/:backWindow/:gameAppid" element={<AchPage />} />
          <Route path="/Stats/:gameAppid" element={<StatsPage />} />
        </Route>
      </Routes>
    </Router>
  </SocketProvider>
);
postMessage({ payload: 'removeLoading' }, '*');
