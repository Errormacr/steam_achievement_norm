import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { ArrowBack } from '@mui/icons-material';
import i18n from 'i18next';
import { Container, Box, IconButton } from '@mui/material';
import ScrollToTopButton from '../components/ScrollToTopButton';
import GameHeader from '../components/GameHeader';
import ActionBar from '../components/ActionBar';
import { useGameData } from '../hooks/useGameData';
import AchievementsDisplay from '../features/AchievementsDisplay';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { backWindow } = useParams<{ appid: string; backWindow: string }>();
  const { game, loaded, fetchUpdatedGameData } = useGameData();
  const [tableOrBox, setTableOrBox] = useState(true);
  const [unlockedFilter, setUnlockedFilter] = useState<-1 | 0 | 1>(-1);

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

  const handleUnlockedFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    value: string | null
  ) => {
    if (value === null) {
      return;
    }

    setUnlockedFilter(Number(value) as -1 | 0 | 1);
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
          unlockedFilter={unlockedFilter}
          onUnlockedFilterChange={handleUnlockedFilterChange}
        />
        <Box>
          {loaded && (game.appid !== 0) &&
              <AchievementsDisplay
                  tableOrBox={tableOrBox}
                  minPercent={0}
                  maxPercent={100}
                  date={undefined }
                  appid={game.appid}
                  unlocked={unlockedFilter}
                  all={false}
              />
         }
        </Box>
      </Container>
    </I18nextProvider>
  );
};

export default GamePage;
