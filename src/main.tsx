import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import App from './views/pages/main_window';
import GamePage from './views/pages/GamePage';
import Games from './views/pages/Games';
import AchPage from './views/pages/AchievementsPage';
import StatsPage from './views/pages/StatsPage';
import Layout from './views/components/Layout';
import { SocketProvider } from './views/features/SocketProvider';

import './index.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const rootElement = document.getElementById('body') as HTMLElement;
rootElement.setAttribute('data-theme', 'dark');

ReactDOM.createRoot(rootElement).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
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
  </ThemeProvider>
);

postMessage({ payload: 'removeLoading' }, '*');
