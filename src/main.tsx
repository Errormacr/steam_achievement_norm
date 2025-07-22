import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import App from './pages/main_window';
import GamePage from './pages/GamePage';
import Games from './pages/Games';
import AchPage from './pages/AchievementsPage';
import StatsPage from './pages/StatsPage';
import Layout from './components/Layout';
import { SocketProvider } from './features/SocketProvider';

import './index.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
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
