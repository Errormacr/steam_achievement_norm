import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';

import ScrollToTopButton from '../components/ScrollToTopButton';
import { useAchievementsPageData } from '../hooks/useAchievementsPageData';
import AchievementsDisplay from '../features/AchievementsDisplay';
import '../styles/scss/PageShell.scss';

const AchPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { minPercent, maxPercent, date, backWindow, gameAppid } = useParams<{
    minPercent?: string;
    maxPercent?: string;
    date?: string;
    backWindow?: string;
    gameAppid?: string;
  }>();

  const { tableOrBox, setTableOrBox, loaded, achCount } = useAchievementsPageData({
    minPercent,
    maxPercent,
    date,
    gameAppid,
    unlocked: 1
  });

  const handleToggleView = () => {
    const newTableView = !tableOrBox;
    setTableOrBox(newTableView);
    localStorage.setItem('boxView', String(newTableView));
  };

  const handleGoBack = () => {
    if (backWindow === 'Stats') {
      navigate(`/${backWindow}${gameAppid ? '/' + gameAppid : ''}`);
    } else {
      navigate('/');
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Container maxWidth={false} className="page-shell">
        <ScrollToTopButton />
        <Box className="page-shell__header">
          <IconButton onClick={handleGoBack} className="page-shell__back">
            <FaArrowLeft />
          </IconButton>
          <Typography variant="h6" className="page-shell__title">
            {achCount} {t('Ach')}
          </Typography>
          <Box className="page-shell__actions">
            <Button variant="contained" onClick={handleToggleView} className="page-shell__button">
              {t('SwitchTable')}
            </Button>
          </Box>
        </Box>
        <Box>
          {loaded && (
            <AchievementsDisplay
              tableOrBox={tableOrBox}
              minPercent={+minPercent}
              maxPercent={+maxPercent}
              date={date === 'undefined' ? undefined : date}
              appid={Number(gameAppid) || undefined}
              unlocked={1}
              all={!+gameAppid}
            />
          )}
        </Box>
      </Container>
    </I18nextProvider>
  );
};

export default AchPage;
