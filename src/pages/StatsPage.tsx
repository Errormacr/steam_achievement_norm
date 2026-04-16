import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';

import AchRareHistogram from '../features/AchRareHistogram';
import AchTimeHistogram from '../features/AchTimeHistogram';
import AchAccPercentHistogram from '../features/AchAccPercentHistogram';
import GamesByCompletionDiagram from '../features/GamesByCompletionDiagram';
import ScrollToTopButton from '../components/ScrollToTopButton';
import GamesPercentsByTimeChart from '../features/GamesPercentsByTimeChart';

import '../styles/scss/StatsPage.scss';
import '../styles/scss/PageShell.scss';

interface StatsPageScrollState {
  scrollY: number;
}

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameAppid } = useParams<{ gameAppid?: string }>();
  const { t } = useTranslation();
  const gameId = gameAppid ? Number(gameAppid) : undefined;
  const isGlobalStats = !gameAppid || Number.isNaN(gameId);
  const storageKey = useMemo(() => `statsPageState:${gameAppid ?? 'undefined'}`, [gameAppid]);
  const savedState = useMemo(() => {
    const value = sessionStorage.getItem(storageKey);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as StatsPageScrollState;
    } catch {
      sessionStorage.removeItem(storageKey);
      return null;
    }
  }, [storageKey]);
  const restoreScrollRef = useRef(savedState?.scrollY ?? 0);
  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(
    Boolean(savedState && savedState.scrollY > 0)
  );

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify({ scrollY: window.scrollY }));
  }, [storageKey]);

  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(storageKey, JSON.stringify({ scrollY: window.scrollY }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [storageKey]);

  useEffect(() => {
    if (!shouldRestoreScroll) {
      return;
    }

    const savedScrollY = restoreScrollRef.current;

    const animationFrameId = window.requestAnimationFrame(() => {
      window.scrollTo(0, savedScrollY);

      window.setTimeout(() => {
        window.scrollTo(0, savedScrollY);
        setShouldRestoreScroll(false);
      }, 150);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [shouldRestoreScroll]);

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
      <div className="stats-page page-shell">
        <Box className="page-shell__header stats-page__header">
          <IconButton className="page-shell__back" onClick={handleGoBack} id="return">
            <FaArrowLeft />
          </IconButton>
          <div className="stats-header-text">
            <Typography variant="h4" component="h1" className="page-shell__title stats-page__title">
              {isGlobalStats ? t('statsTitleGlobal') : t('statsTitleGame')}
            </Typography>
            <Typography variant="subtitle2" className="stats-subtitle">
              {isGlobalStats ? t('statsSubtitleGlobal') : `${t('statsSubtitleGame')} ${gameId}`}
            </Typography>
          </div>
        </Box>
        <div className="charts-container">
          {charts.map((chart) => (
            <Card
              key={`card-${chart.title}`}
              className={`chart-card${chart.wide ? ' chart-card--wide' : ''}`}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom className="chart-card__title">
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
