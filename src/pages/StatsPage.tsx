import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';
import { Card, CardContent, Typography } from '@mui/material';

import AchRareHistogram from '../features/AchRareHistogram';
import AchTimeHistogram from '../features/AchTimeHistogram';
import AchAccPercentHistogram from '../features/AchAccPercentHistogram';
import GamesByCompletionDiagram from '../features/GamesByCompletionDiagram';
import ScrollToTopButton from '../components/ScrollToTopButton';
import GamesPercentsByTimeChart from '../features/GamesPercentsByTimeChart';

import '../styles/scss/StatsPage.scss';

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameAppid } = useParams<{ gameAppid?: string }>();
  const { t } = useTranslation();
  const gameId = gameAppid ? Number(gameAppid) : undefined;
  const isGlobalStats = !gameAppid || Number.isNaN(gameId);

  const charts = [
    {
      title: 'achievementsDistributionByPlayers',
      component: <AchRareHistogram gameAppid={gameId} />,
      wide: true
    },
    {
      title: 'achievementsReceivedPerDay',
      component: <AchTimeHistogram gameAppid={gameId} />,
      wide: true
    }
  ];
  if (isGlobalStats) {
    charts.push({
      title: 'averageAccountAchievementsByDay',
      component: <AchAccPercentHistogram />,
      wide: true
    }, {
      title: 'gamesByCompletion',
      component: <GamesByCompletionDiagram />,
      wide: true
    }, {
      title: 'gamesPercentsByTime',
      component: <GamesPercentsByTimeChart />,
      wide: true
    });
  }

  return (
    <I18nextProvider i18n={i18n}>
      <div className="stats-page">
        <div className="stats-header">
          <FaArrowLeft className="button-icon return" onClick={() => navigate('/')} id="return" />
          <div className="stats-header-text">
            <Typography variant="h4" component="h1">
              {isGlobalStats ? t('statsTitleGlobal') : t('statsTitleGame')}
            </Typography>
            <Typography variant="subtitle2" className="stats-subtitle">
              {isGlobalStats ? t('statsSubtitleGlobal') : `${t('statsSubtitleGame')} ${gameId}`}
            </Typography>
          </div>
        </div>
        <div className="charts-container">
          {charts.map((chart) => (
            <Card
              key={`card-${chart.title}`}
              className={`chart-card${chart.wide ? ' chart-card--wide' : ''}`}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {t(chart.title)}
                </Typography>
                {chart.component}
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollToTopButton />
      </div>
    </I18nextProvider>
  );
};

export default StatsPage;
