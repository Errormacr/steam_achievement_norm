import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';

import AchRareHistogram from '../features/AchRareHistogram';
import AchTimeHistogram from '../features/AchTimeHistogram';
import AchAccPercentHistogram from '../features/AchAccPercentHistogram';
import GamesByCompletionDiagram from '../features/GamesByCompletionDiagram';
import GamesPercentsByTimeChart from '../features/GamesPercentsByTimeChart';
import { useScrollRestore } from '../hooks/useScrollRestore';

import '../styles/scss/StatsPage.scss';
import '../styles/scss/PageShell.scss';

const ChartCard: React.FC<{ title: string; wide?: boolean; children: React.ReactNode }> = ({ title, wide, children }) => (
  <Card className={`chart-card${wide ? ' chart-card--wide' : ''}`}>
    <CardContent>
      <Typography variant="h6" component="h2" gutterBottom className="chart-card__title">
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameAppid } = useParams<{ gameAppid?: string }>();
  const { t } = useTranslation();
  const gameId = gameAppid ? Number(gameAppid) : undefined;
  const isGlobalStats = !gameAppid || Number.isNaN(gameId);
  const storageKey = useMemo(() => `statsPage:${gameAppid ?? 'global'}`, [gameAppid]);

  // Call hook for its side effect (scroll restore via useEffect)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _restore = useScrollRestore(storageKey);

  const handleGoBack = () => {
    if (globalThis.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  const charts = useMemo(() => {
    const base = [
      {
        title: t('achievementsDistributionByPlayers'),
        content: <AchRareHistogram gameAppid={gameId} />,
        wide: true as const
      },
      {
        title: t('achievementsReceivedPerDay'),
        content: <AchTimeHistogram gameAppid={gameId} />,
        wide: true as const
      }
    ];
    if (isGlobalStats) {
      base.push(
        {
          title: t('averageAccountAchievementsByDay'),
          content: <AchAccPercentHistogram />,
          wide: true as const
        },
        {
          title: t('gamesByCompletion'),
          content: <GamesByCompletionDiagram />,
          wide: true as const
        },
        {
          title: t('gamesPercentsByTime'),
          content: <GamesPercentsByTimeChart />,
          wide: true as const
        }
      );
    }
    return base;
  }, [gameId, isGlobalStats, t]);

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
            <ChartCard key={chart.title} title={chart.title} wide={chart.wide}>
              {chart.content}
            </ChartCard>
          ))}
        </div>
      </div>
    </I18nextProvider>
  );
};

export default StatsPage;
