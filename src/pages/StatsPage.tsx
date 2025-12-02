import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';
import { Card, CardContent, Typography } from '@mui/material';

import AchRareDiagram from '../features/AchRareDiagram';
import AchRareHistogram from '../features/AchRareHistogram';
import AchTimeHistogram from '../features/AchTimeHistogram';
import AchCountTimeHistogram from '../features/AchCountTimeHistogram';
import AchAccPercentHistogram from '../features/AchAccPercentHistogram';
import ScrollToTopButton from '../components/ScrollToTopButton';

import '../styles/scss/StatsPage.scss';

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameAppid } = useParams<{ gameAppid?: string }>();
  const { t } = useTranslation();

  const charts = [
    {
      title: 'achievementsFrequencyByRarity',
      component: <AchRareDiagram gameAppid={gameAppid ? +gameAppid : undefined} />
    },
    {
      title: 'achievementsDistributionByPlayers',
      component: <AchRareHistogram gameAppid={gameAppid ? +gameAppid : undefined} />
    },
    {
      title: 'achievementsReceivedPerDay',
      component: <AchTimeHistogram gameAppid={gameAppid ? +gameAppid : undefined} />
    },
    {
      title: 'totalAchievementsPerDay',
      component: <AchCountTimeHistogram gameAppid={gameAppid ? +gameAppid : undefined} />
    }
  ];

  if (!gameAppid) {
    charts.push({
      title: 'averageAccountAchievementsByDay',
      component: <AchAccPercentHistogram />
    });
  }

  return (
    <I18nextProvider i18n={i18n}>
      <FaArrowLeft className="button-icon return" onClick={() => navigate('/')} id="return" />
      <div className="stats-page">
        <Typography variant="h4" component="h1" gutterBottom>
          {t('GameStats')}
        </Typography>
        <div className="charts-container">
          {charts.map((chart) => (
            <Card key={`card-${chart.title}`} className="chart-card">
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
