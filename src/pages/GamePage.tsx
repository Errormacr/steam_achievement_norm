import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { ArrowBack } from '@mui/icons-material';
import i18n from 'i18next';
import { Container, Box, IconButton } from '@mui/material';

import Table from '../components/Table';
import ScrollToTopButton from '../components/ScrollToTopButton';
import AchBox from '../features/AchContainer';
import GameHeader from '../components/GameHeader';
import ActionBar from '../components/ActionBar';
import { useGameData } from '../hooks/useGameData';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { appid, backWindow } = useParams<{ appid: string; backWindow: string }>();
  const { game, loaded, fetchUpdatedGameData } = useGameData();
  const [tableOrBox, setTableOrBox] = useState(true);

  useEffect(() => {
    const boxView = localStorage.getItem('boxView') === 'true';
    if (!boxView) {
      setTableOrBox(false);
    }
  }, []);

  const handleToggleView = () => {
    setTableOrBox(!tableOrBox);
    localStorage.setItem('boxView', String(!tableOrBox));
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Container maxWidth={false}>
        <ToastContainer />
        <ScrollToTopButton />
        <IconButton
          onClick={() => {
            if (backWindow === 'main') {
              navigate('/');
            } else {
              navigate('/Games');
            }
          }}
        >
          <ArrowBack />
        </IconButton>
        <GameHeader game={game} />
        <ActionBar
          gameAppid={game.appid}
          onUpdate={fetchUpdatedGameData}
          onToggleView={handleToggleView}
        />
        <Box>
          {loaded &&
            (tableOrBox
              ? (
              <Table appid={+appid} all={false} />
                )
              : (
              <AchBox minPercent={0} maxPercent={100} appid={+appid} all={false} />
                ))}
        </Box>
      </Container>
    </I18nextProvider>
  );
};

export default GamePage;
