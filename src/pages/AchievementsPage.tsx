import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import i18n from 'i18next';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';

import ScrollToTopButton from '../components/ScrollToTopButton';
import { useAchievementsPageData } from '../hooks/useAchievementsPageData';
import AchievementsDisplay from '../features/AchievementsDisplay';

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
    gameAppid
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
      <Container maxWidth={false}>
        <ScrollToTopButton />
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2
          }}
        >
          <IconButton onClick={handleGoBack} sx={{ position: 'absolute', left: 16 }}>
            <FaArrowLeft />
          </IconButton>
          <Typography variant="h6">
            {achCount} {t('Ach')}
          </Typography>
          <Button variant="contained" onClick={handleToggleView} sx={{ position: 'absolute', right: 16 }}>
            {t('SwitchTable')}
          </Button>
        </Box>
        <Box>
          {loaded && (
            <AchievementsDisplay
              tableOrBox={tableOrBox}
              minPercent={+minPercent}
              maxPercent={+maxPercent}
              date={date === 'undefined' ? undefined : date}
              appid={Number(gameAppid) || undefined}
              unlocked={true}
              all={!+gameAppid}
            />
          )}
        </Box>
      </Container>
    </I18nextProvider>
  );
};

export default AchPage;