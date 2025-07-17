import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {I18nextProvider, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AchCont from '../features/last_ach_container';
import CircularProgressSVG from '../components/CircularProgressSVG';
import GameCard from '../components/GameCard';
import { ApiService } from '../../services/api.services';
import { UserData } from '../../interfaces';

import i18n from '../../transate';
import '../scss/MainWindow.scss';
import { Box, Typography } from '@mui/material';

export default function App() {
  const { t } = useTranslation();
  const [personalName, setPersonalName] = useState('');
  const [AchCount, setAchCount] = useState(0);
  const [gamesCount, setGamesCount] = useState(0);
  const [avaUrl, setAvaUrl] = useState('');
  const [percent, setPercent] = useState(0);
  const [recentGames, setRecentGames] = useState([]);

  const updateUserData = useCallback(async () => {
    const dataSteamId = localStorage.getItem('steamId');
    const achContainer = ReactDOM.createRoot(document.getElementById('container'));

    if (dataSteamId) {
      try {
        const userData = await ApiService.get<UserData>(`user/${dataSteamId}/data`);
        setPersonalName(userData.user.nickname);
        setAvaUrl(userData.user.avatarLarge);
        setPercent(userData.user.percent);
        setGamesCount(userData.gameCount);
        setAchCount(userData.achCount);
        setRecentGames(userData.user.gameDatas);
        achContainer.render(<AchCont />);
      } catch (e) {
        console.error('Error updating user data:', e);
        toast.error('Failed to update user data. Please try again.');
      }
    }
  }, []);

  useEffect(() => {
    try {
      updateUserData();
    } catch (error) {
      console.error('Error in useEffect:', error);
      toast.error('An error occurred while updating data. Please try again.');
    }
  }, [updateUserData]);

  return (

      <I18nextProvider i18n={i18n}>
    <div className="main-window">
      {personalName && (
        <div className="user-profile">
          <div className="user-info">
            <img alt="avatar" className="avatar" src={avaUrl} />
            <h2 className="nickname">{personalName}</h2>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">{t('Ach')}:</span>
                <span className="stat-value">{AchCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('Games')}:</span>
                <span className="stat-value">{gamesCount}</span>
              </div>
            </div>
            <div className="progress-section">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgressSVG
                  percent={percent}
                  size={150}
                  strokeWidth={15}
                />
                <Typography variant="subtitle1" sx={{ mt: 1 }}>
                  {t('AveragePercent')}
                </Typography>
              </Box>
            </div>
          </div>
        </div>
      )}
      <div className="content-section">
        <div className="recent-games">
          <h3>{t('RecentGames')}</h3>
          <div className="game-cards">
            {recentGames.map((game) => (
              <GameCard key={game.appid} appid={game.appid} backWindow="main" />
            ))}
          </div>
        </div>
        <div className="last-achievements">
          <h3>{t('LastAchievements')}</h3>
          <div id="container"></div>
        </div>
      </div>
    </div>
      </I18nextProvider>
  );
}
